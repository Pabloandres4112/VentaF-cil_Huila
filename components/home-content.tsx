import Link from "next/link";
import type { ReactNode } from "react";
import { CardIcon, CheckIcon, ClockIcon, PinIcon, WhatsappIcon } from "@/components/icons";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import type { HomeDict, Locale } from "@/lib/i18n";
import { formatCOP } from "@/lib/utils";

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

// El login sigue solo en español por ahora: el multi-idioma cubre únicamente
// la Home (regla de alcance acordada con el usuario).
const LOGIN_HREF = "/login";

export function HomeContent({ dict, locale }: { dict: HomeDict; locale: Locale }) {
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-transparent bg-ground/90 backdrop-blur-sm">
        <Wrap className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl">VentaFácil</span>
            <span className="text-[0.65rem] font-bold uppercase tracking-wider text-ink-faint">
              Huila
            </span>
          </div>
          <nav className="hidden items-center gap-7 text-sm font-semibold lg:flex">
            <a href="#como-funciona" className="text-ink-soft transition-colors hover:text-ink">
              {dict.nav.how}
            </a>
            <a href="#planes" className="text-ink-soft transition-colors hover:text-ink">
              {dict.nav.plans}
            </a>
            <Link
              href={LOGIN_HREF}
              className="rounded-md border border-line-strong px-4 py-2 text-sm font-bold transition-colors hover:bg-ink/5"
            >
              {dict.nav.login}
            </Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher locale={locale} />
            <ThemeToggle labels={dict.theme} />
            <Link
              href={LOGIN_HREF}
              className="hidden rounded-md bg-accent px-4 py-2 text-sm font-bold text-accent-ink transition-colors hover:bg-accent/90 sm:inline-flex"
            >
              {dict.nav.cta}
            </Link>
          </div>
        </Wrap>
      </header>

      <main>
        <section className="py-10 sm:py-16 lg:py-20">
          <Wrap className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink-faint">
                {dict.hero.eyebrow}
              </p>
              <h1 className="font-display text-balance mt-4 mb-5 text-4xl leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
                {dict.hero.headlinePre}
                <span className="text-accent">{dict.hero.headlineAccent}</span>
                {dict.hero.headlinePost}
              </h1>
              <p className="mb-7 max-w-md text-lg text-ink-soft">{dict.hero.lede}</p>
              <div className="mb-6 flex flex-wrap gap-3">
                <a
                  href="#planes"
                  className="rounded-md bg-accent px-5 py-3 text-sm font-bold text-accent-ink transition-colors hover:bg-accent/90"
                >
                  {dict.hero.ctaPrimary}
                </a>
                <a
                  href="#como-funciona"
                  className="rounded-md border border-line-strong px-5 py-3 text-sm font-bold transition-colors hover:bg-ink/5"
                >
                  {dict.hero.ctaSecondary}
                </a>
              </div>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-faint">
                <li className="flex items-center gap-1.5">
                  <ClockIcon className="text-ink-faint" /> {dict.hero.proof[0]}
                </li>
                <li className="flex items-center gap-1.5">
                  <CardIcon className="text-ink-faint" /> {dict.hero.proof[1]}
                </li>
                <li className="flex items-center gap-1.5">
                  <PinIcon className="text-ink-faint" /> {dict.hero.proof[2]}
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-line bg-surface p-5 shadow-[0_8px_24px_-16px_rgba(27,36,48,0.5)]">
                <div className="mb-2.5 flex items-center justify-between border-b border-line pb-3">
                  <span className="font-display text-sm">{dict.hero.ticketShop}</span>
                  <span className="text-[0.68rem] uppercase tracking-wider text-ink-faint">
                    {dict.hero.ticketLabel}
                  </span>
                </div>
                {dict.hero.ticket.map((item, i) => (
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
                  {dict.hero.waCaption}
                </span>
                <div className="space-y-2 rounded-lg bg-wa-tint p-4 text-sm leading-relaxed tabular-nums">
                  <p className="font-bold">{dict.hero.waHeader}</p>
                  <div className="h-1" />
                  <p>
                    <span className="font-bold">{dict.hero.waClientLabel}</span>{" "}
                    {dict.hero.waClientValue}
                  </p>
                  <p>
                    <span className="font-bold">{dict.hero.waAddressLabel}</span>{" "}
                    {dict.hero.waAddressValue}
                  </p>
                  <p>
                    <span className="font-bold">{dict.hero.waPaymentLabel}</span>{" "}
                    {dict.hero.waPaymentValue}
                  </p>
                  <div className="h-1" />
                  <p className="font-bold">{dict.hero.waDetailLabel}</p>
                  {dict.hero.waItems.map((item) => (
                    <p key={item.label}>
                      {item.label} ({formatCOP(item.price)})
                    </p>
                  ))}
                  <div className="h-1" />
                  <p>
                    <span className="font-bold">{dict.hero.waTotalLabel}</span>{" "}
                    {formatCOP(dict.hero.waTotalPrice)}
                  </p>
                  <div className="h-1" />
                  <p className="text-ink-soft">{dict.hero.waFooter}</p>
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
                {dict.problem.eyebrow}
              </p>
              <h2 className="font-display mt-2 mb-2 text-2xl sm:text-3xl">{dict.problem.title}</h2>
              <p className="text-ink-soft">{dict.problem.body}</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-xl border border-line bg-surface p-6">
                <h3 className="mb-4 font-bold text-ink-soft">{dict.problem.beforeLabel}</h3>
                <div className="flex flex-col gap-2">
                  {dict.problem.beforeChats.map((line, i) => (
                    <p
                      key={line}
                      className={`max-w-[88%] rounded-xl bg-surface-2 px-3 py-2 text-sm ${
                        i === 2
                          ? "ml-auto rounded-br-sm text-ink-soft"
                          : "rounded-bl-sm"
                      }`}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-line bg-surface p-6">
                <h3 className="mb-4 font-bold text-wa-deep">{dict.problem.afterLabel}</h3>
                <div className="space-y-1 rounded-lg bg-wa-tint p-4 text-sm tabular-nums">
                  <p>{dict.problem.afterHeader}</p>
                  {dict.problem.afterLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  <p>
                    {dict.problem.afterTotalLabel} {formatCOP(dict.problem.afterTotalPrice)}
                  </p>
                  <p>{dict.problem.afterAddress}</p>
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
                {dict.how.eyebrow}
              </p>
              <h2 className="font-display mt-2 mb-2 text-2xl sm:text-3xl">{dict.how.title}</h2>
              <p className="text-ink-soft">{dict.how.body}</p>
            </div>
            <div className="grid gap-9 lg:grid-cols-2 lg:gap-12">
              <StepTrack label={dict.how.ownerLabel} steps={dict.how.ownerSteps} />
              <StepTrack label={dict.how.clientLabel} steps={dict.how.clientSteps} />
            </div>
          </Wrap>
        </section>

        <Hairline />

        <section className="py-12 sm:py-16" id="planes">
          <Wrap>
            <div className="mb-8 max-w-xl sm:mb-11">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-faint">
                {dict.plans.eyebrow}
              </p>
              <h2 className="font-display mt-2 mb-2 text-2xl sm:text-3xl">{dict.plans.title}</h2>
              <p className="text-ink-soft">{dict.plans.body}</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {dict.plans.items.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative flex flex-col rounded-xl border bg-surface p-7 ${
                    plan.featured
                      ? "border-accent shadow-[0_0_0_1px_var(--color-accent)]"
                      : "border-line"
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
                  <div className="mb-5 mt-2">
                    <span className="font-display block text-2xl tabular-nums">
                      {plan.priceLabel}
                    </span>
                    <span className="text-sm text-ink-faint">{plan.priceUnit}</span>
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
                    href={LOGIN_HREF}
                    className={`mt-auto rounded-md px-5 py-3 text-center text-sm font-bold transition-colors ${
                      plan.featured
                        ? "bg-accent text-accent-ink hover:bg-accent/90"
                        : "border border-line-strong hover:bg-ink/5"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                  {plan.optionalNote && (
                    <p className="mt-3 text-center text-xs text-ink-faint">
                      {plan.optionalNote.text}{" "}
                      {/* TODO: enlazar al contacto real (WhatsApp/calendario) cuando exista */}
                      <a href="#" className="font-semibold text-ink-soft underline underline-offset-2 hover:text-ink">
                        {plan.optionalNote.cta}
                      </a>
                    </p>
                  )}
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
                {dict.examples.eyebrow}
              </p>
              <h2 className="font-display mt-2 mb-2 text-2xl sm:text-3xl">{dict.examples.title}</h2>
              <p className="text-ink-soft">{dict.examples.body}</p>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {dict.examples.shops.map((shop) => (
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
                {dict.final.title}
              </h2>
              <p className="mx-auto mb-7 max-w-md text-accent-ink/80">{dict.final.body}</p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href="#planes"
                  className="rounded-md bg-accent-ink px-5 py-3 text-sm font-bold text-accent transition-colors hover:bg-accent-ink/90"
                >
                  {dict.final.ctaPrimary}
                </a>
                {/* TODO: reemplazar por el número real de contacto de VentaFácil cuando exista */}
                <a
                  href="#"
                  className="flex items-center gap-2 rounded-md bg-wa px-5 py-3 text-sm font-bold text-wa-ink transition-colors hover:bg-wa/90"
                >
                  <WhatsappIcon />
                  {dict.final.ctaWhatsapp}
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
          <span>{dict.footer.madeFor}</span>
          <span>{dict.footer.disclaimer}</span>
        </Wrap>
      </footer>
    </>
  );
}

function StepTrack({ label, steps }: { label: string; steps: HomeDict["how"]["ownerSteps"] }) {
  return (
    <div>
      <span className="mb-5 inline-flex items-center text-xs font-bold uppercase tracking-wide text-ink-soft">
        {label}
      </span>
      <ol className="flex flex-col">
        {steps.map((step, i) => (
          <li key={step.title} className="relative grid grid-cols-[2rem_1fr] gap-3.5 pb-6">
            {i < steps.length - 1 && (
              <span
                className="absolute left-4 top-8 bottom-0 w-px bg-line-strong"
                aria-hidden="true"
              />
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
