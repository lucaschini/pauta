'use client';

import { SavedItem, timeAgo } from '../types';

interface SavedPanelProps {
  items: SavedItem[];
  onRemove: (item: SavedItem) => void;
  onClose: () => void;
}

export default function SavedPanel({ items, onRemove, onClose }: SavedPanelProps) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 199,
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          top: '56px',
          right: 0,
          bottom: 0,
          width: '380px',
          background: '#18181b',
          borderLeft: '1px solid #2e2e35',
          zIndex: 200,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideIn 0.2s ease-out',
        }}
      >
        <div
          style={{
            padding: '14px 16px',
            borderBottom: '1px solid #2e2e35',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: '13px',
              fontWeight: 600,
              color: '#f0eeea',
            }}
          >
            📌 Matérias salvas
            {items.length > 0 && (
              <span
                style={{
                  marginLeft: '8px',
                  background: '#e8c547',
                  color: '#000',
                  borderRadius: '10px',
                  padding: '1px 6px',
                  fontSize: '10px',
                  fontWeight: 700,
                  fontFamily: "'IBM Plex Mono', monospace",
                }}
              >
                {items.length}
              </span>
            )}
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b6b7a',
              cursor: 'pointer',
              fontSize: '18px',
              lineHeight: 1,
              padding: '2px',
            }}
          >
            ×
          </button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {items.length === 0 ? (
            <div
              style={{
                padding: '32px 20px',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '12px',
                color: '#6b6b7a',
                lineHeight: 1.7,
                textAlign: 'center',
              }}
            >
              Nenhuma matéria salva ainda.
              <br />
              Passe o mouse e clique em "Salvar".
            </div>
          ) : (
            [...items].reverse().map(item => (
              <div
                key={item.id}
                style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid #2e2e35',
                }}
              >
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '10px',
                    color: '#6b6b7a',
                    marginBottom: '6px',
                  }}
                >
                  {item.sourceName} · {timeAgo(item.savedAt)}
                </div>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '14px',
                    lineHeight: 1.45,
                    color: '#f0eeea',
                    marginBottom: '10px',
                  }}
                >
                  {item.title}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        border: '1px solid #2e2e35',
                        borderRadius: '4px',
                        padding: '4px 10px',
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
                      ↗ Abrir
                    </a>
                  )}
                  <button
                    onClick={() => onRemove(item)}
                    style={{
                      background: 'none',
                      border: '1px solid #2e2e35',
                      borderRadius: '4px',
                      padding: '4px 10px',
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '11px',
                      color: '#6b6b7a',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#e05a3a';
                      e.currentTarget.style.color = '#e05a3a';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#2e2e35';
                      e.currentTarget.style.color = '#6b6b7a';
                    }}
                  >
                    × Remover
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
