"use client";

export default function OfflineScreen() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0e0e0f",
        gap: "24px",
        padding: "40px",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            fontSize: "36px",
            color: "#e8c547",
            letterSpacing: "-0.5px",
          }}
        >
          pauta
        </span>
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "12px",
            color: "#6b6b7a",
            letterSpacing: "0.05em",
          }}
        >
          sp.monitor
        </span>
      </div>

      {/* Mensagem */}
      <div
        style={{
          textAlign: "center",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <p
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: "18px",
            fontWeight: 600,
            color: "#f0eeea",
          }}
        >
          Serviço fora do horário
        </p>
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "13px",
            color: "#6b6b7a",
            lineHeight: 1.7,
          }}
        >
          O Pauta opera das <span style={{ color: "#e8c547" }}>12h às 20h</span>{" "}
          (horário de Brasília).
          <br />
          Volte nesse período para acompanhar
          <br />
          as últimas notícias de São Paulo.
        </p>
      </div>

      {/* Horário atual */}
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "11px",
          color: "#3e3e48",
          marginTop: "8px",
        }}
      >
        {new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "America/Sao_Paulo",
        })}{" "}
        · Brasília
      </div>
    </div>
  );
}
