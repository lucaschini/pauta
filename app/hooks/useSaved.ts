'use client';

import { useState, useEffect, useCallback } from 'react';
import { Article, SavedItem } from '../types';

const STORAGE_KEY = 'pauta_saved';

export function useSaved() {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setSavedItems(JSON.parse(stored));
    } catch {}
  }, []);

  const persist = useCallback((items: SavedItem[]) => {
    setSavedItems(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, []);

  const isSaved = useCallback((id: string) => {
    return savedItems.some(i => i.id === id);
  }, [savedItems]);

  const toggleSave = useCallback((article: Article, sourceName: string) => {
    setSavedItems(prev => {
      const exists = prev.some(i => i.id === article.id);
      const next = exists
        ? prev.filter(i => i.id !== article.id)
        : [...prev, { ...article, sourceName, savedAt: Date.now() }];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  return { savedItems, isSaved, toggleSave };
}
