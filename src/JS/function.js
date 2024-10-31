export function drawImage(
  ctx,
  image,
  x,
  y,
  transparaency = 1,
  width = image.width,
  height = image.height,
) {
  ctx.save(); // Simpan keadaan kanvas
  // ctx.translate(xPos, yPos); // Pindahkan titik tengah ke posisi gambar
  // ctx.rotate(rotation * (Math.PI / 180)); // Putar kanvas pada sudut tertentu
  ctx.globalAlpha = transparaency; // Set transparansi gambar
  ctx.drawImage(image, x, y, width, height); // Gambar gambar dengan pusat sebagai titik referensi
  ctx.restore(); // Kembalikan keadaan kanvas
}
