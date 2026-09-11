// Compresión de imágenes en el navegador, compartida por image-upload.tsx
// (fotos de producto) y logo-upload.tsx (logo de tienda). Siempre reexporta
// como JPEG — esto también neutraliza SVGs con scripts embebidos, porque se
// rasterizan a píxeles antes de subirse a Storage.

const JPEG_QUALITY = 0.8;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("No se pudo leer la imagen"));
    img.src = src;
  });
}

export async function compressImageToJpeg(file: File, maxDimension: number): Promise<string> {
  const original = await readFileAsDataUrl(file);
  const img = await loadImage(original);

  let { width, height } = img;
  if (width > maxDimension || height > maxDimension) {
    const scale = maxDimension / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo procesar la imagen");

  // Fondo blanco antes de dibujar: si el original tenía transparencia (PNG),
  // el JPEG de salida no la soporta y quedaría negro sin esto.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}
