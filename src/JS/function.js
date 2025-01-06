export function drawImage(
  ctx,
  image,
  x,
  y,
  transparaency = 1,
  width = image.width,
  height = image.height
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
  fillStyle: "white",
  textAlign: "center",
  textBaseline: "middle",
};

export function drawText(ctx, text, x, y) {
  ctx.font = textConfig.font;
  ctx.fillStyle = textConfig.fillStyle;
  ctx.textAlign = textConfig.textAlign;
  ctx.textBaseline = textConfig.textBaseline;
  ctx.fillText(text, x, y);
}

export function isInside(pos, rect) {
  return (
    pos.x > rect.x &&
    pos.x < rect.x + rect.width &&
    pos.y < rect.y + rect.height &&
    pos.y > rect.y
  );
}

function randomRotation(min, max) {
  const randomRotationDirection = Math.random() > 0.5 ? 1 : -1;
  const randomRotationSpeed =
    randomRotationDirection * (Math.random() * (max - min) + min);
  return randomRotationSpeed;
}

// Fungsi untuk mendapatkan posisi klik relatif terhadap canvas
export function getMousePos(canvas, event) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

// CLASS IMAGE -------------------------------------
export class Images {
  constructor(src, canvasId = "canvas") {
    this.src = src;
    this.imageElement = null;
    this.drawn = false;
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas?.getContext("2d");
    this.x = 0;
    this.y = 0;
    this.width = this.imageElement?.width || 0;
    this.height = this.imageElement?.height || 0;
  }

  // Memuat gambar secara asinkron
  loadImage() {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = this.src;
      img.onload = () => {
        this.imageElement = img;
        this.width = img.width; // Menyimpan lebar gambar
        this.height = img.height; // Menyimpan tinggi gambar
        resolve(this); // Resolve dengan instance objek ini
      };
      img.onerror = (err) => reject(new Error(`Gagal memuat gambar: ${err}`));
    });
  }

  clicked(pos) {
    return (
      pos.x > this.x &&
      pos.x < this.x + this.width &&
      pos.y < this.y + this.height &&
      pos.y > this.y
    );
  }

  // Fungsi statis untuk rotasi acak

  // gambar image di canvas
  draw(
    x = this.x,
    y = this.y,
    width = this.width,
    height = this.height,
    transparency = 1
  ) {
    if (!this.ctx) {
      console.error("Konteks kanvas tidak ditemukan. Periksa ID kanvas.");
      return;
    }

    if (!this.imageElement) {
      console.error(
        "Gambar belum dimuat. Panggil loadImage() terlebih dahulu."
      );
      return;
    }

    this.ctx.save();
    this.ctx.globalAlpha = transparency;
    this.ctx.drawImage(this.imageElement, x, y, width, height);
    this.ctx.restore();
    this.drawn = true;
  }
}

export class Nijika extends Images {
  constructor(src) {
    super(src);
    // Setting untuk Target click untuk mentirggerd ahoge
    this.targetX = 185; // Posisi x ahoge dalam gambar asli
    this.targetY = 115; // Posisi y ahoge dalam gambar asli
    this.targetWidth = 30; // Lebar area ahoge
    this.targetHeight = 40; // Tinggi area ahoge
  }

  clicked(pos) {
    if (!this.drawn) {
      return false;
    } // Jika gambar belum digambar, keluar
    const imgX = 0;
    const imgY = this.canvas.height - this.height;
    const targetCanvasX = imgX + (this.targetX / this.width) * this.width;
    const targetCanvasY = imgY + (this.targetY / this.height) * this.height;
    const targetCanvasWidth = (this.targetWidth / this.width) * this.width;
    const targetCanvasHeight = (this.targetHeight / this.height) * this.height;
    if (
      pos.x > targetCanvasX &&
      pos.x < targetCanvasX + targetCanvasWidth &&
      pos.y > targetCanvasY &&
      pos.y < targetCanvasY + targetCanvasHeight
    )
      return true;
    return false;
  }
}

export class Ahoge extends Images {
  constructor(src) {
    super(src); // Panggil konstruktor kelas induk
    this.item = []; // Array untuk menyimpan semua ahoge
    this.baseForce = 40; // Mengatur Gaya tarik magnet
    this.damping = 0.98; // mengatur peredaman saat mendekati mangnet
    this.maxDistance = 400; // Jarak maksimum untuk gaya tarik
    this.toRemove = []; // Array untuk menyimpan ahoge yang akan dihapus
  }

  draw(
    x,
    y ,
    rotation,
    width = this.width,
    height = this.height,
    transparency = 1
  ) {
    if (!this.ctx) {
      console.error("Konteks kanvas tidak ditemukan. Periksa ID kanvas.");
      return;
    }

    if (!this.imageElement) {
      console.error(
        "Gambar belum dimuat. Panggil loadImage() terlebih dahulu."
      );
      return;
    }

    this.ctx.save(); // Simpan keadaan kanvas
    this.ctx.translate(x, y); // Pindahkan titik tengah ke posisi ahoge
    this.ctx.rotate((rotation * Math.PI) / 180); // Rotasi dalam radian
    this.ctx.drawImage(this.imageElement, -15, -15, width, height); // Gambar ahoge
    this.ctx.restore(); // Kembalikan keadaan kanvas
  }

  build(pos) {
    this.item.push({
      x: pos.x,
      y: pos.y,
  
      // Kecepatan ahoge secara acak
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
  
      // Ukuran ahoge secara acak
      imgSize: 40, // Lebar acak antara 40 dan 80
      size: 10, // Placeholder, akan dihitung di langkah berikutnya
  
      angle: 0,
      angularSpeed: (Math.random() - 0.5) * 0.05, // Kecepatan rotasi awal
      rotation: 0, // Rotasi ahoge
      rotationSpeed: randomRotation(0, 5), // Kecepatan rotasi yang lebih lambat
      radius: Math.random() * 50 + 50, // Jarak untuk rotasi
      rotationSlowdown: Math.random() * 0.0005 + 0.0001, // Perlambatan rotasi
    });
  }
  

  handleCollisions() {
    for (let i = 0; i < this.item.length; i++) {
      for (let j = i + 1; j < this.item.length; j++) {
        const item1 = this.item[i];
        const item2 = this.item[j];

        const dx = item2.x - item1.x;
        const dy = item2.y - item1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Jika item bertabrakan
        if (distance < item1.size + item2.size) {
          // Pantulkan item
          const angle = Math.atan2(dy, dx);
          const sin = Math.sin(angle);
          const cos = Math.cos(angle);

          // Pisahkan item sedikit
          const overlap = (item1.size + item2.size - distance) / 2;
          item1.x -= overlap * cos;
          item1.y -= overlap * sin;
          item2.x += overlap * cos;
          item2.y += overlap * sin;

          // Tukar kecepatan
          const tempVx = item1.vx;
          const tempVy = item1.vy;
          item1.vx = item2.vx * this.damping;
          item1.vy = item2.vy * this.damping;
          item2.vx = tempVx * this.damping;
          item2.vy = tempVy * this.damping;
        }
      }
    }
  }
}

export class Magnet extends Images {
  constructor(src) {
    super(src);
    this.x = null;
    this.y = null;
    this.status = false;
  }
  draw(
    x = this.x,
    y = this.y,
    width = this.width,
    height = this.height,
    transparency = 1
  ) {
    if (!this.ctx) {
      console.error("Konteks kanvas tidak ditemukan. Periksa ID kanvas.");
      return;
    }

    if (!this.imageElement) {
        "Gambar belum dimuat. Panggil loadImage() terlebih dahulu.";
      return;
    }

    const centerX = x - width / 2; // Pusat gambar di x
    const centerY = y - height / 2; // Pusat gambar di y


    this.ctx.save();
    this.ctx.globalAlpha = transparency;
    this.ctx.drawImage(this.imageElement, centerX, centerY, width, height);
    this.ctx.restore();
    this.drawn = true;
  }
}

export class Doritos extends Images {
  constructor() {
    super("assets/doritos.png"); // Panggil konstruktor kelas induk
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
