"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { isValidEmail } from "@/lib/validation";

const INPUT_CLASS =
  "rounded-md border bg-ground px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent";

interface RegistroErrors {
  email?: string;
  password?: string;
  confirmar?: string;
  general?: string;
}

// Fase 2 (PLAN_EJECUCION.md): alta self-service del dueño de negocio.
// El nombre de la tienda y el WhatsApp se completan después en
// /dashboard/perfil — al primer ingreso, requireTienda() (lib/auth/session.ts)
// crea la fila de `tiendas` automáticamente con un nombre provisional.
export default function RegistroPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [errors, setErrors] = useState<RegistroErrors>({});
  const [loading, setLoading] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nextErrors: RegistroErrors = {};
    if (!email.trim()) nextErrors.email = "Ingresa tu correo.";
    else if (!isValidEmail(email)) nextErrors.email = "Ingresa un correo válido.";
    if (!password) nextErrors.password = "Ingresa una contraseña.";
    else if (password.length < 6) nextErrors.password = "Debe tener al menos 6 caracteres.";
    if (confirmar !== password) nextErrors.confirmar = "Las contraseñas no coinciden.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (error) {
      setErrors({
        general:
          error.message.toLowerCase().includes("already registered") ||
          error.message.toLowerCase().includes("already exists")
            ? "Ya existe una cuenta con ese correo."
            : "No se pudo crear la cuenta. Intenta de nuevo.",
      });
      return;
    }

    // Si el proyecto de Supabase tiene "Confirm email" activado, signUp()
    // no entrega sesión todavía — hay que confirmar por correo antes de
    // poder entrar. Si está desactivado, ya llega con sesión activa.
    if (!data.session) {
      setEmailEnviado(true);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  if (emailEnviado) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center bg-ground p-6">
        <Link href="/" className="font-display mb-8 text-xl">
          VentaFácil
        </Link>
        <div className="w-full max-w-sm rounded-xl border border-line bg-surface p-7 text-center">
          <h1 className="font-display mb-2 text-xl">Revisa tu correo</h1>
          <p className="text-sm text-ink-soft">
            Te enviamos un enlace de confirmación a <strong>{email}</strong>. Ábrelo para activar
            tu cuenta y luego inicia sesión.
          </p>
          <Link
            href="/login"
            className="mt-5 inline-block text-sm font-semibold text-ink-soft underline underline-offset-2 hover:text-ink"
          >
            Ir a iniciar sesión
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-ground p-6">
      <Link href="/" className="font-display mb-8 text-xl">
        VentaFácil
      </Link>

      <div className="w-full max-w-sm rounded-xl border border-line bg-surface p-7">
        <h1 className="font-display mb-1 text-2xl">Crea tu catálogo</h1>
        <p className="mb-6 text-sm text-ink-soft">
          Gratis, sin tarjeta de crédito. Configuras tu tienda después.
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
              aria-invalid={Boolean(errors.email)}
              className={`${INPUT_CLASS} ${errors.email ? "border-danger" : "border-line-strong"}`}
            />
            {errors.email && <p className="text-xs text-danger">{errors.email}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-semibold text-ink-soft">
              Contraseña
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

          {errors.general && <p className="text-sm text-danger">{errors.general}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-md bg-accent px-5 py-3 text-sm font-bold text-accent-ink transition-colors hover:bg-accent/90 disabled:opacity-60"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>
      </div>

      <p className="mt-6 text-sm text-ink-faint">
        ¿Ya tienes catálogo?{" "}
        <Link
          href="/login"
          className="font-semibold text-ink-soft underline underline-offset-2 hover:text-ink"
        >
          Inicia sesión
        </Link>
      </p>
      <p className="mt-2 max-w-sm text-center text-xs text-ink-faint">
        Al continuar aceptas los{" "}
        <Link href="/terminos" className="underline underline-offset-2 hover:text-ink-soft">
          Términos y Condiciones
        </Link>
        .
      </p>
    </main>
  );
}
