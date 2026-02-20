export interface Article {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

export interface Source {
  id: string;
  name: string;
  url: string;
}

export interface SavedItem extends Article {
  sourceName: string;
  savedAt: number;
}

export interface SourceStyle {
  color: string;
  bg: string;
  icon: string;
}

export const SOURCE_STYLES: Record<string, SourceStyle> = {
  g1: { color: "#e05a3a", bg: "#2a1a15", icon: "G1" },
  uol: { color: "#5a8fe0", bg: "#151a2a", icon: "UL" },
  folha: { color: "#e0b040", bg: "#1f1a10", icon: "FS" },
  agsp: { color: "#40c080", bg: "#101f15", icon: "SP" },
  metropoles: { color: "#c060e0", bg: "#1a1020", icon: "MT" },
  r7: { color: "#e04040", bg: "#1f1010", icon: "R7" },
  estadao: { color: "#6a9fe0", bg: "#151a2a", icon: "ES" },
  oglobo: { color: "#1e4c9a", bg: "#060f1f", icon: "OG" },
};

export const DEFAULT_STYLE: SourceStyle = {
  color: "#888",
  bg: "#1a1a1a",
  icon: "??",
};

export function getStyle(id: string): SourceStyle {
  return SOURCE_STYLES[id] || DEFAULT_STYLE;
}

export function timeAgo(pubDate: string | number | undefined): string {
  if (!pubDate) return "—";
  const d = new Date(pubDate);
  if (isNaN(d.getTime())) return "—";
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "agora";
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(
    new RegExp(`(${escaped})`, "gi"),
    '<mark class="filter-highlight">$1</mark>',
  );
}
