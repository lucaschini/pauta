'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Article, Source } from '../types';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ColumnData {
  [sourceId: string]: Article[] | undefined;
}

interface UseNewsReturn {
  sources: Source[];
  columnData: ColumnData;
  wsConnected: boolean;
  lastUpdate: string;
  refreshColumn: (sourceId: string) => Promise<void>;
  refreshingCols: Set<string>;
}

export function useNews(): UseNewsReturn {
  const [sources, setSources] = useState<Source[]>([]);
  const [columnData, setColumnData] = useState<ColumnData>({});
  const [wsConnected, setWsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('');
  const [refreshingCols, setRefreshingCols] = useState<Set<string>>(new Set());
  const seenIds = useRef<Record<string, boolean>>({});
  const wsRef = useRef<WebSocket | null>(null);

  const processArticles = useCallback((rawArticles: any[]): Article[] => {
    return rawArticles.map((a: any) => ({
      id: a.id,
      title: a.title,
      link: a.url,
      pubDate: a.publishedAt,
      source: a.source,
    }));
  }, []);

  const processWsUpdate = useCallback((sourceId: string, data: any) => {
    const articles = processArticles(data.articles || []);
    setColumnData(prev => ({ ...prev, [sourceId]: articles }));
    const now = new Date();
    setLastUpdate(`${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`);
  }, [processArticles]);

  const connectWs = useCallback(() => {
    const wsUrl = API.replace(/^http/, 'ws');
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setWsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'update') {
          processWsUpdate(msg.source, msg.data);
        }
      } catch {}
    };

    ws.onclose = () => {
      setWsConnected(false);
      setTimeout(connectWs, 5000);
    };

    ws.onerror = () => ws.close();
  }, [processWsUpdate]);

  useEffect(() => {
    // Load sources list
    fetch(`${API}/sources`)
      .then(r => r.json())
      .then(setSources)
      .catch(console.error);

    // Connect WebSocket
    connectWs();

    return () => {
      wsRef.current?.close();
    };
  }, [connectWs]);

  const refreshColumn = useCallback(async (sourceId: string) => {
    setRefreshingCols(prev => new Set(Array.from(prev).concat(sourceId)));
    try {
      const res = await fetch(`${API}/feed?sources=${sourceId}&limit=20`);
      const data = await res.json();
      const sourceData = data.feed[0];
      if (!sourceData.error) {
        const articles = processArticles(sourceData.articles);
        setColumnData(prev => ({ ...prev, [sourceId]: articles }));
      }
    } catch {}
    setTimeout(() => {
      setRefreshingCols(prev => {
        const next = new Set(Array.from(prev));
        next.delete(sourceId);
        return next;
      });
    }, 700);
  }, [processArticles]);

  return { sources, columnData, wsConnected, lastUpdate, refreshColumn, refreshingCols };
}
