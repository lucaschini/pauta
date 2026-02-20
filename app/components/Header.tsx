'use client';

import { useRef, useEffect } from 'react';

interface HeaderProps {
  wsConnected: boolean;
  lastUpdate: string;
  savedCount: number;
  onToggleSaved: () => void;
  globalFilter: string;
  onGlobalFilterChange: (val: string) => void;
  onRefreshAll: () => void;
}

export default function Header({
  wsConnected,
  lastUpdate,
  savedCount,
  onToggleSaved,
  globalFilter,
  onGlobalFilterChange,
  onRefreshAll,
}: HeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcut: Cmd/Ctrl+K focuses filter
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        onGlobalFilterChange('');
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onGlobalFilterChange]);

  return (
    <header
      style={{
        background: '#18181b',
        borderBottom: '1px solid #2e2e35',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: '16px',
        flexShrink: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexShrink: 0 }}>
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            fontSize: '22px',
            color: '#e8c547',
            letterSpacing: '-0.5px',
          }}
        >
          pauta
        </span>
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            color: '#6b6b7a',
            letterSpacing: '0.05em',
          }}
        >
          sp.monitor
        </span>
      </div>

      {/* Global search — center, takes remaining space */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '520px',
          }}
        >
          {/* Search icon */}
          <span
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b6b7a',
              fontSize: '14px',
              pointerEvents: 'none',
              fontFamily: "'IBM Plex Mono', monospace",
            }}
          >
            ⌕
          </span>

          <input
            ref={inputRef}
            type="text"
            placeholder="Filtrar todas as colunas..."
            value={globalFilter}
            onChange={e => onGlobalFilterChange(e.target.value)}
            style={{
              width: '100%',
              background: '#0e0e0f',
              border: `1px solid ${globalFilter ? '#e8c547' : '#2e2e35'}`,
              borderRadius: '6px',
              color: '#f0eeea',
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: '13px',
              padding: '7px 40px 7px 34px',
              outline: 'none',
              transition: 'border-color 0.15s, box-shadow 0.15s',
              boxShadow: globalFilter ? '0 0 0 2px rgba(232,197,71,0.12)' : 'none',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = '#e8c547';
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(232,197,71,0.12)';
            }}
            onBlur={e => {
              if (!globalFilter) {
                e.currentTarget.style.borderColor = '#2e2e35';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          />

          {/* Clear button / shortcut hint */}
          {globalFilter ? (
            <button
              onClick={() => onGlobalFilterChange('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#6b6b7a',
                cursor: 'pointer',
                fontSize: '16px',
                lineHeight: 1,
                padding: '2px',
              }}
            >
              ×
            </button>
          ) : (
            <span
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '10px',
                color: '#3e3e48',
                pointerEvents: 'none',
                letterSpacing: '0.03em',
              }}
            >
              ⌘K
            </span>
          )}
        </div>
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        {/* WS status + timestamp */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '11px',
            color: '#6b6b7a',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: wsConnected ? '#4ade80' : '#e05a3a',
              display: 'inline-block',
              animation: wsConnected ? 'pulseDot 2s cubic-bezier(0.4,0,0.6,1) infinite' : 'none',
              transition: 'background 0.3s',
            }}
          />
          {lastUpdate ? `às ${lastUpdate}` : wsConnected ? 'conectado' : 'offline'}
        </div>

        {/* Refresh all */}
        <button
          onClick={onRefreshAll}
          title="Atualizar todas as colunas"
          style={{
            background: 'none',
            border: '1px solid #2e2e35',
            color: '#6b6b7a',
            borderRadius: '4px',
            padding: '5px 10px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            lineHeight: 1,
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
          ↻
        </button>

        {/* Saved panel toggle */}
        <button
          onClick={onToggleSaved}
          style={{
            background: 'none',
            border: '1px solid #2e2e35',
            color: '#f0eeea',
            borderRadius: '4px',
            padding: '5px 12px',
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#e8c547';
            e.currentTarget.style.color = '#e8c547';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#2e2e35';
            e.currentTarget.style.color = '#f0eeea';
          }}
        >
          📌 Salvas
          {savedCount > 0 && (
            <span
              style={{
                background: '#e8c547',
                color: '#000',
                borderRadius: '10px',
                padding: '1px 6px',
                fontSize: '10px',
                fontWeight: 700,
              }}
            >
              {savedCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
