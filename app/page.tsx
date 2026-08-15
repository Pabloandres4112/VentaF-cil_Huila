import Link from "next/link";
import type { ReactNode } from "react";
import { CardIcon, CheckIcon, ClockIcon, PinIcon, WhatsappIcon } from "@/components/icons";
import { formatCOP } from "@/lib/utils";

interface TicketItem {
  name: string;
  price: number;
  tag?: string;
}

interface ExampleShop {
  name: string;
  tag: string;
  items: TicketItem[];
}

interface Plan {
  name: string;
  price: number;
  featured?: boolean;
  badge?: string;
  features: string[];
  cta: string;
}

interface Step {
  title: string;
  description: string;
}

const HERO_TICKET: TicketItem[] = [
  { name: "Arroz Diana 500g", price: 2500 },
  { name: "Café Huila 500g", price: 14000 },
  { name: "Aceite Gourmet 1L", price: 9800, tag: "Sin stock" },
];

const EXAMPLES: ExampleShop[] = [
  {
    name: "Ferretería El Tornillo",
    tag: "Ferretería",
    items: [
      { name: 'Tornillo 1" (x50)', price: 8000 },
      { name: "Cinta aislante", price: 3500 },
      { name: "Candado 40mm", price: 12000 },
    ],
  },
  {
    name: "Ropa Bonita",
    tag: "Moda",
    items: [
      { name: "Camiseta algodón", price: 35000 },
      { name: "Jean clásico", price: 89000 },
      { name: "Chaqueta liviana", price: 120000 },
    ],
  },
  {
    name: "Depósito La Cosecha",
    tag: "Café",
    items: [
      { name: "Café Huila 500g", price: 14000 },
      { name: "Café Huila 1kg", price: 26000 },
      { name: "Panela 1kg", price: 4500 },
    ],
  },
];

const PLANS: Plan[] = [
  {
    name: "Semilla",
    price: 0,
    features: [
      "Hasta 10 productos",
      "Catálogo público con tu link",
      "Pedidos directos a tu WhatsApp",
    ],
    cta: "Empezar gratis",
  },
  {
    name: "Emprendedor",
    price: 29900,
    featured: true,
    badge: "Recomendado",
    features: [
      "Hasta 100 productos",
      "Descuento automático de stock",
      "Link personalizado, sin marca de agua",
    ],
    cta: "Probar 14 días gratis",
  },
];

const OWNER_STEPS: Step[] = [
  {
    title: "Crea tu tienda",
    description: "Nombre del negocio y el número de WhatsApp donde quieres recibir los pedidos.",
  },
  {
    title: "Sube tus productos",
    description: "Foto, precio y stock. Puedes marcar cuáles están agotados con un clic.",
  },
  {
    title: "Comparte tu link",
    description: "ventafacil.com/tienda/tu-negocio — pégalo en tu estado de WhatsApp o Instagram.",
  },
];

const CLIENT_STEPS: Step[] = [
  {
    title: "Entra a tu catálogo",
    description: "Ve fotos, precios y disponibilidad actualizada, desde el celular.",
  },
  {
    title: "Arma su pedido",
    description: "Agrega cantidades al carrito, sin crear cuenta ni dar datos de más.",
  },
  {
    title: "Pide por WhatsApp",
    description: "Un toque y el mensaje llega listo, con todo el detalle del pedido.",
  },
];

function Wrap({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-[71rem] px-5 sm:px-10 ${className}`}>{children}</div>;
}

function Hairline() {
  return (
    <Wrap>
      <div className="h-px bg-line" />
    </Wrap>
  );
}

export default function LandingPage() {
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-transparent bg-ground/90 backdrop-blur-sm">
        <Wrap className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl">VentaFácil</span>
            <span className="text-[0.65rem] font-bold uppercase tracking-wider text-ink-faint">Huila</span>
          </div>
          <nav className="hidden items-center gap-7 text-sm font-semibold lg:flex">
            <a href="#como-funciona" className="text-ink-soft transition-colors hover:text-ink">
              Cómo funciona
            </a>
            <a href="#planes" className="text-ink-soft transition-colors hover:text-ink">
              Planes
            </a>
            <Link
              href="/login"
              className="rounded-md border border-line-strong px-4 py-2 text-sm font-bold transition-colors hover:bg-ink/5"
            >
              Entrar
            </Link>
          </nav>
          <Link
            href="/login"
            className="rounded-md bg-accent px-4 py-2 text-sm font-bold text-accent-ink transition-colors hover:bg-accent/90"
          >
            Empezar gratis
          </Link>
        </Wrap>
      </header>

      <main>
        <section className="py-10 sm:py-16 lg:py-20">
          <Wrap className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink-faint">
                Catálogo digital · Pedidos por WhatsApp
              </p>
              <h1 className="font-display text-balance mt-4 mb-5 text-4xl leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
                Deja de escribir <span className="text-accent">el mismo precio</span> veinte veces al
                día.
              </h1>
              <p className="mb-7 max-w-md text-lg text-ink-soft">
                Sube tus productos, comparte tu link y cada pedido te llega ya organizado al
                WhatsApp — con cliente, dirección y total. Sin apps que instalar, sin costo para
                empezar.
              </p>
              <div className="mb-6 flex flex-wrap gap-3">
                <a
                  href="#planes"
                  className="rounded-md bg-accent px-5 py-3 text-sm font-bold text-accent-ink transition-colors hover:bg-accent/90"
                >
                  Crear mi catálogo gratis
                </a>
                <a
                  href="#como-funciona"
                  className="rounded-md border border-line-strong px-5 py-3 text-sm font-bold transition-colors hover:bg-ink/5"
                >
                  Ver cómo funciona
                </a>
              </div>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-faint">
                <li className="flex items-center gap-1.5">
                  <ClockIcon className="text-ink-faint" /> Listo en menos de 5 minutos
                </li>
                <li className="flex items-center gap-1.5">
                  <CardIcon className="text-ink-faint" /> Sin tarjeta de crédito
                </li>
                <li className="flex items-center gap-1.5">
                  <PinIcon className="text-ink-faint" /> Hecho para Isnos y Pitalito
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-line bg-surface p-5 shadow-[0_8px_24px_-16px_rgba(27,36,48,0.5)]">
                <div className="mb-2.5 flex items-center justify-between border-b border-line pb-3">
                  <span className="font-display text-sm">Donde Marleny</span>
                  <span className="text-[0.68rem] uppercase tracking-wider text-ink-faint">
                    Catálogo
                  </span>
                </div>
                {HERO_TICKET.map((item, i) => (
                  <div
                    key={item.name}
                    className={`flex items-baseline justify-between gap-3 py-2 text-sm ${i > 0 ? "border-t border-line" : ""}`}
                  >
                    <span>
                      {item.name}
                      {item.tag && (
                        <span className="ml-2 rounded bg-surface-2 px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-ink-faint">
                          {item.tag}
                        </span>
                      )}
                    </span>
                    <span className="font-bold tabular-nums">{formatCOP(item.price)}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-line bg-surface p-5 shadow-[0_8px_24px_-16px_rgba(27,36,48,0.5)]">
                <span className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-wa-deep">
                  <WhatsappIcon />
                  Así llega a tu WhatsApp
                </span>
                <div className="space-y-2 rounded-lg bg-wa-tint p-4 text-sm leading-relaxed tabular-nums">
                  <p className="font-bold">Nuevo pedido — VentaFácil</p>
                  <div className="h-1" />
                  <p>
                    <span className="font-bold">Cliente:</span> María Fernanda
                  </p>
                  <p>
                    <span className="font-bold">Dirección:</span> Cra 5 #12-30, Pitalito
                  </p>
                  <p>
                    <span className="font-bold">Pago:</span> Nequi
                  </p>
                  <div className="h-1" />
                  <p className="font-bold">Detalle del pedido:</p>
                  <p>2x Arroz Diana 500g ({formatCOP(5000)})</p>
                  <p>1x Café Huila 500g ({formatCOP(14000)})</p>
                  <div className="h-1" />
                  <p>
                    <span className="font-bold">Total a pagar:</span> {formatCOP(19000)}
                  </p>
                  <div className="h-1" />
                  <p className="text-ink-soft">
                    Enviado desde el catálogo digital de Donde Marleny.
                  </p>
                </div>
              </div>
            </div>
          </Wrap>
        </section>

        <Hairline />

        <section className="py-12 sm:py-16" id="problema">
          <Wrap>
            <div className="mb-8 max-w-xl sm:mb-11">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-faint">
                El problema de vender por chat
              </p>
              <h2 className="font-display mt-2 mb-2 text-2xl sm:text-3xl">
                Tu chat de WhatsApp no es un catálogo.
              </h2>
              <p className="text-ink-soft">
                Los mismos precios, la misma disponibilidad, la misma dirección — escritos a mano,
                mensaje por mensaje, todo el día.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-xl border border-line bg-surface p-6">
                <h3 className="mb-4 font-bold text-ink-soft">Antes</h3>
                <div className="flex flex-col gap-2">
                  <p className="max-w-[88%] rounded-xl rounded-bl-sm bg-surface-2 px-3 py-2 text-sm">
                    Hola, ¿cuánto vale el arroz?
                  </p>
                  <p className="max-w-[88%] rounded-xl rounded-bl-sm bg-surface-2 px-3 py-2 text-sm">
                    ¿Tienen café de libra?
                  </p>
                  <p className="ml-auto max-w-[88%] rounded-xl rounded-br-sm bg-surface-2 px-3 py-2 text-sm text-ink-soft">
                    Sí, a 14.000 la libra
                  </p>
                  <p className="max-w-[88%] rounded-xl rounded-bl-sm bg-surface-2 px-3 py-2 text-sm">
                    ¿Y ya está listo mi pedido de ayer?
                  </p>
                  <p className="max-w-[88%] rounded-xl rounded-bl-sm bg-surface-2 px-3 py-2 text-sm">
                    ¿Cuál era mi dirección que te di?
                  </p>
                </div>
              </div>
              <div className="rounded-xl border border-line bg-surface p-6">
                <h3 className="mb-4 font-bold text-wa-deep">Con VentaFácil</h3>
                <div className="space-y-1 rounded-lg bg-wa-tint p-4 text-sm tabular-nums">
                  <p>Nuevo pedido — María Fernanda</p>
                  <p>2x Arroz Diana 500g</p>
                  <p>1x Café Huila 500g</p>
                  <p>Total: {formatCOP(19000)}</p>
                  <p>Dirección: Cra 5 #12-30</p>
                </div>
              </div>
            </div>
          </Wrap>
        </section>

        <Hairline />

        <section className="py-12 sm:py-16" id="como-funciona">
          <Wrap>
            <div className="mb-8 max-w-xl sm:mb-11">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-faint">
                Cómo funciona
              </p>
              <h2 className="font-display mt-2 mb-2 text-2xl sm:text-3xl">
                Dos caminos cortos: el tuyo y el de tu cliente.
              </h2>
              <p className="text-ink-soft">
                Nada que instalar del lado del comprador. Del tuyo, tres pasos y ya quedaste
                montado.
              </p>
            </div>
            <div className="grid gap-9 lg:grid-cols-2 lg:gap-12">
              <StepTrack label="Para ti, el dueño" steps={OWNER_STEPS} />
              <StepTrack label="Para tu cliente" steps={CLIENT_STEPS} />
            </div>
          </Wrap>
        </section>

        <Hairline />

        <section className="py-12 sm:py-16" id="planes">
          <Wrap>
            <div className="mb-8 max-w-xl sm:mb-11">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-faint">Planes</p>
              <h2 className="font-display mt-2 mb-2 text-2xl sm:text-3xl">
                Empieza gratis. Crece cuando tu negocio lo pida.
              </h2>
              <p className="text-ink-soft">
                Sin permanencia. Si un mes no pagas, tu catálogo simplemente se pausa — no se
                pierde.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative flex flex-col rounded-xl border bg-surface p-7 ${
                    plan.featured ? "border-accent shadow-[0_0_0_1px_var(--color-accent)]" : "border-line"
                  }`}
                >
                  {plan.badge && (
                    <span className="absolute -top-2.5 left-6 rounded bg-accent px-2.5 py-1 text-[0.66rem] font-bold uppercase tracking-wide text-accent-ink">
                      {plan.badge}
                    </span>
                  )}
                  <span className="text-sm font-bold uppercase tracking-wide text-ink-soft">
                    {plan.name}
                  </span>
                  <div className="mb-5 mt-2 flex items-baseline gap-1.5">
                    <span className="font-display text-3xl tabular-nums">
                      {plan.price === 0 ? "$0" : formatCOP(plan.price)}
                    </span>
                    <span className="text-sm text-ink-faint">COP / mes</span>
                  </div>
                  <ul className="mb-7 flex flex-col gap-2.5 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckIcon className="mt-0.5 text-wa-deep" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/login"
                    className={`mt-auto rounded-md px-5 py-3 text-center text-sm font-bold transition-colors ${
                      plan.featured
                        ? "bg-accent text-accent-ink hover:bg-accent/90"
                        : "border border-line-strong hover:bg-ink/5"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </Wrap>
        </section>

        <Hairline />

        <section className="py-12 sm:py-16" id="ejemplos">
          <Wrap>
            <div className="mb-8 max-w-xl sm:mb-11">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-faint">
                Para negocios como el tuyo
              </p>
              <h2 className="font-display mt-2 mb-2 text-2xl sm:text-3xl">
                De la ferretería a la tienda de ropa.
              </h2>
              <p className="text-ink-soft">
                VentaFácil no está pensado para un solo tipo de negocio. Así se vería tu catálogo
                según a qué te dediques.
              </p>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {EXAMPLES.map((shop) => (
                <div key={shop.name} className="rounded-xl border border-line bg-surface p-5">
                  <div className="mb-1.5 flex items-center justify-between gap-2 border-b border-line pb-3">
                    <span className="font-display text-sm">{shop.name}</span>
                    <span className="whitespace-nowrap rounded bg-surface-2 px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-ink-soft">
                      {shop.tag}
                    </span>
                  </div>
                  {shop.items.map((item, i) => (
                    <div
                      key={item.name}
                      className={`flex justify-between gap-3 py-2 text-sm ${i > 0 ? "border-t border-line" : ""}`}
                    >
                      <span>{item.name}</span>
                      <span className="font-bold tabular-nums">{formatCOP(item.price)}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Wrap>
        </section>

        <section className="py-12 sm:py-16">
          <Wrap>
            <div className="rounded-2xl bg-accent px-6 py-10 text-center text-accent-ink sm:px-14 sm:py-14">
              <h2 className="font-display text-balance mb-3 text-2xl sm:text-4xl">
                Tu vitrina digital, lista antes del cierre de hoy.
              </h2>
              <p className="mx-auto mb-7 max-w-md text-accent-ink/80">
                Súbela en cinco minutos y empieza a recibir pedidos organizados esta misma tarde.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href="#planes"
                  className="rounded-md bg-accent-ink px-5 py-3 text-sm font-bold text-accent transition-colors hover:bg-accent-ink/90"
                >
                  Crear mi catálogo gratis
                </a>
                {/* TODO: reemplazar por el número real de contacto de VentaFácil cuando exista */}
                <a
                  href="#"
                  className="flex items-center gap-2 rounded-md bg-wa px-5 py-3 text-sm font-bold text-wa-ink transition-colors hover:bg-wa/90"
                >
                  <WhatsappIcon />
                  Escríbenos por WhatsApp
                </a>
              </div>
            </div>
          </Wrap>
        </section>
      </main>

      <footer>
        <Hairline />
        <Wrap className="flex flex-col gap-6 py-8 text-sm text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <span className="font-display text-base text-ink">VentaFácil</span>
          <span>Hecho para negocios de Isnos, Pitalito y el Huila.</span>
          <span>VentaFácil no está afiliado a WhatsApp Inc. — usamos enlaces públicos wa.me.</span>
        </Wrap>
      </footer>
    </>
  );
}

function StepTrack({ label, steps }: { label: string; steps: Step[] }) {
  return (
    <div>
      <span className="mb-5 inline-flex items-center text-xs font-bold uppercase tracking-wide text-ink-soft">
        {label}
      </span>
      <ol className="flex flex-col">
        {steps.map((step, i) => (
          <li key={step.title} className="relative grid grid-cols-[2rem_1fr] gap-3.5 pb-6">
            {i < steps.length - 1 && (
              <span className="absolute left-4 top-8 bottom-0 w-px bg-line-strong" aria-hidden="true" />
            )}
            <span className="z-[1] flex h-8 w-8 items-center justify-center rounded-md border border-line-strong bg-surface text-sm font-bold tabular-nums">
              {i + 1}
            </span>
            <div>
              <h4 className="mb-1 font-semibold">{step.title}</h4>
              <p className="text-sm text-ink-soft">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
