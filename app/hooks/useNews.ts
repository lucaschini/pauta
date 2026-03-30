"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Article, Source } from "../types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "";

interface ColumnData {
  [sourceId: string]: Article[] | undefined;
}

interface UseNewsReturn {
  sources: Source[];
  columnData: ColumnData;
  wsConnected: boolean; // mantido por compatibilidade com o Header
  lastUpdate: string;
  refreshColumn: (sourceId: string) => Promise<void>;
  refreshingCols: Set<string>;
  newIds: Record<string, boolean>;
}

export function useNews(): UseNewsReturn {
  const [sources, setSources] = useState<Source[]>([]);
  const [columnData, setColumnData] = useState<ColumnData>({});
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState("");
  const [refreshingCols, setRefreshingCols] = useState<Set<string>>(new Set());
  const [newIds, setNewIds] = useState<Record<string, boolean>>({});

  const seenIds = useRef<Record<string, boolean>>({});
  const esRef = useRef<EventSource | null>(null);

  const processArticles = useCallback((rawArticles: any[]): Article[] => {
    return rawArticles.map((a: any) => ({
      id: a.id,
      title: a.title,
      link: a.url,
      pubDate: a.publishedAt,
      source: a.source,
    }));
  }, []);

  const processUpdate = useCallback(
    (sourceId: string, data: any) => {
      const articles = processArticles(data.articles || []);

      // Primeira carga — só registra os ids, não marca como novo
      const isFirstLoad = !articles.some((a) => seenIds.current[a.id]);

      if (isFirstLoad) {
        articles.forEach((a) => {
          seenIds.current[a.id] = true;
        });
      } else {
        const fresh: Record<string, boolean> = {};
        articles.forEach((a) => {
          if (!seenIds.current[a.id]) {
            fresh[a.id] = true;
            seenIds.current[a.id] = true;
          }
        });
        if (Object.keys(fresh).length > 0) {
          setNewIds((prev) => ({ ...prev, ...fresh }));
        }
      }

      setColumnData((prev) => ({ ...prev, [sourceId]: articles }));
      const now = new Date();
      setLastUpdate(
        `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`,
      );
    },
    [processArticles],
  );

  const connectSSE = useCallback(() => {
    // Fecha conexão anterior se existir
    esRef.current?.close();

    const es = new EventSource(`${API}/events`);
    esRef.current = es;

    es.onopen = () => setConnected(true);

    es.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "update") processUpdate(msg.source, msg.data);
      } catch {}
    };

    es.onerror = () => {
      setConnected(false);
      es.close();
      // EventSource já reconecta automaticamente, mas fechamos e reabrimos
      // manualmente para ter controle do estado `connected`
      setTimeout(connectSSE, 5000);
    };
  }, [processUpdate]);

  useEffect(() => {
    fetch(`${API}/sources`)
      .then((r) => r.json())
      .then(setSources)
      .catch(console.error);

    connectSSE();

    return () => esRef.current?.close();
  }, [connectSSE]);

  const refreshColumn = useCallback(
    async (sourceId: string) => {
      setRefreshingCols((prev) => new Set(Array.from(prev).concat(sourceId)));
      try {
        const res = await fetch(`${API}/feed?sources=${sourceId}&limit=20`);
        const data = await res.json();
        const sourceData = data.feed[0];
        if (!sourceData.error) {
          const articles = processArticles(sourceData.articles);
          setColumnData((prev) => ({ ...prev, [sourceId]: articles }));
        }
      } catch {}
      setTimeout(() => {
        setRefreshingCols((prev) => {
          const next = new Set(Array.from(prev));
          next.delete(sourceId);
          return next;
        });
      }, 700);
    },
    [processArticles],
  );

  return {
    sources,
    columnData,
    wsConnected: connected, // alias para não quebrar o Header
    lastUpdate,
    refreshColumn,
    refreshingCols,
    newIds,
  };
}
