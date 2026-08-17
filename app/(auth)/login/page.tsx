"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { isValidEmail } from "@/lib/validation";

const INPUT_CLASS =
  "rounded-md border bg-ground px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent";

interface LoginErrors {
  email?: string;
  password?: string;
}

// Fase 2 (PLAN_EJECUCION.md): login del dueño de negocio con Supabase Auth.
// Por ahora es solo la UI con validación: el envío no está conectado todavía
// porque el proyecto de Supabase no se ha creado (Fase 1, en pausa a propósito).
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nextErrors: LoginErrors = {};
    if (!email.trim()) nextErrors.email = "Ingresa tu correo.";
    else if (!isValidEmail(email)) nextErrors.email = "Ingresa un correo válido.";
    if (!password) nextErrors.password = "Ingresa tu contraseña.";
    else if (password.length < 6) nextErrors.password = "Debe tener al menos 6 caracteres.";

    setErrors(nextErrors);
    // TODO Fase 2: si no hay errores, llamar supabase.auth.signInWithPassword() en lib/supabase/client.ts.
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-ground p-6">
      <Link href="/" className="font-display mb-8 text-xl">
        VentaFácil
      </Link>

      <div className="w-full max-w-sm rounded-xl border border-line bg-surface p-7">
        <h1 className="font-display mb-1 text-2xl">Iniciar sesión</h1>
        <p className="mb-6 text-sm text-ink-soft">
          Entra a tu panel para gestionar tu catálogo.
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              aria-invalid={Boolean(errors.password)}
              className={`${INPUT_CLASS} ${errors.password ? "border-danger" : "border-line-strong"}`}
            />
            {errors.password && <p className="text-xs text-danger">{errors.password}</p>}
          </div>

          {/* TODO Fase 2: conectar con supabase.auth.signInWithPassword() en lib/supabase/client.ts una vez exista el proyecto de Supabase. */}
          <button
            type="submit"
            className="mt-2 rounded-md bg-accent px-5 py-3 text-sm font-bold text-accent-ink transition-colors hover:bg-accent/90"
          >
            Iniciar sesión
          </button>
          <p className="text-center text-xs text-ink-faint">
            Conexión con Supabase pendiente (Fase 1).
          </p>
        </form>
      </div>

      <p className="mt-6 text-sm text-ink-faint">
        ¿Aún no tienes catálogo?{" "}
        <Link
          href="/#planes"
          className="font-semibold text-ink-soft underline underline-offset-2 hover:text-ink"
        >
          Crea el tuyo gratis
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
