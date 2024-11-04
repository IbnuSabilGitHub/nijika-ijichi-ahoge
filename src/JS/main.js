// Array untuk menyimpan semua ahoge

import { drawImage } from "./function.js";
import { textConfig } from "./function.js";

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
let ahogeToRemove = [];

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
// const maxSpeed = 2; // Kecepatan maksimum ahoge

let targetX = 185; // Posisi x ahoge dalam gambar asli
let targetY = 115; // Posisi y ahoge dalam gambar asli
let targetWidth = 30; // Lebar area ahoge
let targetHeight = 40; // Tinggi area ahoge


if (window.innerWidth < 430) {
  // Ubah Ukuran gambar nijika
  nijika.width = 200;
  nijika.height = 200;

  // ubah ukuran gambar logo
  logo.width = 250;
  logo.height = 250;

  // Ubah ukuran partikel ahoge



  // Ubah target button ahode
  targetX = 100; // Posisi x ahoge dalam gambar asli
  targetY = 60; // Posisi y ahoge dalam gambar asli
  targetWidth = 15; // Lebar area ahoge
  targetHeight = 20; // Tinggi area ahoge
}

function setupText() {
  ctx.font = textConfig.font;
  ctx.fillStyle = textConfig.fillStyle;
  ctx.textAlign = textConfig.textAlign;
  ctx.textBaseline = textConfig.textBaseline;
}

function drawText(text, x, y) {
  setupText();
  ctx.fillText(text, x, y);
}

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
  const text = "Developed by IBNU with ❤️";
  let counterAhoge = `Ahoge : ${ahoge.length}`;
  drawText(text, 115, 18);
  drawText(counterAhoge, 50, 50);

  // gambar nijika

  drawImage(
    ctx,
    nijika,
    0,
    canvas.height - nijika.height,
    1,
    nijika.width,
    nijika.height
  );
  // Gambar logo
  drawImage(
    ctx,
    logo,
    (canvas.width - logo.width) / 2,
    (canvas.height - logo.height) / 4,
    0.3
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

  if(isOn){ 
    const index =  Math.floor(Math.random() * ahogeToRemove.length); // Pilih index acak
    ahoge.splice(index, 1); // Hapus dari array particles
  }



  handleCollisions();

  ahoge.forEach((p,index) => {
    // Update posisi berdasarkan kecepata

    // Jika magnet aktif, tarik ahoge ke magnet
    if (magnet.statusMaget && ahoge.length > 10) {
      // let dx = magnet.x + magnetImage.width / 2 - p.x;
      // let dy = magnet.y + magnetImage.height / 2 - p.y;
      let dx = magnet.x - p.x;
      let dy = magnet.y - p.y;
      let distance = Math.max(50, Math.sqrt(dx * dx + dy * dy));
      // console.log(distance);

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
        if(distance < 51){
          ahogeToRemove.push(index);
        }
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
    const ahogeWidth = window.innerWidth < 420 ? 20 :40;
    const ahogeHeight = window.innerWidth < 420 ? 20 :40;
    ctx.drawImage(ahogeImage, -15, -15,ahogeWidth, ahogeHeight);
    ctx.restore();
  });
  requestAnimationFrame(animateAhoge);
}

let isOn = false; // Status awal
const intervalTime = 1000; // Jeda waktu dalam milidetik (1 detik)
let intervalId; // Menyimpan ID interval

function startInterval() {
  intervalId = setInterval(() => {
    if (ahogeToRemove.length > 0 && magnet.statusMaget) {
      // Jika ada ahoge yang akan dihapus

      // Mengubah status switch
      isOn = !isOn; // Toggle status
      console.log(`Switch is now: ${isOn ? 'ON' : 'OFF'}`);

    }
  }, intervalTime);
}

// Tambahkan event listener untuk klik
canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;



  const imgWidth = nijika.width;
  const imgHeight = nijika.height;

  const imgX = 0;
  const imgY = canvas.height - imgHeight;

  const targetCanvasX = imgX + (targetX / nijika.width) * imgWidth;
  const targetCanvasY = imgY + (targetY / nijika.height) * imgHeight;
  const targetCanvasWidth = (targetWidth / nijika.width) * imgWidth;
  const targetCanvasHeight = (targetHeight / nijika.height) * imgHeight;

  // Cek apakah klik berada di area target (mata)
  if (
    x > targetCanvasX &&
    x < targetCanvasX + targetCanvasWidth &&
    y > targetCanvasY &&
    y < targetCanvasY + targetCanvasHeight
  ) {
    const soundAhoge = new Audio("/public/assets/sound/happy-pop-2-185287.mp3");
    soundAhoge.play();
    createAhoge(x, y);
  }
  // console.log(`Mouse: (${mouseX}, ${mouseY}) | Target: X(${xStart}-${xEnd}), Y(${yStart}-${yEnd})`);

  // Deteksi klik dalam area target
  // if (mouseX >= xStart && mouseX <= xEnd && mouseY >= yStart && mouseY <= yEnd) {
  //   // Mainkan efek suara

  // }
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
      p.vx += (Math.random() - 0.5) * 4;
      p.vy += (Math.random() - 0.5) * 4;
    });
    clearInterval(intervalId); // Hentikan interval
    isOn = false; //matikan peghapusan
    ahogeToRemove = []; // Reset array
    magnet.statusMaget = false;
  } else {
    // Mengaktifkan magnet dengan posisi acak
    magnet.x = Math.random() * canvas.width;
    magnet.y = Math.random() * canvas.height;
    startInterval(); // Mulai interval
    magnet.statusMaget = true;
  }
}, 5000); // Ulangi setiap 5 detik

ahogeImage.onload = () => {
  animateAhoge();
};
// animateAhoge();
