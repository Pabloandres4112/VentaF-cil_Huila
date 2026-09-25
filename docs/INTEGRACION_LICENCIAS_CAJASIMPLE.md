# Integración de licencias — guía para CajaSimple

Este documento explica, del lado de **CajaSimple** (la app de escritorio que
consume este servicio), cómo integrarse con el sistema de licencias que vive
en el backend de **Vitrina Digital**. CajaSimple no tiene ninguna base de
datos ni lógica de licencias propia: todo el control (activar, desactivar,
poner fecha de vencimiento, atar a un equipo) pasa por un único endpoint
HTTP que expone Vitrina Digital.

No hace falta conocer el resto de Vitrina Digital (catálogo, pedidos,
tiendas) para implementar esto — es un subsistema aparte, pensado para poder
usarse desde cualquier otro producto además de CajaSimple en el futuro.

## 1. Idea general

- Cada licencia vendida vive como una fila en una base de datos que solo
  controla Vitrina Digital. CajaSimple nunca la toca directamente.
- CajaSimple guarda dos cosas localmente: el **código de licencia**
  (`licencia_key`, algo como `CAJA-7F3A9C1B2D`) que le entregan al comprar, y
  un **identificador de su propio equipo** (`hardware_id`) que CajaSimple
  genera una sola vez y reutiliza siempre.
- Al iniciar (o cuando haga falta re-verificar), CajaSimple llama a un
  endpoint HTTP mandando esos dos datos, y Vitrina Digital responde si la
  licencia es válida o no, y por qué.
- La primera vez que una licencia se valida con éxito, Vitrina Digital la
  "activa" en ese equipo: guarda ese `hardware_id` como el dueño de la
  licencia. Desde ese momento, si alguien intenta usar la misma
  `licencia_key` desde otro equipo, la respuesta lo rechaza
  (`HARDWARE_NO_COINCIDE`). Así una licencia solo sirve en un equipo a la
  vez.

## 2. El endpoint

```
POST https://<dominio-de-vitrina-digital>/api/v1/licencias/validar
```

En producción, `<dominio-de-vitrina-digital>` es el dominio de Vercel del
proyecto (pregúntale a quien administra Vitrina Digital cuál es el actual;
puede cambiar si se agrega un dominio propio).

### Headers

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `X-Caja-Api-Key` | El secreto compartido (ver sección 5). |

### Body (JSON)

```json
{
  "licencia_key": "CAJA-7F3A9C1B2D",
  "hardware_id": "un-identificador-estable-de-este-equipo"
}
```

- `licencia_key` (string, **requerido**): no distingue mayúsculas/minúsculas
  (el servidor la normaliza a mayúsculas antes de buscarla).
- `hardware_id` (string, opcional pero **muy recomendado** en la práctica):
  si se omite, el servidor valida el código pero no ata ni verifica equipo —
  es decir, sin `hardware_id` la licencia podría usarse en cualquier
  cantidad de equipos sin que nada lo impida. CajaSimple siempre debe
  mandarlo.

  Cómo generarlo queda del lado de CajaSimple — debe ser **estable entre
  reinicios de la app** (no un UUID nuevo cada vez) e idealmente único por
  máquina real. Como CajaSimple es Tauri, una opción típica es derivarlo de
  algo propio del sistema operativo (ID de máquina, disco, MAC address) y
  guardarlo una vez en el almacenamiento local de la app.

### Campos opcionales: datos del cliente y términos

Además de `licencia_key` y `hardware_id`, el body puede incluir estos dos
objetos. Ambos son **opcionales** (las versiones que no los mandan siguen
funcionando igual) y **no entran en la firma ni cambian la respuesta**:

```json
{
  "licencia_key": "CAJA-7F3A9C1B2D",
  "hardware_id": "un-identificador-estable-de-este-equipo",
  "cliente": { "negocio": "Tienda X", "responsable": "Ana", "telefono": "3001234567" },
  "terminos": { "version": "1.0", "aceptados_en": "2026-09-24T15:00:00Z" }
}
```

- Se guardan junto a la licencia para que el operador los vea en el panel, y
  se actualizan en cada validación si cambian. Cualquier campo vacío,
  inválido o desconocido simplemente se ignora (no da error).
- `aceptados_en` debe ser una fecha ISO 8601 en UTC.
- Si `negocio` o `telefono` cambian respecto a lo ya guardado, la licencia
  queda **marcada para revisión** en el panel. Es solo un aviso para el
  operador: **no bloquea** la validación.
- Los datos personales nunca se devuelven en la respuesta.

### Respuesta (200 OK)

```json
{
  "valida": true,
  "estado": "ACTIVA",
  "fecha_vencimiento": "2026-12-31T23:59:59+00:00",
  "hardware_id": "un-identificador-estable-de-este-equipo",
  "firma_seguridad": "a3f1...hex..."
}
```

| Campo | Tipo | Significado |
| --- | --- | --- |
| `valida` | boolean | `true` solo si la licencia puede usarse ahora mismo. Es el único campo que hace falta mirar para decidir "¿dejo entrar al usuario?". |
| `estado` | string | Por qué es o no válida (ver tabla abajo). Útil para mostrarle al usuario un mensaje concreto, no solo "licencia inválida". |
| `fecha_vencimiento` | string ISO 8601 o `null` | Fecha de corte de la licencia, si tiene una. `null` = sin fecha de vencimiento. |
| `hardware_id` | string o `null` | El equipo al que está atada la licencia según el servidor. Normalmente es el mismo que mandaste; en `HARDWARE_NO_COINCIDE` es el del otro equipo, y en `INVALIDA` viene `null`. Se devuelve porque forma parte de la firma. |
| `firma_seguridad` | string (hex) | Firma para verificar que la respuesta no fue alterada. Ver sección 4 — **importante si CajaSimple va a cachear la respuesta para uso offline**. |

### Valores posibles de `estado`

| `estado` | `valida` | Qué significa |
| --- | --- | --- |
| `ACTIVA` | `true` | Todo bien, la licencia está al día. |
| `DESHABILITADA` | `false` | El operador la desactivó manualmente desde el panel admin (ej. por impago o fraude). |
| `VENCIDA` | `false` | Tiene `fecha_vencimiento` y ya pasó. |
| `INVALIDA` | `false` | El código no existe en la base de datos (typo, licencia nunca creada, etc). |
| `HARDWARE_NO_COINCIDE` | `false` | La licencia ya está activada en OTRO equipo distinto al que está llamando ahora. |

CajaSimple debería tratar **cualquier valor de `estado` que no reconozca**
como "no válida" (igual que trata `valida: false`), no solo la lista de
arriba — así, si más adelante se agrega un estado nuevo del lado de Vitrina
Digital, CajaSimple no se rompe ni deja pasar algo por error.

### Respuestas de error (no HTTP 200)

| HTTP | Cuándo pasa | Qué debe hacer CajaSimple |
| --- | --- | --- |
| `400` | Falta `licencia_key` en el body. | Error de programación del lado de CajaSimple — no debería pasar en producción. |
| `401` | El header `X-Caja-Api-Key` no vino o no coincide. | Revisar que el secreto esté bien configurado en el build de CajaSimple. |
| `429` | Se superó el límite de intentos (ver sección 6). | Esperar y reintentar más tarde — no reintentar en loop inmediato. |

## 3. Flujo recomendado en CajaSimple

1. Al iniciar la app, leer `licencia_key` y `hardware_id` guardados
   localmente (si no hay `hardware_id` guardado, generarlo una vez y
   persistirlo).
2. Llamar al endpoint con esos dos valores.
3. Si la llamada responde y `valida: true` → dejar entrar, y guardar la
   respuesta completa (incluida `firma_seguridad`) en un caché local para
   poder funcionar offline más adelante.
4. Si responde y `valida: false` → bloquear el uso normal de la app y
   mostrarle al usuario un mensaje según `estado` (ej. "Tu licencia venció
   el 31 de diciembre de 2026", "Esta licencia ya está activada en otro
   equipo", etc).
5. Si la llamada falla por red (CajaSimple es offline-first, así que esto va
   a pasar seguido):
   - Si hay una respuesta válida cacheada de antes (con firma verificada,
     ver sección 4) y no ha pasado demasiado tiempo desde la última
     verificación exitosa, dejar entrar en "modo offline" usando esos datos
     cacheados.
   - Definir un límite razonable de cuánto tiempo puede pasar sin poder
     re-validar contra el servidor antes de exigirlo (ej. 7 o 15 días) —
     ese número es una decisión de negocio de CajaSimple, no algo que
     imponga Vitrina Digital.
6. Re-validar periódicamente en segundo plano (ej. una vez al día, o cada
   vez que haya conexión), no solo al abrir la app — así una licencia
   desactivada o vencida se refleja sin esperar a que el usuario cierre y
   vuelva a abrir CajaSimple.

## 4. Verificar `firma_seguridad` (importante para el modo offline)

Como CajaSimple puede cachear la última respuesta válida para funcionar sin
internet, alguien podría intentar manipular ese caché a mano (editar el
archivo local y poner `"valida": true`) para saltarse la licencia. La firma
existe para que CajaSimple pueda detectar eso.

**Regla:** antes de confiar en una respuesta (ya sea recién llegada del
servidor o leída del caché local), CajaSimple debe recalcular la firma con
el mismo algoritmo y compararla con `firma_seguridad`. Si no coinciden, tratar
la respuesta como no confiable (equivalente a `valida: false`).

- Algoritmo: **HMAC-SHA256**, resultado en **hexadecimal**.
- Secreto: `LICENSE_SIGNING_SECRET` (ver sección 5 — es un secreto distinto
  al `X-Caja-Api-Key`).
- Texto a firmar (en este orden exacto, unido con `|`):

  ```
  licencia_key|estado|fecha_vencimiento|hardware_id
  ```

  - `licencia_key`: tal como vino en la respuesta (ya en mayúsculas).
  - `fecha_vencimiento`: el string ISO exacto tal como vino, o `""` (string
    vacío) si vino `null`.
  - `hardware_id`: el valor exacto tal como vino, o `""` si vino `null`.

Ejemplo de referencia en Node.js (la lógica es la misma que corre en el
servidor — portar el mismo cálculo a Rust o al lenguaje que use CajaSimple
para verificar):

```js
const crypto = require("node:crypto");

function verificarFirma({ licencia_key, estado, fecha_vencimiento, hardware_id, firma_seguridad, secret }) {
  const payload = `${licencia_key}|${estado}|${fecha_vencimiento ?? ""}|${hardware_id ?? ""}`;
  const firmaCalculada = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return firmaCalculada === firma_seguridad;
}
```

## 5. Secretos que hay que compartir (fuera del código)

Estos dos valores los genera y guarda quien administra Vitrina Digital
(actualmente Pablo), y hay que pasárselos a quien compila CajaSimple. No van
en ningún repositorio en texto plano.

| Variable | Para qué sirve | Dónde se usa en CajaSimple |
| --- | --- | --- |
| `CAJASIMPLE_API_KEY` | Autentica la llamada al endpoint (header `X-Caja-Api-Key`). Sin ella, el endpoint responde `401` sin siquiera mirar la licencia. | Se manda en cada request. |
| `LICENSE_SIGNING_SECRET` | Verifica que la respuesta (o el caché offline) no fue alterada. | Se usa solo para recalcular la firma, nunca se manda por red. |

**Limitación conocida:** como CajaSimple es una app de escritorio, cualquier
secreto embebido en el binario puede, en teoría, ser extraído por alguien
con suficiente esfuerzo (ingeniería inversa). Esto no es un problema
resoluble del todo sin un backend propio de CajaSimple — hoy el diseño
acepta ese riesgo porque el costo de atacarlo supera el valor de saltarse
una licencia de este producto. Si en el futuro esto deja de ser aceptable
(ej. CajaSimple crece mucho), la solución sería mover la verificación de
firma al servidor también, no confiar en el cliente para eso.

## 6. Límite de intentos (rate limiting)

El endpoint limita a **20 llamadas por minuto por dirección IP**, contadas
*antes* incluso de revisar si el `X-Caja-Api-Key` es correcto (para frenar
también a quien intenta adivinar el secreto, no solo a quien ya lo tiene y
prueba códigos de licencia al azar). Si se supera, responde `429` con:

```json
{ "error": "Demasiados intentos. Intenta de nuevo en un minuto." }
```

En uso normal esto nunca debería activarse — una instalación de CajaSimple
valida su licencia una vez al iniciar (y quizás una vez al día en segundo
plano), muy por debajo del límite. Si CajaSimple ve muchos `429` seguidos
desde una instalación real, probablemente indica un bug reintentando en
loop, no un usuario legítimo.

## 7. Qué NO comparten los dos sistemas

Para que quede claro el alcance: este único endpoint es el **único** punto
de contacto entre CajaSimple y Vitrina Digital. No hay sincronización de
ventas, inventario, clientes, ni ningún otro dato — CajaSimple sigue siendo
100% local/offline-first en todo lo demás. Vitrina Digital tampoco puede
loguearse ni acceder a datos de CajaSimple; la relación es unidireccional
(CajaSimple pregunta, Vitrina Digital responde sí/no).
