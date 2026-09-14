"use client";

// Convención de Next.js App Router: atrapa errores en el layout raíz mismo
// (más raro que app/error.tsx, pero sin esto un fallo ahí deja al usuario
// con una pantalla en blanco). Reemplaza <html>/<body> por completo, así que
// usa estilos inline en vez de depender de globals.css.

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="es">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          padding: "2rem",
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#f6f7f9",
          color: "#1b2430",
        }}
      >
        <h1 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Algo salió mal</h1>
        <p style={{ maxWidth: "24rem", fontSize: "0.875rem", color: "#58626f" }}>
          Ocurrió un error inesperado cargando la aplicación. Intenta recargar la página.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: "0.5rem",
            borderRadius: "0.375rem",
            background: "#24405e",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "0.875rem",
            padding: "0.625rem 1.25rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          Reintentar
        </button>
      </body>
    </html>
  );
}
