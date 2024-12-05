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

export function isInside(pos, rect) {
  return pos.x > rect.x && pos.x < rect.x + rect.width && pos.y < rect.y + rect.height && pos.y > rect.y
}

export function getMousePos(canvas, event) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}


class Image {
  constructor(src) {
    this.src = src;
    this.imageElement = null;
    this.ctx = document.createElement('canvas').getContext('2d');
    this.properties();
  }

  loadImage() {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img'); // Elemen gambar HTML
      img.src = this.src;
      img.onload = () => {
        this.imageElement = img; // Simpan elemen gambar
        this.canvas.width = img.width; // Atur ukuran kanvas
        this.canvas.height = img.height;
        resolve(img);
      };
      img.onerror = reject;
    });
  }

  static randomRotation(min, max) {
    // Pilih arah rotasi -180 atau 180 derajat
    const randomRotationDirection = Math.random() > 0.5 ? 1 : -1;
    // Tentukan kecepatan rotasi berdasarkan rentang (rotasi lambat)
    const randomRotationSpeed =
      randomRotationDirection * (Math.random() * (min - max) + max);
    return randomRotationSpeed;
  }
  

  drawImage(x, y, width = 100, height = 100, transparency = 1) {
    if (!this.imageElement) {
      console.error("Gambar belum dimuat. Panggil loadImage() terlebih dahulu.");
      return;
    }
    this.ctx.save();
    this.ctx.globalAlpha = transparency;
    this.ctx.drawImage(this.imageElement, x, y, width, height);
    this.ctx.restore();
  }
  

  properties() {
    if (!this.imageElement) {
      return { error: "Gambar belum dimuat." };
    }
    return {
      x: 0,
      y: 0,
      width: this.imageElement.width,
      height: this.imageElement.height,
      transparency: 1,
    };
  }
}


class Doritos extends Image{
  constructor() {
    super('assets/doritos.png'); // Panggil konstruktor kelas induk
    this._fill = 0; // Inisialisasi nilai awal fill
    this.properties(); // Panggil metode untuk mengatur properti awal
  }

  get fill() {
    return this._fill;
  }

  set fill(value) {
    this._fill = Math.min(value, 40); // Nilai maksimal fill adalah 80
  }

  properties() {
    this.x = Math.random() * canvas.width * 0.9;
    this.y = 0;
    this.vy = 0.2;
    this.vx = 0;
    this.gravity = 0.03;
    this.bounce = 0.8;
    this.spin = randomRotation(0, 2); // Pastikan fungsi ini dideklarasikan
    this.friction = 0.99;
    this.rotation = 0;
    this.fill = 0; // Nilai awal fill
    this.width = 80;
    this.height = 80;
    this.isOnGround = false;
    this.isDragging = false;
    this.spawn = false;
    this.full = false; // Hitung ulang nanti saat update
    this.offsetX = 0;
    this.offsetY = 0;
  }

  updateWidth() {
    // Perbesar ukuran doritos setiap 10 poin saat kelipatan 10 dari fill
    if (this.fill % 10 === 0 && !this.full) {
      this.width += 10;
      this.height += 10;
    }
  }

  update() {
    this.fill += 1; // Tambahkan nilai fill
    this.full = this.fill >= 40; // Periksa apakah sudah penuh
    this.updateWidth(); // Perbarui ukuran berdasarkan fill
  }
}