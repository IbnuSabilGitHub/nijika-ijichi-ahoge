// Fungsi untuk menggambar gambar pada posisi tertentu
export function drawImage(src, x, y, width, height) {
  const img = new Image();
  img.src = src;
  img.onload = function () {
    ctx.drawImage(img, x, y, width, height);
  };
}
