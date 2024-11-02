// Array untuk menyimpan semua ahoge

import { drawImage } from "./function.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Setting Ahoge
const ahoge = [];
const ahogeCount = 0;
const baseForce = 40;
const damping = 0.98;
const maxDistance = 800; // Jarak maksimum untuk gaya tarik

let magnet = { x: null, y: null, statusMaget: false };
let rotationSpeedRange = { min: 0, max: 5 };

// deklarasi gambar ahoge
const ahogeImage = new Image();
ahogeImage.src = "/public/assets/image/ahoge.webp";

// deklarasi gambar nijika
const nijika = new Image();
nijika.src = "/public/assets/image/nijika-1.png";

// deklarasi gambar log
const logo = new Image();
logo.src = "/public/assets/image/Kessoku_Band_Logo.svg";

const magnetImage = new Image();
magnetImage.src = "/public/assets/image/eww_people.png";

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

// Fungsi untuk mengupdate posisi dan rotasi ahoge
function animateAhoge() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // gambar nijika
  drawImage(ctx, nijika, 0, canvas.height - nijika.height);

  // Gambar logo
  drawImage(
    ctx,
    logo,
    (canvas.width - logo.width) / 2,
    (canvas.height - logo.height) / 4,
    0.5
  );

  if (magnet.statusMaget && ahoge.length > 10) {
    magnetImage.width = 200;
    magnetImage.height = 200;
    const centerX = magnet.x - magnetImage.width / 2;
    const centerY = magnet.y - magnetImage.height / 2;
    drawImage(
      ctx,
      magnetImage,
      centerX,
      centerY,
      1,
      magnetImage.width,
      magnetImage.height
    );
  }

  handleCollisions();

  ahoge.forEach((p) => {
    // Update posisi berdasarkan kecepata

    if (magnet.statusMaget && ahoge.length > 10) {
      // let dx = magnet.x + magnetImage.width / 2 - p.x;
      // let dy = magnet.y + magnetImage.height / 2 - p.y;
      let dx = magnet.x - p.x;
      let dy = magnet.y - p.y;
      let distance = Math.max(50, Math.sqrt(dx * dx + dy * dy));

      if (distance < maxDistance) {
        // Jarak maksimum untuk gaya magnet
        let force = Math.min(baseForce / distance, 0.1);
        // let force = Math.min(baseForce / Math.pow(distance, 1.2), 0.1);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        // let speedMultiplier = Math.max(0.1, 1 - distance / maxDistance); // Mengurangi kecepatan berdasarkan jarak
        p.vx += forceDirectionX * force;
        p.vy += forceDirectionY * force;
        p.vx *= damping;
        p.vy *= damping;
      }
    }

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
  const soundAhoge = new Audio("/public/assets/sound/happy-pop-2-185287.mp3");
  soundAhoge.play();
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
setInterval(() => {
  if (magnet.statusMaget) {
    // Menonaktifkan magnet setelah aktif
    magnet.x = null;
    magnet.y = null;
    ahoge.forEach((p) => {
      p.vx += (Math.random() - 0.5) * 8;
      p.vy += (Math.random() - 0.5) * 8;
    });
    magnet.statusMaget = false;
  } else {
    // Mengaktifkan magnet dengan posisi acak
    magnet.x = Math.random() * canvas.width;
    magnet.y = Math.random() * canvas.height;
    magnet.statusMaget = true;
  }
}, 5000); // Ulangi setiap 5 detik

ahogeImage.onload = () => {
  animateAhoge();
};
// animateAhoge();
