"use client";

// Recuperación de contraseña, paso 2: el link del correo (ver /recuperar)
// trae al usuario aquí. El cliente de Supabase detecta automáticamente el
// token de recuperación en la URL (detectSessionInUrl, default en
// createBrowserClient) y abre una sesión temporal — solo con esa sesión
// activa updateUser({ password }) puede cambiar la contraseña.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

const INPUT_CLASS =
  "rounded-md border bg-ground px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent";

interface RestablecerErrors {
  password?: string;
  confirmar?: string;
  general?: string;
}

export default function RestablecerPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [errors, setErrors] = useState<RestablecerErrors>({});
  const [loading, setLoading] = useState(false);
  const [listo, setListo] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nextErrors: RestablecerErrors = {};
    if (password.length < 6) nextErrors.password = "Debe tener al menos 6 caracteres.";
    if (confirmar !== password) nextErrors.confirmar = "Las contraseñas no coinciden.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setErrors({
        general: "El link ya expiró o no es válido. Solicita uno nuevo.",
      });
      return;
    }

    setListo(true);
    window.setTimeout(() => router.push("/dashboard"), 1800);
  }

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center bg-ground p-6">
      <Link href="/" className="font-display mb-8 text-xl">
        VentaFácil
      </Link>

      <div className="w-full max-w-sm rounded-xl border border-line bg-surface p-7">
        {listo ? (
          <>
            <h1 className="font-display mb-1 text-2xl">Listo</h1>
            <p className="text-sm text-ink-soft">
              Tu contraseña se actualizó. Te llevamos a tu panel...
            </p>
          </>
        ) : (
          <>
            <h1 className="font-display mb-1 text-2xl">Crea tu nueva contraseña</h1>
            <p className="mb-6 text-sm text-ink-soft">Escríbela dos veces para confirmarla.</p>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-semibold text-ink-soft">
                  Nueva contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  aria-invalid={Boolean(errors.password)}
                  className={`${INPUT_CLASS} ${errors.password ? "border-danger" : "border-line-strong"}`}
                />
                {errors.password && <p className="text-xs text-danger">{errors.password}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirmar" className="text-sm font-semibold text-ink-soft">
                  Confirmar contraseña
                </label>
                <input
                  id="confirmar"
                  name="confirmar"
                  type="password"
                  autoComplete="new-password"
                  value={confirmar}
                  onChange={(e) => setConfirmar(e.target.value)}
                  placeholder="••••••••"
                  aria-invalid={Boolean(errors.confirmar)}
                  className={`${INPUT_CLASS} ${errors.confirmar ? "border-danger" : "border-line-strong"}`}
                />
                {errors.confirmar && <p className="text-xs text-danger">{errors.confirmar}</p>}
              </div>

              {errors.general && (
                <p className="text-sm text-danger">
                  {errors.general}{" "}
                  <Link href="/recuperar" className="underline underline-offset-2">
                    Pedir otro link
                  </Link>
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 rounded-md bg-accent px-5 py-3 text-sm font-bold text-accent-ink transition-colors hover:bg-accent/90 disabled:opacity-60"
              >
                {loading ? "Guardando..." : "Guardar contraseña"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
