// Secciones de contenido de /cajasimple. Textos alineados con el encargo de
// CajaSimple (docs/ENCARGO_VITRINA_PAGINA_PROMO.md): no se agregan funciones,
// precios, planes, horarios ni correos que no estén ahí.

import {
  Boxes,
  ChevronDown,
  DatabaseBackup,
  LifeBuoy,
  Receipt,
  ShoppingCart,
  Tags,
} from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

export function Seccion({
  id,
  titulo,
  children,
}: {
  id: string;
  titulo: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="mb-14">
      <h2 id={id} className="font-display mb-5 text-2xl">
        {titulo}
      </h2>
      {children}
    </section>
  );
}

// ---------------------------------------------------------------- Qué hace

const FUNCIONES = [
  {
    icono: ShoppingCart,
    titulo: "Vende rápido",
    texto:
      "Escanea el código de barras o busca por nombre, aplica descuentos y cobra en efectivo (con el cambio calculado), transferencia o tarjeta. Usa atajos de teclado para no depender del ratón.",
  },
  {
    icono: Boxes,
    titulo: "Controla tu inventario",
    texto:
      "Tus existencias siempre al día, alerta de productos por agotarse y el valor de tu inventario. Registra cada compra a tu proveedor con su costo.",
  },
  {
    icono: Receipt,
    titulo: "Cierra la caja sin dolor de cabeza",
    texto:
      "Mira cuánto vendiste, cómo te pagaron y cuánto ganaste, cada día, con un resumen en PDF.",
  },
  {
    icono: Tags,
    titulo: "Etiquetas con código de barras",
    texto: "Imprime hojas de etiquetas (24 por hoja A4) para los productos que no traen código.",
  },
  {
    icono: DatabaseBackup,
    titulo: "Copias de seguridad",
    texto:
      "Guarda todo en un archivo (en una USB o en la nube) y restáuralo cuando quieras. Exporta tu catálogo a Excel (CSV) o JSON.",
  },
  {
    icono: LifeBuoy,
    titulo: "Ayuda dentro del programa",
    texto: "Guía paso a paso y soporte por WhatsApp, sin salir de CajaSimple.",
  },
];

export function QueHace() {
  return (
    <Seccion id="que-hace" titulo="Qué hace CajaSimple">
      <ul className="grid gap-4 sm:grid-cols-2">
        {FUNCIONES.map(({ icono: Icono, titulo, texto }) => (
          <li key={titulo} className="rounded-xl border border-line bg-surface p-5">
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <Icono aria-hidden="true" className="h-5 w-5" />
            </span>
            <h3 className="mb-1 font-semibold text-ink">{titulo}</h3>
            <p className="text-sm text-ink-soft">{texto}</p>
          </li>
        ))}
      </ul>
    </Seccion>
  );
}

// ----------------------------------------------------------------- Galería

const CAPTURAS = [
  {
    src: "/cajasimple/app-vender.webp",
    titulo: "Vender",
    alt: "Pantalla «Nueva venta» de CajaSimple: una cuenta con tres productos, el total a cobrar, la elección de pago en efectivo, transferencia o tarjeta, y el cambio a devolver ya calculado.",
  },
  {
    src: "/cajasimple/app-productos.webp",
    titulo: "Productos e inventario",
    alt: "Pantalla «Productos»: resumen con el número de productos, el valor del inventario y cuántos necesitan reposición, y una lista de productos con su precio y sus existencias.",
  },
  {
    src: "/cajasimple/app-cierre-de-caja.webp",
    titulo: "Cierre de caja",
    alt: "Pantalla «Cierre de caja»: total vendido del día, número de ventas y ganancia estimada, cómo pagaron los clientes (efectivo, transferencia y tarjeta) y la lista de ventas del día, con el botón para guardar el resumen en PDF.",
  },
  {
    src: "/cajasimple/app-etiquetas.webp",
    titulo: "Etiquetas",
    alt: "Ventana «Imprimir etiquetas de código de barras» con tres opciones para elegir cuántas etiquetas imprimir de cada producto y el botón «Crear PDF».",
  },
];

export function Galeria() {
  return (
    <Seccion id="capturas" titulo="Así se ve">
      <ul className="grid gap-5 sm:grid-cols-2">
        {CAPTURAS.map((captura) => (
          <li key={captura.src}>
            <figure className="flex flex-col gap-2">
              <Image
                src={captura.src}
                alt={captura.alt}
                width={1600}
                height={1000}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="h-auto w-full rounded-xl border border-line"
              />
              <figcaption className="text-sm font-semibold text-ink">{captura.titulo}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-ink-soft">
        Las imágenes usan datos de ejemplo de una tienda ficticia.
      </p>
    </Seccion>
  );
}

// -------------------------------------------------------------- Requisitos

function Lista({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex flex-col gap-2 pl-5 text-sm text-ink-soft" style={{ listStyleType: "disc" }}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function Requisitos() {
  return (
    <Seccion id="requisitos" titulo="Requisitos">
      <p className="mb-4 text-sm text-ink-soft">Son datos orientativos, para que te sirvan de guía.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-line bg-surface p-5">
          <h3 className="mb-3 font-semibold text-ink">Mínimos</h3>
          <Lista
            items={[
              <>
                <strong className="text-ink">Windows 10 u 11, de 64 bits.</strong> No funciona en Mac
                ni en celulares.
              </>,
              <>
                Unos <strong className="text-ink">200 MB libres</strong>. El programa ocupa mucho
                menos; el resto es para tus datos y copias.
              </>,
              <>
                <strong className="text-ink">Internet solo para activar la licencia</strong> (una
                vez) y para actualizar. Para vender no se necesita.
              </>,
            ]}
          />
        </div>
        <div className="rounded-xl border border-line bg-surface p-5">
          <h3 className="mb-3 font-semibold text-ink">Recomendados</h3>
          <Lista
            items={[
              <>
                <strong className="text-ink">4 GB de RAM.</strong>
              </>,
              <>
                <strong className="text-ink">Lector de códigos de barras</strong> (opcional): sirve
                cualquier lector USB que funcione como teclado, que son la gran mayoría.
              </>,
              <>
                <strong className="text-ink">Impresora</strong> (opcional): una impresora normal
                sirve para las hojas de etiquetas.
              </>,
            ]}
          />
        </div>
      </div>
      <p className="mt-4 text-sm text-ink-soft">
        En algunos Windows 10 antiguos, el instalador descarga un componente de Microsoft (WebView2).
        Ahí sí hace falta internet durante la instalación.
      </p>
      <div className="mt-4 rounded-xl border border-line-strong bg-surface-2 p-4 text-sm text-ink">
        <p className="mb-1 font-semibold">Para que no haya sorpresas</p>
        <p className="text-ink-soft">
          CajaSimple es un programa de control interno de tu negocio: no emite factura electrónica ni
          reemplaza a tu contador. Además, todavía no imprime tickets ni recibos térmicos.
        </p>
      </div>
    </Seccion>
  );
}

// ------------------------------------------------------------- Instalación

function Aviso({ children }: { children: ReactNode }) {
  return (
    <p className="mt-2 rounded-lg bg-accent-soft px-3 py-2 font-semibold text-accent">{children}</p>
  );
}

const IMAGENES_PANTALLA_AZUL = [
  {
    src: "/cajasimple/paso-2a-mas-informacion.png",
    ancho: 564,
    alto: 535,
    titulo: "Primero: pulsa «Más información»",
    alt: "Pantalla azul «Windows protegió su PC». Debajo del texto hay un enlace «Más información» y abajo a la derecha un botón «No ejecutar».",
  },
  {
    src: "/cajasimple/paso-2b-ejecutar-de-todas-formas.png",
    ancho: 551,
    alto: 509,
    titulo: "Después: pulsa «Ejecutar de todas formas»",
    alt: "La misma pantalla azul ahora muestra la aplicación CajaSimple_0.1.0_x64-setup.exe y dos botones abajo: «Ejecutar de todas formas» a la izquierda y «No ejecutar» a la derecha.",
  },
];

export function Instalacion() {
  return (
    <Seccion id="instalacion" titulo="Instalación en 4 pasos">
      <ol className="flex flex-col gap-6">
        <Paso numero={1} titulo="Descarga el instalador">
          <p>Pulsa «Descargar para Windows». Se guarda un archivo que termina en «-setup.exe».</p>
          <Aviso>
            Tu navegador puede decir que el archivo «no se descarga habitualmente». Es normal: es un
            programa nuevo y todavía no tiene certificado de firma. Pulsa «Conservar» y, si vuelve a
            preguntar, «Mostrar más» y luego «Conservar de todos modos».
          </Aviso>
        </Paso>

        <Paso numero={2} titulo="Ábrelo">
          <p>
            Haz doble clic en el archivo descargado. Si Windows muestra una pantalla azul que dice
            «Windows protegió su PC», es normal: el instalador todavía no tiene certificado de firma de
            Microsoft.
          </p>
          <Paso2Aviso />
          <div className="mt-4 flex flex-col gap-5">
            {IMAGENES_PANTALLA_AZUL.map((imagen) => (
              <figure key={imagen.src} className="flex flex-col gap-2">
                <figcaption className="font-semibold text-ink">{imagen.titulo}</figcaption>
                <Image
                  src={imagen.src}
                  alt={imagen.alt}
                  width={imagen.ancho}
                  height={imagen.alto}
                  className="h-auto w-full max-w-md rounded-lg border border-line"
                />
              </figure>
            ))}
          </div>
        </Paso>

        <Paso numero={3} titulo="Sigue el asistente">
          <p>El asistente sale en español: pulsa «Siguiente», «Instalar» y, al terminar, «Finalizar».</p>
        </Paso>

        <Paso numero={4} titulo="Abre CajaSimple">
          <p>
            Búscalo en el menú Inicio y ábrelo. Acepta los términos, sigue la bienvenida y activa el
            programa con la clave que te enviamos.
          </p>
        </Paso>
      </ol>
    </Seccion>
  );
}

function Paso2Aviso() {
  return (
    <Aviso>
      Pulsa «Más información» y luego «Ejecutar de todas formas». Hazlo solo si descargaste el archivo
      desde esta página.
    </Aviso>
  );
}

function Paso({
  numero,
  titulo,
  children,
}: {
  numero: number;
  titulo: string;
  children: ReactNode;
}) {
  return (
    <li className="flex gap-3.5">
      <span
        aria-hidden="true"
        className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-ink"
      >
        {numero}
      </span>
      <div className="min-w-0 text-sm text-ink-soft">
        <h3 className="font-semibold text-ink">{titulo}</h3>
        {children}
      </div>
    </li>
  );
}

// -------------------------------------------------------------- Primer día

const PRIMER_DIA = [
  "Crea tus productos.",
  "Imprime las etiquetas, si las necesitas.",
  "Empieza a vender.",
  "Cierra la caja al final del día.",
];

export function PrimerDia() {
  return (
    <Seccion id="primer-dia" titulo="Tu primer día">
      <p className="mb-4 text-sm text-ink-soft">
        Es el mismo orden que te propone la bienvenida del programa.
      </p>
      <ol className="flex flex-col gap-3">
        {PRIMER_DIA.map((texto, i) => (
          <li key={texto} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-accent"
            >
              {i + 1}
            </span>
            <span className="text-sm font-semibold text-ink">{texto}</span>
          </li>
        ))}
      </ol>
    </Seccion>
  );
}

// ---------------------------------------------------------------- Licencia

export function Licencia() {
  return (
    <Seccion id="licencia" titulo="Cómo funciona la licencia">
      <Lista
        items={[
          "Se pide por WhatsApp.",
          <>
            Se activa <strong className="text-ink">una sola vez, con internet</strong>. Después
            funciona sin conexión.
          </>,
          "Es por periodos.",
          <>
            Si vence, tienes <strong className="text-ink">15 días de gracia</strong>. Después, el
            programa <strong className="text-ink">nunca te impide vender</strong>: solo se limitan
            funciones complementarias, como imprimir etiquetas y el PDF del cierre.
          </>,
          <>
            Funciona en <strong className="text-ink">un computador a la vez</strong>. Si cambias de
            computador, te la pasamos en minutos.
          </>,
        ]}
      />
    </Seccion>
  );
}

// ------------------------------------------------------------------ Preguntas

const PREGUNTAS = [
  {
    pregunta: "¿Necesito internet para usarlo?",
    respuesta:
      "Solo para activar la licencia (una vez) y para actualizar. Para usar el programa día a día, incluido vender, no necesitas internet.",
  },
  {
    pregunta: "¿Mis ventas y productos se suben a algún sitio?",
    respuesta:
      "No. Quedan solo en tu computador. Solo guardamos tu nombre, el de tu negocio y tu teléfono, para tu licencia y para darte soporte.",
  },
  {
    pregunta: "¿Qué pasa si cambio de computador o se daña el mío?",
    respuesta:
      "Tus datos van en tu copia de seguridad, así que haz una cada semana. La licencia te la pasamos por WhatsApp en minutos.",
  },
  {
    pregunta: "¿Qué pasa si desinstalo el programa?",
    respuesta:
      "Tus datos se conservan, salvo que marques «Eliminar los datos de aplicación» al desinstalar. No la marques.",
  },
  {
    pregunta: "¿Cómo se actualiza?",
    respuesta:
      "El programa te avisa cuando hay una versión nueva y tú decides cuándo instalarla. No pierdes tus datos.",
  },
  {
    pregunta: "¿Qué pasa si no renuevo mi licencia?",
    respuesta:
      "Tienes 15 días de gracia. Después, el programa nunca te impide vender: solo se limitan funciones complementarias, como imprimir etiquetas y guardar el PDF del cierre.",
  },
  {
    pregunta: "¿Emite factura electrónica?",
    respuesta:
      "No. CajaSimple es un programa de control interno de tu negocio: no emite factura electrónica ni reemplaza a tu contador.",
  },
  {
    pregunta: "¿Funciona en Mac o en celular?",
    respuesta: "No. Por ahora solo funciona en computadores con Windows 10 u 11, de 64 bits.",
  },
];

// Acordeón con <details>: se navega con el teclado sin JavaScript, y el
// atributo `name` hace que solo haya una pregunta abierta a la vez.
export function PreguntasFrecuentes() {
  return (
    <Seccion id="preguntas" titulo="Preguntas frecuentes">
      <div className="flex flex-col gap-3">
        {PREGUNTAS.map(({ pregunta, respuesta }) => (
          <details
            key={pregunta}
            name="preguntas-cajasimple"
            className="group rounded-xl border border-line bg-surface"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-5 py-4 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
              {pregunta}
              <ChevronDown
                aria-hidden="true"
                className="h-4 w-4 flex-none text-ink-soft transition-transform group-open:rotate-180"
              />
            </summary>
            <p className="px-5 pb-4 text-sm text-ink-soft">{respuesta}</p>
          </details>
        ))}
      </div>
    </Seccion>
  );
}
