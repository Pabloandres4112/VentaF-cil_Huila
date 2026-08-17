export type Locale = "es" | "en";

export interface PriceItem {
  name: string;
  price: number;
  tag?: string;
}

export interface LineItem {
  label: string;
  price: number;
}

export interface ExampleShopDict {
  name: string;
  tag: string;
  items: PriceItem[];
}

export interface PlanDict {
  name: string;
  priceLabel: string;
  priceUnit: string;
  featured?: boolean;
  badge?: string;
  features: string[];
  cta: string;
  /** Nota de un servicio opcional relacionado (ej. demo asistida), no un plan aparte. */
  optionalNote?: { text: string; cta: string };
}

export interface StepDict {
  title: string;
  description: string;
}

export interface HomeDict {
  meta: { title: string; description: string };
  nav: { how: string; plans: string; login: string; cta: string };
  hero: {
    eyebrow: string;
    headlinePre: string;
    headlineAccent: string;
    headlinePost: string;
    lede: string;
    ctaPrimary: string;
    ctaSecondary: string;
    proof: [string, string, string];
    ticketShop: string;
    ticketLabel: string;
    ticket: PriceItem[];
    waCaption: string;
    waHeader: string;
    waClientLabel: string;
    waClientValue: string;
    waAddressLabel: string;
    waAddressValue: string;
    waPaymentLabel: string;
    waPaymentValue: string;
    waDetailLabel: string;
    waItems: LineItem[];
    waTotalLabel: string;
    waTotalPrice: number;
    waFooter: string;
  };
  problem: {
    eyebrow: string;
    title: string;
    body: string;
    beforeLabel: string;
    afterLabel: string;
    beforeChats: string[];
    afterHeader: string;
    afterLines: string[];
    afterTotalLabel: string;
    afterTotalPrice: number;
    afterAddress: string;
  };
  how: {
    eyebrow: string;
    title: string;
    body: string;
    ownerLabel: string;
    clientLabel: string;
    ownerSteps: StepDict[];
    clientSteps: StepDict[];
  };
  plans: {
    eyebrow: string;
    title: string;
    body: string;
    items: PlanDict[];
  };
  examples: {
    eyebrow: string;
    title: string;
    body: string;
    shops: ExampleShopDict[];
  };
  final: {
    title: string;
    body: string;
    ctaPrimary: string;
    ctaWhatsapp: string;
  };
  footer: {
    madeFor: string;
    disclaimer: string;
    terms: string;
  };
  theme: {
    toLight: string;
    toDark: string;
  };
}
