"use client";

// Recuperación de contraseña, paso 1: el usuario pide el link por correo.
// Supabase envía un email con un link que redirige a /restablecer, donde
// realmente se define la contraseña nueva (ver esa página).

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { VolverInicioLink } from "@/components/volver-inicio-link";
import { createClient } from "@/lib/supabase/client";
import { isValidEmail } from "@/lib/validation";

const INPUT_CLASS =
  "rounded-md border bg-ground px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent";

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim() || !isValidEmail(email)) {
      setError("Ingresa un correo válido.");
      return;
    }

    setError(null);
    setLoading(true);
    const supabase = createClient();
    // No revelamos si el correo existe o no (evita filtrar qué correos están
    // registrados) — se muestra el mismo mensaje de éxito pase lo que pase.
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/restablecer`,
    });
    setLoading(false);
    setEnviado(true);
  }

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center bg-ground p-6">
      <VolverInicioLink />

      <Link href="/" className="font-display mb-8 text-xl">
        VentaFácil
      </Link>

      <div className="w-full max-w-sm rounded-xl border border-line bg-surface p-7">
        {enviado ? (
          <>
            <h1 className="font-display mb-1 text-2xl">Revisa tu correo</h1>
            <p className="text-sm text-ink-soft">
              Si <span className="font-semibold text-ink">{email.trim()}</span> tiene una cuenta
              con nosotros, te enviamos un link para crear una nueva contraseña.
            </p>
          </>
        ) : (
          <>
            <h1 className="font-display mb-1 text-2xl">Recuperar contraseña</h1>
            <p className="mb-6 text-sm text-ink-soft">
              Ingresa tu correo y te enviamos un link para crear una nueva.
            </p>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-semibold text-ink-soft">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@negocio.com"
                  aria-invalid={Boolean(error)}
                  className={`${INPUT_CLASS} ${error ? "border-danger" : "border-line-strong"}`}
                />
                {error && <p className="text-xs text-danger">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 rounded-md bg-accent px-5 py-3 text-sm font-bold text-accent-ink transition-colors hover:bg-accent/90 disabled:opacity-60"
              >
                {loading ? "Enviando..." : "Enviar link"}
              </button>
            </form>
          </>
        )}
      </div>

      <p className="mt-6 text-sm text-ink-faint">
        <Link
          href="/login"
          className="font-semibold text-ink-soft underline underline-offset-2 hover:text-ink"
        >
          Volver a iniciar sesión
        </Link>
      </p>
    </main>
  );
}
