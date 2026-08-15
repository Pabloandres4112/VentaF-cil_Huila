import type { HomeDict } from "./types";

export const en: HomeDict = {
  meta: {
    title: "VentaFácil Huila",
    description: "Digital catalog and inventory for small shops, with orders sent straight to WhatsApp.",
  },
  nav: {
    how: "How it works",
    plans: "Pricing",
    login: "Log in",
    cta: "Start for free",
  },
  hero: {
    eyebrow: "Digital catalog · Orders over WhatsApp",
    headlinePre: "Stop typing ",
    headlineAccent: "the same price",
    headlinePost: " twenty times a day.",
    lede: "Upload your products, share your link, and every order lands in your WhatsApp already organized — with customer, address, and total. Nothing to install, free to start.",
    ctaPrimary: "Create my catalog for free",
    ctaSecondary: "See how it works",
    proof: [
      "Ready in under 5 minutes",
      "No credit card required",
      "Built for Isnos and Pitalito",
    ],
    ticketShop: "Donde Marleny",
    ticketLabel: "Catalog",
    ticket: [
      { name: "Diana Rice 500g", price: 2500 },
      { name: "Huila Coffee 500g", price: 14000 },
      { name: "Gourmet Oil 1L", price: 9800, tag: "Out of stock" },
    ],
    waCaption: "This is what lands on WhatsApp",
    waHeader: "New order — VentaFácil",
    waClientLabel: "Customer:",
    waClientValue: "María Fernanda",
    waAddressLabel: "Address:",
    waAddressValue: "Cra 5 #12-30, Pitalito",
    waPaymentLabel: "Payment:",
    waPaymentValue: "Nequi",
    waDetailLabel: "Order details:",
    waItems: [
      { label: "2x Diana Rice 500g", price: 5000 },
      { label: "1x Huila Coffee 500g", price: 14000 },
    ],
    waTotalLabel: "Total due:",
    waTotalPrice: 19000,
    waFooter: "Sent from Donde Marleny's digital catalog.",
  },
  problem: {
    eyebrow: "The problem with selling over chat",
    title: "Your WhatsApp chat is not a catalog.",
    body: "Same prices, same availability, same address — typed out by hand, message after message, all day long.",
    beforeLabel: "Before",
    afterLabel: "With VentaFácil",
    beforeChats: [
      "Hi, how much is the rice?",
      "Do you have coffee by the pound?",
      "Yes, 14,000 a pound",
      "Is my order from yesterday ready yet?",
      "What was the address I gave you again?",
    ],
    afterHeader: "New order — María Fernanda",
    afterLines: ["2x Diana Rice 500g", "1x Huila Coffee 500g"],
    afterTotalLabel: "Total:",
    afterTotalPrice: 19000,
    afterAddress: "Address: Cra 5 #12-30",
  },
  how: {
    eyebrow: "How it works",
    title: "Two short paths: yours and your customer's.",
    body: "Nothing to install on the buyer's side. On yours, three steps and you're set up.",
    ownerLabel: "For you, the owner",
    clientLabel: "For your customer",
    ownerSteps: [
      {
        title: "Create your shop",
        description: "Your business name and the WhatsApp number where you want to receive orders.",
      },
      {
        title: "Upload your products",
        description: "Photo, price, and stock. Mark items as sold out with one click.",
      },
      {
        title: "Share your link",
        description: "ventafacil.com/tienda/your-shop — post it in your WhatsApp status or Instagram bio.",
      },
    ],
    clientSteps: [
      {
        title: "Open your catalog",
        description: "See photos, prices, and current availability, right from their phone.",
      },
      {
        title: "Build their order",
        description: "Add quantities to the cart, no account or extra details required.",
      },
      {
        title: "Order on WhatsApp",
        description: "One tap and the message arrives ready, with the full order detail.",
      },
    ],
  },
  plans: {
    eyebrow: "Pricing",
    title: "Start free. Grow when your business asks for it.",
    body: "No contracts. If you miss a month, your catalog simply pauses — it isn't lost.",
    perMonth: "COP / month",
    items: [
      {
        name: "Seedling",
        price: 0,
        features: [
          "Up to 10 products",
          "Public catalog with your link",
          "Orders sent straight to WhatsApp",
        ],
        cta: "Start for free",
      },
      {
        name: "Entrepreneur",
        price: 29900,
        featured: true,
        badge: "Recommended",
        features: [
          "Up to 100 products",
          "Automatic stock deduction",
          "Custom link, no watermark",
        ],
        cta: "Try 14 days free",
      },
    ],
  },
  examples: {
    eyebrow: "For businesses like yours",
    title: "From the hardware store to the clothing shop.",
    body: "VentaFácil isn't built for just one kind of business. Here's what your catalog could look like depending on what you sell.",
    shops: [
      {
        name: "Ferretería El Tornillo",
        tag: "Hardware",
        items: [
          { name: '1" Screws (x50)', price: 8000 },
          { name: "Electrical tape", price: 3500 },
          { name: "40mm Padlock", price: 12000 },
        ],
      },
      {
        name: "Ropa Bonita",
        tag: "Fashion",
        items: [
          { name: "Cotton T-shirt", price: 35000 },
          { name: "Classic jeans", price: 89000 },
          { name: "Light jacket", price: 120000 },
        ],
      },
      {
        name: "Depósito La Cosecha",
        tag: "Coffee",
        items: [
          { name: "Huila Coffee 500g", price: 14000 },
          { name: "Huila Coffee 1kg", price: 26000 },
          { name: "Panela 1kg", price: 4500 },
        ],
      },
    ],
  },
  final: {
    title: "Your digital storefront, ready before close of business today.",
    body: "Set it up in five minutes and start receiving organized orders this afternoon.",
    ctaPrimary: "Create my catalog for free",
    ctaWhatsapp: "Message us on WhatsApp",
  },
  footer: {
    madeFor: "Built for businesses in Isnos, Pitalito, and the Huila region.",
    disclaimer: "VentaFácil is not affiliated with WhatsApp Inc. — we use public wa.me links.",
  },
  theme: {
    toLight: "Switch to light theme",
    toDark: "Switch to dark theme",
  },
};
