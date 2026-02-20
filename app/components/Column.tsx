'use client';

import { Article, Source, getStyle } from '../types';
import NewsCard from './NewsCard';

interface ColumnProps {
  source: Source;
  articles: Article[] | undefined;
  newIds: Record<string, boolean>;
  globalFilter: string;
  columnFilter: string;
  onColumnFilterChange: (val: string) => void;
  isSaved: (id: string) => boolean;
  onSave: (article: Article) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function Column({
  source,
  articles,
  newIds,
  globalFilter,
  columnFilter,
  onColumnFilterChange,
  isSaved,
  onSave,
  onRefresh,
  isRefreshing,
}: ColumnProps) {
  const style = getStyle(source.id);
  const effectiveFilter = globalFilter || columnFilter;

  const filtered = effectiveFilter
    ? (articles || []).filter(a =>
        a.title.toLowerCase().includes(effectiveFilter.toLowerCase())
      )
    : (articles || []);

  const isLoading = articles === undefined;

  return (
    <div
      style={{
        width: '340px',
        minWidth: '340px',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #2e2e35',
        overflow: 'hidden',
        height: '100%',
      }}
    >
      {/* Column header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #2e2e35',
          background: '#18181b',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        {/* Source icon */}
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '4px',
            background: style.bg,
            color: style.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 700,
            fontFamily: "'IBM Plex Mono', monospace",
            flexShrink: 0,
          }}
        >
          {style.icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: '13px',
              fontWeight: 600,
              color: style.color,
              letterSpacing: '0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {source.name}
            {filtered.length > 0 && (
              <span
                style={{
                  background: style.bg,
                  color: style.color,
                  borderRadius: '10px',
                  padding: '1px 6px',
                  fontSize: '10px',
                  fontWeight: 700,
                  fontFamily: "'IBM Plex Mono', monospace",
                }}
              >
                {filtered.length}
              </span>
            )}
          </div>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              color: '#6b6b7a',
              marginTop: '1px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {source.url}
          </div>
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          className={isRefreshing ? 'spinning' : ''}
          title="Atualizar"
          style={{
            background: 'none',
            border: 'none',
            color: '#6b6b7a',
            cursor: 'pointer',
            fontSize: '16px',
            padding: '4px',
            borderRadius: '4px',
            lineHeight: 1,
            transition: 'color 0.15s',
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#e8c547';
            e.currentTarget.style.background = 'rgba(232,197,71,0.08)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#6b6b7a';
            e.currentTarget.style.background = 'none';
          }}
        >
          ↻
        </button>
      </div>

      {/* Per-column filter (only shown when no global filter) */}
      {!globalFilter && (
        <div
          style={{
            padding: '8px 10px',
            borderBottom: '1px solid #2e2e35',
            background: '#18181b',
            flexShrink: 0,
          }}
        >
          <input
            type="text"
            placeholder="Filtrar..."
            value={columnFilter}
            onChange={e => onColumnFilterChange(e.target.value)}
            style={{
              width: '100%',
              background: '#0e0e0f',
              border: `1px solid ${columnFilter ? '#e8c547' : '#2e2e35'}`,
              borderRadius: '4px',
              color: '#f0eeea',
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: '12px',
              padding: '5px 10px',
              outline: 'none',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = '#e8c547')}
            onBlur={e => {
              if (!columnFilter) e.currentTarget.style.borderColor = '#2e2e35';
            }}
          />
        </div>
      )}

      {/* When global filter is active, show a subtle indicator */}
      {globalFilter && (
        <div
          style={{
            padding: '5px 10px',
            borderBottom: '1px solid #2e2e35',
            background: 'rgba(232,197,71,0.06)',
            flexShrink: 0,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            color: '#e8c547',
            letterSpacing: '0.05em',
          }}
        >
          ⌕ filtrando: "{globalFilter}"
        </div>
      )}

      {/* Articles list */}
      <div
        style={{
          overflowY: 'auto',
          flex: 1,
          scrollbarWidth: 'thin',
          scrollbarColor: '#2e2e35 transparent',
        }}
      >
        {isLoading ? (
          <div
            style={{
              padding: '32px 16px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '12px',
              color: '#6b6b7a',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div
              style={{
                height: '2px',
                background: '#2e2e35',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: '40%',
                  background: '#e8c547',
                  borderRadius: '2px',
                  animation: 'slideRight 1.2s ease-in-out infinite',
                }}
              />
            </div>
            carregando matérias...
            <style>{`
              @keyframes slideRight {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(350%); }
              }
            `}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              padding: '32px 16px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '12px',
              color: '#6b6b7a',
            }}
          >
            {effectiveFilter ? `Nenhum resultado para "${effectiveFilter}"` : 'Nenhuma matéria.'}
          </div>
        ) : (
          filtered.map(article => (
            <NewsCard
              key={article.id}
              article={article}
              style={style}
              sourceName={source.name}
              isNew={!!newIds[article.id]}
              isSaved={isSaved(article.id)}
              globalFilter={effectiveFilter}
              onSave={() => onSave(article)}
            />
          ))
        )}
      </div>
    </div>
  );
}
