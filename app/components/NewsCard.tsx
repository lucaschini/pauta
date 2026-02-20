'use client';

import { Article, SourceStyle, timeAgo, highlightText } from '../types';

interface NewsCardProps {
  article: Article;
  style: SourceStyle;
  sourceName: string;
  isNew: boolean;
  isSaved: boolean;
  globalFilter: string;
  onSave: () => void;
}

export default function NewsCard({
  article,
  style,
  sourceName,
  isNew,
  isSaved,
  globalFilter,
  onSave,
}: NewsCardProps) {
  const titleHtml = highlightText(article.title, globalFilter);

  return (
    <div
      className={`news-card${isNew ? ' card-new-anim' : ''}`}
      style={{
        padding: '14px 16px',
        borderBottom: '1px solid #2e2e35',
        cursor: 'pointer',
        transition: 'background 0.15s',
        position: 'relative',
        borderLeft: isNew ? '2px solid #e8c547' : isSaved ? '2px solid #4ade80' : '2px solid transparent',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.background = '#222226';
        const actions = e.currentTarget.querySelector('.card-actions') as HTMLElement;
        if (actions) actions.style.opacity = '1';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.background = 'transparent';
        const actions = e.currentTarget.querySelector('.card-actions') as HTMLElement;
        if (actions) actions.style.opacity = '0';
      }}
    >
      {/* Tag row */}
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '9px',
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: style.color,
        }}
      >
        {sourceName.split(' ')[0].toUpperCase()}
        {isNew && (
          <span
            style={{
              background: '#e8c547',
              color: '#000',
              padding: '1px 5px',
              borderRadius: '2px',
              fontSize: '9px',
              fontWeight: 700,
            }}
          >
            NOVO
          </span>
        )}
      </div>

      {/* Title */}
      <div
        dangerouslySetInnerHTML={{ __html: titleHtml }}
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '14px',
          lineHeight: 1.45,
          color: '#f0eeea',
          marginBottom: '8px',
          fontWeight: 400,
        }}
      />

      {/* Meta */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            color: '#6b6b7a',
          }}
        >
          {timeAgo(article.pubDate)}
        </span>

        {/* Actions — hidden until hover */}
        <div
          className="card-actions"
          style={{
            display: 'flex',
            gap: '4px',
            opacity: 0,
            transition: 'opacity 0.15s',
          }}
        >
          {article.link && (
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                border: '1px solid #2e2e35',
                borderRadius: '4px',
                padding: '3px 8px',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '11px',
                color: '#6b6b7a',
                textDecoration: 'none',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#e8c547';
                e.currentTarget.style.color = '#e8c547';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#2e2e35';
                e.currentTarget.style.color = '#6b6b7a';
              }}
            >
              ↗
            </a>
          )}
          <button
            onClick={e => { e.stopPropagation(); onSave(); }}
            style={{
              background: isSaved ? 'rgba(74,222,128,0.1)' : 'none',
              border: `1px solid ${isSaved ? '#4ade80' : '#2e2e35'}`,
              borderRadius: '4px',
              padding: '3px 8px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px',
              color: isSaved ? '#4ade80' : '#6b6b7a',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              if (!isSaved) {
                e.currentTarget.style.borderColor = '#4ade80';
                e.currentTarget.style.color = '#4ade80';
              }
            }}
            onMouseLeave={e => {
              if (!isSaved) {
                e.currentTarget.style.borderColor = '#2e2e35';
                e.currentTarget.style.color = '#6b6b7a';
              }
            }}
          >
            {isSaved ? '📌' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}
