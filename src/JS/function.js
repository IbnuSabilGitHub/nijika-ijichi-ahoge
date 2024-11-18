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


export const textConfig = {
  font: '400 1rem "Segoe UI"',
  fillStyle: 'white',
  textAlign: 'center',
  textBaseline: 'middle'
};

const nijikaImage = {
  src: ["/public/assets/image/nijika-1.png", "/public/assets/image/nijika-0.png"],
  imageFlag: false,
  targetX : 185, // Posisi x ahoge dalam gambar asli
  targetY : 115, // Posisi y ahoge dalam gambar asli
  targetWidth : 30, // Lebar area ahoge
  targetHeight : 40, // Tinggi area ahoge

}


const ahogeImage = {
  src: "/public/assets/image/ahoge.webp",
  ahoge: [], // Array untuk menyimpan semua ahoge
  ahogeCount: 0, // untuk meyimkan jumlah ahoge
  baseForce: 40,// Mengatur Gaya tarik magnet
  damping: 0.98, // mengatur peredaman saat mendekati mangnet
  rotationSpeedRange :{ min: 0, max: 5 }, // Kecepatan rotasi acak
  width: window.innerWidth < 420 ? 20 : 40,
  height: window.innerWidth < 420 ? 20 : 40,
  revomeAhoge: false // Status untuk menghapus ahoge
}

const magnetImage = {
  src: "/public/assets/image/eww_people.png",
  magnet: { x: null, y: null, statusMaget: false }, // Magnet untuk menarik ahoge
  statusMaget: false, // Status magnet aktif atau tidak
}

const ryoChibi = {
  src:[ "/public/assets/image/ryo_chibi.png","/public/assets/image/ryo_chibi_dragging.png",],
  isDragging: false, // Status drag ryo
  isOnGround: true, // Status ryo di tanah
}