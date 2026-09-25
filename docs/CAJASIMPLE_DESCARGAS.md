# Descargas de CajaSimple — cómo publicar una versión

La página **/cajasimple** ofrece el instalador de CajaSimple (app de escritorio
para Windows) a los usuarios piloto. Los archivos no viven en este repositorio:
están en una carpeta pública de Supabase Storage (bucket `cajasimple`), así que
publicar una versión nueva **no exige redesplegar Vitrina Digital**.

- Página: `https://vitrina-digital-prod.vercel.app/cajasimple` (con `noindex`, sin enlace desde la portada).
- Dirección base de la carpeta pública (producción, **sin barra final**):

  ```
  https://jyzyvhmhcvskjcmsuplz.supabase.co/storage/v1/object/public/cajasimple
  ```

## Cómo funciona

1. La página lee `<base>/latest.json` desde el servidor y lo revalida cada 60 s.
2. El botón «Descargar para Windows» apunta a `platforms["windows-x86_64"].url`.
3. Si `latest.json` no se puede leer, falta la plataforma o la `url` apunta fuera
   de la carpeta pública, la página muestra «descarga no disponible» y un botón de WhatsApp.
4. La app de escritorio lee ese mismo `latest.json` para actualizarse. **No se
   cambia su formato ni los nombres de archivo.**

## Los 3 archivos de cada versión

| Archivo | Ejemplo |
| --- | --- |
| Instalador | `CajaSimple_0.1.0_x64-setup.exe` |
| Firma | `CajaSimple_0.1.0_x64-setup.exe.sig` |
| Metadatos | `latest.json` |

`latest.json` (formato del actualizador de Tauri; compáralo con el que genera tu compilación):

```json
{
  "version": "0.1.0",
  "notes": "Primera versión piloto.",
  "pub_date": "2026-10-01T15:00:00Z",
  "platforms": {
    "windows-x86_64": {
      "signature": "<contenido del archivo .sig>",
      "url": "https://jyzyvhmhcvskjcmsuplz.supabase.co/storage/v1/object/public/cajasimple/CajaSimple_0.1.0_x64-setup.exe"
    }
  }
}
```

La `url` debe empezar por la dirección base de arriba y terminar en el nombre
exacto del instalador.

## Configuración única (antes de compilar el primer instalador)

1. En Vercel → Settings → Environment Variables (**Production**), crea
   `NEXT_PUBLIC_CAJASIMPLE_DESCARGAS_URL` con la dirección base de arriba.
   Es una variable `NEXT_PUBLIC_`, así que se lee al compilar: **hay que
   desplegar de nuevo** después de crearla.
2. En la compilación de CajaSimple, usa esa misma dirección base para armar la `url` de `latest.json`.

El bucket `cajasimple` lo crea el script de subida si no existe (público, solo
lectura). Nadie más puede escribir: no hay políticas de escritura.

## Subir una versión (pasos exactos)

1. Pon los 3 archivos en una carpeta, por ejemplo `C:\Release\0.1.0`, con los nombres exactos de arriba.
2. En una terminal (Git Bash) en la raíz del repo de Vitrina Digital, con las
   credenciales de **producción** (Supabase → Project Settings → API):

   ```bash
   SUPABASE_URL=https://jyzyvhmhcvskjcmsuplz.supabase.co \
   SUPABASE_SERVICE_ROLE_KEY=<clave service_role de producción> \
   node scripts/subir-cajasimple.mjs "C:/Release/0.1.0"
   ```

3. El script, antes de subir nada, comprueba que los 3 archivos sean coherentes
   (la versión del nombre coincide con `latest.json`, la `url` termina en el
   instalador y empieza por la base, y hay firma). Si algo no cuadra, no sube nada.
4. Sube primero el instalador y la firma, y **al final `latest.json`**, para que
   nadie vea una versión nueva cuyo instalador todavía no está.
5. Al terminar imprime lo que sirve la carpeta pública. Debe verse:
   - `latest.json` → `application/json`, `cache-control: public, max-age=60`
   - instalador y firma → `max-age=3600`
6. Abre `/cajasimple` (puede tardar hasta 60 s en mostrar la versión nueva).

La `service_role` solo se usa en tu terminal para este comando; la página no la
usa y no se guarda en ningún archivo.

### Alternativa manual (no recomendada)

Puedes arrastrar los archivos en Supabase → Storage → `cajasimple`, pero el
dashboard sube todo con caché de **1 hora**: `latest.json` tardaría hasta una
hora en verse. Por eso el script.

## Cosas a tener en cuenta

- Cada versión nueva es un instalador nuevo con su nombre; no borres los
  anteriores mientras haya equipos que aún puedan necesitarlos.
- Plan gratis de Supabase: límite de tamaño por archivo (50 MB). Si el
  instalador lo supera, hay que subir de plan o alojarlo en otro sitio.
- El instalador aún no tiene certificado de firma de código de Microsoft, por
  eso Windows muestra la pantalla azul; la página ya explica cómo continuar.
