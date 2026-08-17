import type { HomeDict } from "./types";

export const es: HomeDict = {
  meta: {
    title: "VentaFácil Huila",
    description:
      "Catálogo digital e inventario para micronegocios, con pedidos directos a WhatsApp.",
  },
  nav: {
    how: "Cómo funciona",
    plans: "Planes",
    login: "Entrar",
    cta: "Empezar gratis",
  },
  hero: {
    eyebrow: "Catálogo digital · Pedidos por WhatsApp",
    headlinePre: "Deja de escribir ",
    headlineAccent: "el mismo precio",
    headlinePost: " veinte veces al día.",
    lede: "Sube tus productos, comparte tu link y cada pedido te llega ya organizado al WhatsApp — con cliente, dirección y total. Sin apps que instalar, sin costo para empezar.",
    ctaPrimary: "Crear mi catálogo gratis",
    ctaSecondary: "Ver cómo funciona",
    proof: [
      "Listo en menos de 5 minutos",
      "Sin tarjeta de crédito",
      "Hecho para Isnos y Pitalito",
    ],
    ticketShop: "Donde Marleny",
    ticketLabel: "Catálogo",
    ticket: [
      { name: "Arroz Diana 500g", price: 2500 },
      { name: "Café Huila 500g", price: 14000 },
      { name: "Aceite Gourmet 1L", price: 9800, tag: "Sin stock" },
    ],
    waCaption: "Así llega a tu WhatsApp",
    waHeader: "Nuevo pedido — VentaFácil",
    waClientLabel: "Cliente:",
    waClientValue: "María Fernanda",
    waAddressLabel: "Dirección:",
    waAddressValue: "Cra 5 #12-30, Pitalito",
    waPaymentLabel: "Pago:",
    waPaymentValue: "Nequi",
    waDetailLabel: "Detalle del pedido:",
    waItems: [
      { label: "2x Arroz Diana 500g", price: 5000 },
      { label: "1x Café Huila 500g", price: 14000 },
    ],
    waTotalLabel: "Total a pagar:",
    waTotalPrice: 19000,
    waFooter: "Enviado desde el catálogo digital de Donde Marleny.",
  },
  problem: {
    eyebrow: "El problema de vender por chat",
    title: "Tu chat de WhatsApp no es un catálogo.",
    body: "Los mismos precios, la misma disponibilidad, la misma dirección — escritos a mano, mensaje por mensaje, todo el día.",
    beforeLabel: "Antes",
    afterLabel: "Con VentaFácil",
    beforeChats: [
      "Hola, ¿cuánto vale el arroz?",
      "¿Tienen café de libra?",
      "Sí, a 14.000 la libra",
      "¿Y ya está listo mi pedido de ayer?",
      "¿Cuál era mi dirección que te di?",
    ],
    afterHeader: "Nuevo pedido — María Fernanda",
    afterLines: ["2x Arroz Diana 500g", "1x Café Huila 500g"],
    afterTotalLabel: "Total:",
    afterTotalPrice: 19000,
    afterAddress: "Dirección: Cra 5 #12-30",
  },
  how: {
    eyebrow: "Cómo funciona",
    title: "Dos caminos cortos: el tuyo y el de tu cliente.",
    body: "Nada que instalar del lado del comprador. Del tuyo, tres pasos y ya quedaste montado.",
    ownerLabel: "Para ti, el dueño",
    clientLabel: "Para tu cliente",
    ownerSteps: [
      {
        title: "Crea tu tienda",
        description:
          "Nombre del negocio y el número de WhatsApp donde quieres recibir los pedidos.",
      },
      {
        title: "Sube tus productos",
        description: "Foto, precio y stock. Puedes marcar cuáles están agotados con un clic.",
      },
      {
        title: "Comparte tu link",
        description:
          "ventafacil.com/store/tu-código — pégalo en tu estado de WhatsApp o Instagram.",
      },
    ],
    clientSteps: [
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
    ],
  },
  plans: {
    eyebrow: "Planes",
    title: "Empieza gratis, tú mismo.",
    body: "Regístrate y monta tu catálogo en minutos, sin depender de nadie. Sin permanencia — si un mes no pagas, tu catálogo se pausa, no se pierde.",
    items: [
      {
        name: "Semilla",
        priceLabel: "$0",
        priceUnit: "COP / mes",
        features: [
          "Hasta 10 productos",
          "Catálogo público con tu link",
          "Pedidos directos a tu WhatsApp",
        ],
        cta: "Empezar gratis",
        optionalNote: {
          text: "¿Prefieres que te ayudemos a montarlo? Es opcional.",
          cta: "Agendar una demo gratis",
        },
      },
      {
        name: "Promo Lanzamiento",
        priceLabel: "Desde $30.000",
        priceUnit: "COP · pago único",
        features: [
          "Hasta 20 productos",
          "Cargamos tus fotos y precios por ti",
          "Incluye tu primer mes de servicio",
        ],
        cta: "Quiero que me lo armen",
      },
      {
        name: "Emprendedor",
        priceLabel: "Desde $25.000",
        priceUnit: "COP / mes",
        featured: true,
        badge: "Recomendado",
        features: [
          "Hasta 100 productos",
          "Descuento automático de stock",
          "Link personalizado, sin marca de agua",
        ],
        cta: "Probar 14 días gratis",
      },
    ],
  },
  examples: {
    eyebrow: "Para negocios como el tuyo",
    title: "De la ferretería a la tienda de ropa.",
    body: "VentaFácil no está pensado para un solo tipo de negocio. Así se vería tu catálogo según a qué te dediques.",
    shops: [
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
    ],
  },
  final: {
    title: "Tu vitrina digital, lista antes del cierre de hoy.",
    body: "Súbela en cinco minutos y empieza a recibir pedidos organizados esta misma tarde.",
    ctaPrimary: "Crear mi catálogo gratis",
    ctaWhatsapp: "Escríbenos por WhatsApp",
  },
  footer: {
    madeFor: "Hecho para negocios de Isnos, Pitalito y el Huila.",
    disclaimer: "VentaFácil no está afiliado a WhatsApp Inc. — usamos enlaces públicos wa.me.",
    terms: "Términos y Condiciones",
  },
  theme: {
    toLight: "Cambiar a tema claro",
    toDark: "Cambiar a tema oscuro",
  },
};
