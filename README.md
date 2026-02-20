# pauta-frontend

Frontend Next.js do painel de matérias jornalísticas de SP.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- WebSocket nativo para updates em tempo real

## Estrutura

```
app/
├── components/
│   ├── Header.tsx       # Topbar + filtro global + status WS
│   ├── Column.tsx       # Coluna de uma fonte
│   ├── NewsCard.tsx     # Card de matéria
│   └── SavedPanel.tsx   # Painel lateral de matérias salvas
├── hooks/
│   ├── useNews.ts       # Fetch de fontes + WebSocket
│   └── useSaved.ts      # Estado de matérias salvas (localStorage)
├── types.ts             # Tipos compartilhados + helpers
├── layout.tsx
├── page.tsx             # Página principal
└── globals.css
```

## Desenvolvimento

```bash
# 1. Configure a URL do backend
cp .env.local.example .env.local
# Edite NEXT_PUBLIC_API_URL se necessário

# 2. Instale as dependências
npm install

# 3. Rode o backend (em outro terminal)
cd ../pauta-backend && npm start

# 4. Rode o frontend
npm run dev
# → http://localhost:3000
```

## Filtro Global

O filtro na header filtra **todas as colunas simultaneamente** em tempo real.
Cada coluna também mantém seu próprio filtro individual.

- **⌘K** (ou Ctrl+K) — foca o filtro global
- **Esc** — limpa e desfoca o filtro global
- Quando o filtro global estiver ativo, os filtros por coluna ficam ocultos
- Matches são destacados em amarelo nas matérias

## Build de Produção

```bash
npm run build
npm start
```

## Deploy

Configure `NEXT_PUBLIC_API_URL` apontando para o backend em produção.
