// Array untuk menyimpan semua ahoge

import { drawImage } from "./function.js";
import { textConfig } from "./function.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth; // Lebar kanvas mengikuti lebar layar
canvas.height = window.innerHeight; // leabr kanvas mengikuti tinggi layar
const eating = new Audio("/public/assets/sound/eating-effect-254996.mp3");
eating.load();
// Setting untuk Ahoge flying
const ahoge = []; // Array untuk menyimpan semua ahoge
const ahogeCount = 0; // untuk meyimkan jumlah ahoge
const baseForce = 40; // Mengatur Gaya tarik magnet
const damping = 0.98; // mengatur peredaman saat mendekati mangnet
const maxDistance = 400; // Jarak maksimum untuk gaya tarik
let rotationSpeedRange = { min: 0, max: 5 }; // Kecepatan rotasi acak
let ahogeToRemove = []; // Array untuk menyimpan ahoge yang akan dihapus
let magnet = { x: null, y: null, statusMaget: false }; // Magnet untuk menarik ahoge

// Setting untuk Target click untuk mentirggerd ahoge
let targetX = 185; // Posisi x ahoge dalam gambar asli
let targetY = 115; // Posisi y ahoge dalam gambar asli
let targetWidth = 30; // Lebar area ahoge
let targetHeight = 40; // Tinggi area ahoge

let isOn = false; // Status awal
// const getEating = new Audio("/public/assets/sound/eating-effect-254996.mp3");
let removalInterval = 1000; // Interval waktu penghapusan dalam milidetik
let lastRemovalTime = 0; // Waktu penghapusan terakhir
eating.addEventListener("canplaythrough", () => {
  removalInterval = eating.duration * 1000; // Konversi ke milidetik
});

const doritos = {
  x: canvas.width / 2,
  y: 50, // Posisi awal di atas
  vy: 0, // Kecepatan vertikal awal
  vx: 2, // Kecepatan horizontal
  gravity: 0.2, // Akselerasi gravitasi
  bounce: 0.1, // Faktor pantulan
  fill: 0,
  width: 60,
  height: 60,
};

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
// function untuk menangani tabrakan
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
// Function untuk mengatur teks
function setupText() {
  ctx.font = textConfig.font;
  ctx.fillStyle = textConfig.fillStyle;
  ctx.textAlign = textConfig.textAlign;
  ctx.textBaseline = textConfig.textBaseline;
}
// Fungsi untuk menggambar teks di kanvas
function drawText(text, x, y) {
  setupText();
  ctx.fillText(text, x, y);
}

// Fungsi untuk memuat gambar yang mengembalikan Promise
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img); // Resolusi dengan objek img yang sudah dimuat
    img.onerror = reject; // Jika ada kesalahan saat memuat gambar
  });
}

// Deklarasi URL gambar
const ahogeImageSrc = "/public/assets/image/ahoge.webp";
const nijikaImageSrcs = [
  "/public/assets/image/nijika-0.png",
  "/public/assets/image/nijika-1.png",
];
const logoImageSrc = "/public/assets/image/Kessoku_Band_Logo.svg";
const magnetImageSrc = "/public/assets/image/eww_people.png";
const doritosImageSrc = "/public/assets/image/doritos.webp";

// Muat semua gambar sekaligus
Promise.all([
  loadImage(ahogeImageSrc),
  loadImage(nijikaImageSrcs[0]),
  loadImage(nijikaImageSrcs[1]),
  loadImage(logoImageSrc),
  loadImage(magnetImageSrc),
  loadImage(doritosImageSrc),
])
  .then((images) => {
    // Setelah semua gambar dimuat, akses masing-masing gambar dari array `images`
    const [ahogeImage, nijika0, nijika1, logo, magnetImage, doritosImage] =
      images;

    // Gunakan gambar yang sudah dimuat, misalnya simpan dalam variabel
    let nijikaCondition = false;
    const nijikaImage = [nijika0, nijika1];
    const nijika = nijikaImage[+nijikaCondition];

    if (window.innerWidth < 430) {
      // Ubah Ukuran gambar nijika
      nijikaImage[0].width = 200;
      nijikaImage[1].width = 200;
      nijikaImage[0].height = 200;
      nijikaImage[1].height = 200;

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

    // Fungsi untuk mengupdate posisi dan rotasi ahoge
    function animateAhoge(timestamp) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Teks di kanvas
      const text = "Developed by IBNU with ❤️";
      let counterAhoge = `Ahoge : ${ahoge.length}`;
      drawText(text, 115, 18);
      drawText(counterAhoge, 50, 50);

      // gambar nijika di kordinat pojok kiri bawah
      const nijikaAnimation = nijikaImage[+nijikaCondition];
      drawImage(
        ctx,
        nijikaAnimation,
        0,
        canvas.height - nijikaAnimation.height,
        1,
        nijikaAnimation.width,
        nijikaAnimation.height
      );

      // Gambar logo di tengah kanvas
      drawImage(
        ctx,
        logo,
        (canvas.width - logo.width) / 2,
        (canvas.height - logo.height) / 4,
        0.3
      );

      // Gambar doritos di kanvas
      if (ahoge.length > 10) {
        drawImage(
          ctx,
          doritosImage,
          doritos.x,
          doritos.y,
          1,
          doritos.width,
          doritos.height
        );
        doritos.vy += doritos.gravity; // Update kecepatan doritos
        doritos.y += doritos.vy; // Update posisi doritos

        // Jika doritos menyentuh dasar kanvas
        if (doritos.y + doritos.height > canvas.height) {
          doritos.y = canvas.height - doritos.height; // Atur posisi doritos
          doritos.vy *= -doritos.bounce; // Pantulkan doritos
        }
        
      }

      // Gambar magnet di kanvas hnay jika magnet aktif dan ahoge lebih dari 10
      if (magnet.statusMaget && ahoge.length > 10) {
        magnetImage.width = 200;
        magnetImage.height = 200;
        const centerX = magnet.x - magnetImage.width / 2; // Pusat gambar di x
        const centerY = magnet.y - magnetImage.height / 2; // Pusat gambar di y

        // Gambar magnet di kanvas dengan posisi acak
        drawImage(
          ctx,
          magnetImage,
          centerX,
          centerY,
          1,
          magnetImage.width,
          magnetImage.height
        );

        if (isOn && ahoge.length > 10 && ahogeToRemove.length > 0) {
          // Cek apakah sudah melewati interval penghapusan
          if (timestamp - lastRemovalTime >= removalInterval) {
            const index = ahogeToRemove.shift(); // Pilih index acak
            ahoge.splice(index, 1); // Hapus satu item dari array

            eating.play();
            lastRemovalTime = timestamp; // Perbarui waktu penghapusan terakhir
            isOn = false; // Set isOn ke false untuk menunggu sampai interval berikutnya
          }
        } else {
          // Jika isOn adalah false, aktifkan lagi setelah interval berakhir
          if (timestamp - lastRemovalTime >= removalInterval) {
            isOn = true;
          }
        }
      }

      handleCollisions(); // Tangani tabrakan

      // Loop untuk efek force magnet
      ahoge.forEach((p, index) => {
        // Update posisi berdasarkan kecepata

        // Jika magnet aktif, tarik ahoge ke magnet
        if (magnet.statusMaget && ahoge.length > 10) {
          // let dx = magnet.x + magnetImage.width / 2 - p.x;
          // let dy = magnet.y + magnetImage.height / 2 - p.y;
          let dx = magnet.x - p.x; // Hitung jarak antara ahoge dan magnet
          let dy = magnet.y - p.y; // Hitung jarak antara ahoge dan magnet
          let distance = Math.max(50, Math.sqrt(dx * dx + dy * dy)); // gunakan euclidean distance untuk menghitung jarak
          // console.log(distance);

          // hanya tarik ahoge jika jarak lebih kecil dari jarak maksimum
          if (distance < maxDistance) {
            // Jarak maksimum untuk gaya magnet
            let force = Math.min(baseForce / distance, 0.1); // gunakan rumus gaya tarik magnet
            // let force = Math.min(baseForce / Math.pow(distance, 1.2), 0.1);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            // let speedMultiplier = Math.max(0.1, 1 - distance / maxDistance); // Mengurangi kecepatan berdasarkan jarak
            p.vx += forceDirectionX * force;
            p.vy += forceDirectionY * force;
            p.vx *= damping;
            p.vy *= damping;

            // tandai ahoge yang akan dihapus jika tertarik di mangnet
            if (distance <= 50 && !ahogeToRemove.includes(index)) {
              ahogeToRemove.push(index);
            }
          }
        }
        console.log(ahogeToRemove);

        p.x += p.vx; // Update posisi ahoge
        p.y += p.vy; // Update posisi ahoge

        // Update rotasi ahoge
        p.angle += p.angularSpeed || 0;
        p.x += Math.cos(p.angle) * p.radius * 0.01;
        p.y += Math.sin(p.angle) * p.radius * 0.01;

        // Update rotasi berputar dan melambat secara bertahap
        p.rotation += p.rotationSpeed;
        p.rotationSpeed *= 1 - p.rotationSlowdown;

        // Batasi partikel di dalam layar
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Gambar elemen ahoge dengan posisi dan rotasi yang diperbarui
        ctx.save(); // Simpan keadaan kanvas
        ctx.translate(p.x, p.y); // Pindahkan titik tengah ke posisi ahoge
        ctx.rotate((p.rotation * Math.PI) / 180); // Rotasi dalam radian
        // Ukuran ahoge berdasarkan layar
        const ahogeWidth = window.innerWidth < 420 ? 20 : 40;
        const ahogeHeight = window.innerWidth < 420 ? 20 : 40;
        ctx.drawImage(ahogeImage, -15, -15, ahogeWidth, ahogeHeight); // Gambar ahoge
        ctx.restore(); // Kembalikan keadaan kanvas
      });

      requestAnimationFrame(animateAhoge); // Ulangi animasi
    }

    // Event listener untuk klik pada kanvas
    canvas.addEventListener("click", (event) => {
      // Ambil posisi klik
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
        const soundAhoge = new Audio(
          "/public/assets/sound/happy-pop-2-185287.mp3"
        );
        soundAhoge.play();

        const originalValue = false; // simpan nilai asli
        nijikaCondition = !nijikaCondition; // ubah nilai
        // Tunggu 100ms sebelum mengembalikan nilai asli
        setTimeout(() => {
          nijikaCondition = originalValue;
        }, 300);
        createAhoge(x, y);
      }
    });

    animateAhoge(); // Mulai animasi
  })
  .catch((error) => {
    console.error("Error loading images:", error);
  });

setInterval(() => {
  if (magnet.statusMaget) {
    // Menonaktifkan magnet setelah aktif
    magnet.x = null;
    magnet.y = null;
    ahoge.forEach((p) => {
      p.vx += (Math.random() - 0.5) * 4;
      p.vy += (Math.random() - 0.5) * 4;
    });
    // clearInterval(intervalId); // Hentikan interval
    isOn = false; //matikan peghapusan
    ahogeToRemove = []; // Reset array
    eating.pause(); // Hentikan suara
    magnet.statusMaget = false;
  } else {
    // Mengaktifkan magnet dengan posisi acak di kanvas
    magnet.x = Math.random() * canvas.width * 0.9;
    magnet.y = Math.random() * canvas.height * 0.9;
    magnet.statusMaget = true;
  }
}, 10000);
