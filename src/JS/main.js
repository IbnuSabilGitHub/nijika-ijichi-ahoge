// Array untuk menyimpan semua ahoge

// import { drawImage } from "./function.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Gambar nijika

// Setting Ahoge
const ahoge = [];
const ahogeCount = 0;
const baseForce = 40;
const damping = 0.98;
const maxDistance = 800; // Jarak maksimum untuk gaya tarik

let magnet = { x: null, y: null };
let rotationSpeedRange = { min: 0, max: 5 };

const ahogeImage = new Image();
ahogeImage.src = "/public/assets/image/ahoge.webp"; // Ganti dengan URL gambar Anda

const nijika = new Image();
nijika.src = "/public/assets/image/nijika.png"; // Ganti dengan URL gambar Anda

// let particles = [];
const maxSpeed = 2; // Kecepatan maksimum ahoge

// Fungsi untuk membuat ahoge baru
function createAhoge(x, y) {
  // Pilih arah rotasi -180 atau 180 derajat
  const randomRotationDirection = Math.random() > 0.5 ? 1 : -1;

  // Tentukan kecepatan rotasi berdasarkan rentang (rotasi lambat)
  const randomRotationSpeed =
    randomRotationDirection *
    (Math.random() * (rotationSpeedRange.max - rotationSpeedRange.min) +
      rotationSpeedRange.min);

  // Inisialisasi data ahoge
  ahoge.push({
    // Posisi ahoge secara acak
    // x: Math.random() * canvas.width,
    // y: Math.random() * canvas.height,
    x: x,
    y: y,

    // Kecepatan ahoge secara acak
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 4,

    // Ukuran ahoge secara acak
    size: Math.random() * 5 + 2,

    angle: 0,
    angularSpeed: (Math.random() - 0.5) * 0.05, // Kecepatan rotasi awal
    rotation: 0, // Rotasi ahoge
    rotationSpeed: randomRotationSpeed, // Kecepatan rotasi yang lebih lambat
    radius: Math.random() * 50 + 50, // Jarak untuk rotasi
    rotationSlowdown: Math.random() * 0.0005 + 0.0001, // Perlamabatan rotasi
  });
}

function handleCollisions() {
  for (let i = 0; i < ahoge.length; i++) {
    for (let j = i + 1; j < ahoge.length; j++) {
      const p1 = ahoge[i];
      const p2 = ahoge[j];

      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Jika ahoge bertabrakan
      if (distance < p1.size + p2.size) {
        // Pantulkan ahoge
        const angle = Math.atan2(dy, dx);
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        // Pisahkan ahoge sedikit
        const overlap = (p1.size + p2.size - distance) / 2;
        p1.x -= overlap * cos;
        p1.y -= overlap * sin;
        p2.x += overlap * cos;
        p2.y += overlap * sin;

        // Tukar kecepatan
        const tempVx = p1.vx;
        const tempVy = p1.vy;
        p1.vx = p2.vx * damping;
        p1.vy = p2.vy * damping;
        p2.vx = tempVx * damping;
        p2.vy = tempVy * damping;
      }
    }
  }
}

function drawMagnet(x, y) {
  magnet.x = x;
  magnet.y = y;
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(magnet.x, magnet.y, 10, 0, Math.PI * 2);
  ctx.fill();
}

// Fungsi untuk mengupdate posisi dan rotasi ahoge
function animateAhoge() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save(); // Simpan keadaan kanvas
  ctx.translate(100, 800); // Pindahkan titik tengah ke posisi gambar
  ctx.rotate(25 * (Math.PI / 180)); // Putar kanvas pada sudut tertentu
  ctx.drawImage(nijika, -nijika.width / 2, -nijika.height / 2); // Gambar gambar dengan pusat sebagai titik referensi
  ctx.restore(); // Kembalikan keadaan kanvas

  handleCollisions();

  ahoge.forEach((p) => {
    // Update posisi berdasarkan kecepata

    p.x += p.vx;
    p.y += p.vy;

    // Update rotasi ahoge
    p.angle += p.angularSpeed || 0;
    p.x += Math.cos(p.angle) * p.radius * 0.01;
    p.y += Math.sin(p.angle) * p.radius * 0.01;

    // Update rotasi berputar dan melambat secara bertahap
    p.rotation += p.rotationSpeed;
    p.rotationSpeed *= 1 - p.rotationSlowdown;

    // Batasi partikel di dalam layar dan pantulkan jika perlu
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    // Gambar elemen ahoge dengan posisi dan rotasi yang diperbarui
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.drawImage(ahogeImage, -15, -15, 30, 30);
    ctx.restore();
  });

  requestAnimationFrame(animateAhoge);
}

// Tambahkan event listener untuk klik
canvas.addEventListener("click", (event) => {
  // Sesuaikan rentang kecepatan rotasi untuk rotasi lambat
  console.log(ahoge);

  createAhoge(event.clientX, event.clientY); // Tambah ahoge di lokasi klik dengan rentang rotasi lambat
  // updateCounterChip();
});

// function deleteParticles() {
//   if (particles.length > 0) {
//     // Pastikan ada ahoge yang akan dihapus
//     const index = Math.floor(Math.random() * particles.length); // Pilih index acak
//     particles[index].element.remove(); // Hapus elemen dari DOM
//     particles.splice(index, 1); // Hapus dari array particles
//   }
// }

// function updateCounterChip() {
//   const counterChip = document.getElementById("counterChip");
//   counterChip.innerHTML = `Chip: ${particles.length}`;
// }

// setInterval(deleteParticles, 1000); // Hapus ahoge setiap 1 detik

// Mulai animasi
// updateCounterChip();

ahogeImage.onload = () => {
  animateAhoge();
};
// animateAhoge();
