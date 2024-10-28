// Array untuk menyimpan semua partikel
let particles = [];
const maxSpeed = 2; // Kecepatan maksimum partikel

// Fungsi untuk membuat partikel baru
function createParticle(
  x,
  y,
  rotationSpeedRange = { min: 90, max: 360 }
) {
  const particle = document.createElement("img");
  particle.classList.add("particle");
  particle.src = "/public/assets/image/ahoge.webp";
  document.body.appendChild(particle);

  // Pilih arah rotasi -180 atau 180 derajat
  const randomRotationDirection = Math.random() > 0.5 ? 1 : -1;

  // Tentukan kecepatan rotasi berdasarkan rentang (rotasi lambat)
  const randomRotationSpeed =
    randomRotationDirection *
    (Math.random() * (rotationSpeedRange.max - rotationSpeedRange.min) +
      rotationSpeedRange.min);

  // Inisialisasi data partikel
  const particleData = {
    element: particle,
    x: x,
    y: y,
    speedX: (Math.random() - 0.5) * maxSpeed,
    speedY: (Math.random() - 0.5) * maxSpeed,
    angle: 0,
    angularSpeed: (Math.random() - 0.5) * 0.05, // Kecepatan rotasi awal
    rotation: 0, // Rotasi partikel
    rotationSpeed: randomRotationSpeed, // Kecepatan rotasi yang lebih lambat
    radius: Math.random() * 50 + 50, // Jarak untuk rotasi
    rotationSlowdown: Math.random() * 0.0005 + 0.0001, // Perlamabatan rotasi
  };

  particles.push(particleData);
}

// Fungsi untuk mengupdate posisi dan rotasi partikel
function updateParticles() {
  particles.forEach((p) => {
    // Update posisi berdasarkan kecepatan
    p.x += p.speedX;
    p.y += p.speedY;

    // Update rotasi partikel
    p.angle += p.angularSpeed;
    p.x += Math.cos(p.angle) * p.radius * 0.01;
    p.y += Math.sin(p.angle) * p.radius * 0.01;

    // Update rotasi berputar dan melambat secara bertahap
    p.rotation += p.rotationSpeed;
    p.rotationSpeed *= 1 - p.rotationSlowdown; // Kurangi kecepatan rotasi setiap frame

    // Terapkan posisi dan rotasi ke elemen partikel
    p.element.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rotation}deg)`;

    // Deteksi batas layar untuk memantulkan partikel
    if (p.x < 0 || p.x > window.innerWidth) p.speedX *= -1;
    if (p.y < 0 || p.y > window.innerHeight) p.speedY *= -1;
  });

  requestAnimationFrame(updateParticles);
}

// Tambahkan event listener untuk klik
window.addEventListener("click", (event) => {
  // Sesuaikan rentang kecepatan rotasi untuk rotasi lambat
  const rotationSpeedRange = { min: 0, max: 5 }; // Rotasi lebih lambat, nilai min dan max kecil
  createParticle(event.clientX, event.clientY, rotationSpeedRange); // Tambah partikel di lokasi klik dengan rentang rotasi lambat
  updateCounterChip();
});

function deleteParticles() {
  if (particles.length > 0) {
    // Pastikan ada partikel yang akan dihapus
    const index = Math.floor(Math.random() * particles.length); // Pilih index acak
    particles[index].element.remove(); // Hapus elemen dari DOM
    particles.splice(index, 1); // Hapus dari array particles
  }
}

function updateCounterChip() {
  const counterChip = document.getElementById("counterChip");
  counterChip.innerHTML = `Chip: ${particles.length}`;
}

// setInterval(deleteParticles, 1000); // Hapus partikel setiap 1 detik

// Mulai animasi
updateCounterChip();
updateParticles();