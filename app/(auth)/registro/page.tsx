"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { CheckIcon, ColombiaFlagIcon } from "@/components/icons";
import { PasswordInput } from "@/components/password-input";
import { TerminosModal } from "@/components/terminos-modal";
import { VolverInicioLink } from "@/components/volver-inicio-link";
import { createClient } from "@/lib/supabase/client";
import { isValidEmail } from "@/lib/validation";

const INPUT_CLASS =
  "rounded-md border bg-ground px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent";

const INDICATIVO_COLOMBIA = "57";

interface RegistroErrors {
  email?: string;
  telefono?: string;
  password?: string;
  confirmar?: string;
  terminos?: string;
  general?: string;
}

// Fase 2 (PLAN_EJECUCION.md): alta self-service del dueño de negocio.
// El WhatsApp se pide acá y viaja en los metadatos del usuario de Supabase
// Auth (options.data) porque la tienda todavía no existe en este punto —
// requireTienda() (lib/auth/session.ts) la crea al primer ingreso al
// dashboard, leyendo ese metadato. El nombre de la tienda sigue siendo
// provisional hasta que el dueño lo cambia en /dashboard/perfil.
export default function RegistroPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [telefonoLocal, setTelefonoLocal] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [terminosAbiertos, setTerminosAbiertos] = useState(false);
  const [errors, setErrors] = useState<RegistroErrors>({});
  const [loading, setLoading] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nextErrors: RegistroErrors = {};
    if (!email.trim()) nextErrors.email = "Ingresa tu correo.";
    else if (!isValidEmail(email)) nextErrors.email = "Ingresa un correo válido.";
    if (!/^\d{10}$/.test(telefonoLocal)) {
      nextErrors.telefono = "Ingresa los 10 dígitos de tu número, sin el indicativo.";
    }
    if (!password) nextErrors.password = "Ingresa una contraseña.";
    else if (password.length < 6) nextErrors.password = "Debe tener al menos 6 caracteres.";
    if (confirmar !== password) nextErrors.confirmar = "Las contraseñas no coinciden.";
    if (!aceptaTerminos) nextErrors.terminos = "Debes aceptar los Términos y Condiciones para continuar.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { telefono_whatsapp: INDICATIVO_COLOMBIA + telefonoLocal },
      },
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
      <main className="relative flex flex-1 flex-col items-center justify-center bg-ground p-6">
        <VolverInicioLink />

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
    <main className="relative flex flex-1 flex-col items-center justify-center bg-ground p-6">
      <VolverInicioLink />

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
            <label htmlFor="telefono" className="text-sm font-semibold text-ink-soft">
              Número de WhatsApp
            </label>
            <div className="flex gap-2">
              <span className="flex flex-none items-center gap-1.5 rounded-md border border-line-strong bg-surface-2 px-3 text-sm font-bold text-ink-soft">
                <ColombiaFlagIcon />+{INDICATIVO_COLOMBIA}
              </span>
              <input
                id="telefono"
                inputMode="numeric"
                value={telefonoLocal}
                onChange={(e) => setTelefonoLocal(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="3001234567"
                aria-invalid={Boolean(errors.telefono)}
                className={`${INPUT_CLASS} flex-1 ${errors.telefono ? "border-danger" : "border-line-strong"}`}
              />
            </div>
            {errors.telefono ? (
              <p className="text-xs text-danger">{errors.telefono}</p>
            ) : (
              <p className="text-xs text-ink-faint">Solo tu número, sin indicativo. Ej: 3001234567.</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-semibold text-ink-soft">
              Contraseña
            </label>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              invalid={Boolean(errors.password)}
            />
            {errors.password && <p className="text-xs text-danger">{errors.password}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmar" className="text-sm font-semibold text-ink-soft">
              Confirmar contraseña
            </label>
            <PasswordInput
              id="confirmar"
              name="confirmar"
              autoComplete="new-password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              placeholder="••••••••"
              invalid={Boolean(errors.confirmar)}
            />
            {errors.confirmar && <p className="text-xs text-danger">{errors.confirmar}</p>}
          </div>

          <div className="flex flex-col gap-1.5 border-t border-line pt-4">
            {aceptaTerminos ? (
              <p className="flex items-center gap-1.5 text-sm text-ink-soft">
                <CheckIcon width={14} height={14} className="flex-none text-wa-deep" />
                Aceptaste los{" "}
                <button
                  type="button"
                  onClick={() => setTerminosAbiertos(true)}
                  className="font-semibold underline underline-offset-2 hover:text-ink"
                >
                  Términos y Condiciones
                </button>
              </p>
            ) : (
              <p className={`text-sm ${errors.terminos ? "text-danger" : "text-ink-soft"}`}>
                Al continuar aceptas los{" "}
                <button
                  type="button"
                  onClick={() => setTerminosAbiertos(true)}
                  className="font-semibold underline underline-offset-2 hover:text-ink"
                >
                  Términos y Condiciones
                </button>
                .
              </p>
            )}
            {errors.terminos && <p className="text-xs text-danger">{errors.terminos}</p>}
            <p className="text-xs text-ink-faint">
              Incluye el uso de cookies necesarias para mantener tu sesión iniciada.
            </p>
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

      {terminosAbiertos && (
        <TerminosModal
          onClose={() => setTerminosAbiertos(false)}
          onAccept={() => {
            setAceptaTerminos(true);
            setErrors((prev) => ({ ...prev, terminos: undefined }));
          }}
        />
      )}
    </main>
  );
}
