#!/usr/bin/env node
// Sube una versión de CajaSimple al bucket público `cajasimple` de Supabase
// Storage: CajaSimple_X.Y.Z_x64-setup.exe, su .sig y latest.json.
//
// Uso (desde la raíz del repo):
//   SUPABASE_URL=https://<ref>.supabase.co \
//   SUPABASE_SERVICE_ROLE_KEY=<clave service_role> \
//   node scripts/subir-cajasimple.mjs <carpeta-con-los-3-archivos>
//
// La service_role solo se usa aquí, en tu terminal, para escribir en el
// bucket; nunca la usa la página ni se guarda en ningún archivo.
//
// Por qué un script y no arrastrar los archivos en el dashboard: latest.json
// tiene que servirse con caché de 60 s (para que los usuarios vean la versión
// nueva enseguida) y el dashboard sube todo con caché de 1 hora.

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const BUCKET = "cajasimple";
const PLATAFORMA = "windows-x86_64";

const carpeta = process.argv[2];
const supabaseUrl = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/+$/, "");
const clave = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

function fallar(mensaje) {
  console.error(`\nERROR: ${mensaje}\n`);
  process.exit(1);
}

if (!carpeta) fallar("Indica la carpeta con los 3 archivos: node scripts/subir-cajasimple.mjs <carpeta>");
if (!supabaseUrl || !clave) fallar("Faltan SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY en el entorno.");

const base = `${supabaseUrl}/storage/v1/object/public/${BUCKET}`;
const autorizacion = { apikey: clave, Authorization: `Bearer ${clave}` };

// 1) Encontrar y validar los 3 archivos ------------------------------------
const nombres = await readdir(carpeta);
const exe = nombres.find((n) => /^CajaSimple_\d+\.\d+\.\d+_x64-setup\.exe$/.test(n));
if (!exe) fallar("No hay un CajaSimple_X.Y.Z_x64-setup.exe en la carpeta.");
const version = exe.match(/^CajaSimple_(\d+\.\d+\.\d+)_/)[1];
const sig = `${exe}.sig`;
if (!nombres.includes(sig)) fallar(`Falta ${sig}.`);
if (!nombres.includes("latest.json")) fallar("Falta latest.json.");

let latest;
try {
  latest = JSON.parse(await readFile(path.join(carpeta, "latest.json"), "utf8"));
} catch {
  fallar("latest.json no es un JSON válido.");
}
const urlInstalador = latest?.platforms?.[PLATAFORMA]?.url;
if (latest?.version !== version) {
  fallar(`latest.json dice versión "${latest?.version}" pero el instalador es ${version}.`);
}
if (typeof urlInstalador !== "string" || !urlInstalador.endsWith(`/${exe}`)) {
  fallar(`platforms["${PLATAFORMA}"].url de latest.json debe terminar en /${exe}.`);
}
if (!urlInstalador.startsWith(`${base}/`)) {
  fallar(`La url del instalador en latest.json debe empezar por ${base}/`);
}
if (!latest.platforms[PLATAFORMA].signature) fallar("latest.json no trae la firma (signature).");

// 2) Asegurar que el bucket existe y es público ---------------------------
const consulta = await fetch(`${supabaseUrl}/storage/v1/bucket/${BUCKET}`, { headers: autorizacion });
if (consulta.status === 404 || consulta.status === 400) {
  const crear = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
    method: "POST",
    headers: { ...autorizacion, "Content-Type": "application/json" },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true }),
  });
  if (!crear.ok) fallar(`No se pudo crear el bucket: ${crear.status} ${await crear.text()}`);
  console.log(`Bucket "${BUCKET}" creado (público).`);
} else if (!consulta.ok) {
  fallar(`No se pudo consultar el bucket: ${consulta.status} ${await consulta.text()}`);
}

// 3) Subir: primero instalador y firma, y latest.json AL FINAL, para que
//    nadie vea una versión nueva cuyo instalador todavía no está subido.
async function subir(nombre, tipo, segundosDeCache) {
  const cuerpo = await readFile(path.join(carpeta, nombre));
  const r = await fetch(`${supabaseUrl}/storage/v1/object/${BUCKET}/${encodeURIComponent(nombre)}`, {
    method: "POST",
    headers: {
      ...autorizacion,
      "Content-Type": tipo,
      "Cache-Control": `max-age=${segundosDeCache}`,
      "x-upsert": "true",
    },
    body: cuerpo,
  });
  if (!r.ok) fallar(`No se pudo subir ${nombre}: ${r.status} ${await r.text()}`);
  console.log(`Subido ${nombre} (${(cuerpo.length / 1024 / 1024).toFixed(1)} MB)`);
}

await subir(exe, "application/octet-stream", 3600);
await subir(sig, "text/plain", 3600);
await subir("latest.json", "application/json", 60);

// 4) Comprobar lo que ve el público -----------------------------------------
console.log("\nComprobando lo que sirve la carpeta pública:");
for (const nombre of [exe, sig, "latest.json"]) {
  // GET y no HEAD: Storage responde HEAD con cabeceras de caché distintas a las reales.
  const r = await fetch(`${base}/${encodeURIComponent(nombre)}?verificar=${Date.now()}`);
  await r.body?.cancel();
  console.log(
    `  ${r.status}  ${nombre}  [${r.headers.get("content-type")}]  cache-control: ${r.headers.get("cache-control")}`,
  );
}
console.log(`\nListo. Dirección base: ${base}`);
