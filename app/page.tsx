"use client";

import { useState, useCallback, useRef } from "react";
import { useNews } from "./hooks/useNews";
import { useSaved } from "./hooks/useSaved";
import Header from "./components/Header";
import Column from "./components/Column";
import SavedPanel from "./components/SavedPanel";
import { Article } from "./types";

export default function Home() {
  const {
    sources,
    columnData,
    wsConnected,
    lastUpdate,
    refreshColumn,
    refreshingCols,
  } = useNews();
  const { savedItems, isSaved, toggleSave } = useSaved();

  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>(
    {},
  );
  const [savedOpen, setSavedOpen] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const newIdsRef = useRef<Record<string, boolean>>({});

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToast(""), 2500);
  }, []);

  const handleSave = useCallback(
    (article: Article, sourceId: string) => {
      const src = sources.find((s) => s.id === sourceId);
      const wasSaved = isSaved(article.id);
      toggleSave(article, src?.name || sourceId);
      showToast(wasSaved ? "Matéria removida das salvas" : "📌 Matéria salva!");
    },
    [sources, isSaved, toggleSave, showToast],
  );

  const handleRefreshAll = useCallback(() => {
    sources.forEach((src) => refreshColumn(src.id));
  }, [sources, refreshColumn]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0e0e0f",
        overflow: "hidden",
      }}
    >
      <Header
        wsConnected={wsConnected}
        lastUpdate={lastUpdate}
        savedCount={savedItems.length}
        onToggleSaved={() => setSavedOpen((o) => !o)}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        onRefreshAll={handleRefreshAll}
      />

      {/* Columns area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          overflowX: "auto",
          overflowY: "hidden",
          scrollbarWidth: "thin",
          scrollbarColor: "#2e2e35 transparent",
        }}
      >
        {sources.length === 0 ? (
          <div
            style={{
              padding: "48px 40px",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "13px",
              color: "#e05a3a",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <span>⚠ Conectando ao backend...</span>
          </div>
        ) : (
          sources.map((source) => (
            <Column
              key={source.id}
              source={source}
              articles={columnData[source.id]}
              newIds={newIdsRef.current}
              globalFilter={globalFilter}
              columnFilter={columnFilters[source.id] || ""}
              onColumnFilterChange={(val) =>
                setColumnFilters((prev) => ({ ...prev, [source.id]: val }))
              }
              isSaved={isSaved}
              onSave={(article) => handleSave(article, source.id)}
              onRefresh={() => refreshColumn(source.id)}
              isRefreshing={refreshingCols.has(source.id)}
            />
          ))
        )}
      </div>

      {/* Saved panel */}
      {savedOpen && (
        <SavedPanel
          items={savedItems}
          onRemove={(item) => {
            toggleSave(item, item.sourceName);
            showToast("Matéria removida das salvas");
          }}
          onClose={() => setSavedOpen(false)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#222226",
            border: "1px solid #2e2e35",
            borderRadius: "6px",
            padding: "10px 20px",
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: "13px",
            color: "#f0eeea",
            zIndex: 300,
            pointerEvents: "none",
            animation: "fadeUp 0.3s ease-out",
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
