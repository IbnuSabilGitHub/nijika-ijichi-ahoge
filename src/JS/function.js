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

export function randomRotation(min, max) {
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
  /**
   * @param {string} src - URL gambar.
   * @param {string} canvasId - ID elemen kanvas. Default adalah "canvas".
   */
  constructor(src, canvasId = "canvas") {
    this.src = src; // Sumber gambar
    this.imageElement = null; // Elemen gambar HTML
    this.drawn = false; // Status apakah gambar telah digambar di kanvas
    this.canvas = document.getElementById(canvasId); // Elemen kanvas
    if (!canvas) {
      throw new Error(`Canvas with ID "${canvasId}" not found.`);
    }
    this.ctx = this.canvas?.getContext("2d"); // Context 2D
    this.x = 0; // Posisi X
    this.y = 0; // Posisi Y
    this._width = null; // Lebar gambar
    this._height = null; // Tinggi gambar
  }

  /**
   * Memuat gambar secara asinkron.
   * @returns {Promise<Images>} Resolusi dengan instance objek ini.
   */
  loadImage() {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = this.src;
      img.onload = () => {
        this.imageElement = img;
        if (this._width === null) {
          this._width = img.width;
        }
        if (this._height === null) {
          this._height = img.height;
        }
        resolve(this); // Resolve dengan objek ini
      };
      img.onerror = (err) => reject(new Error(`Gagal memuat gambar: ${err}`));
    });
  }

  // Getter untuk lebar gambar
  get width() {
    return this._width || 0;
  }

  // Setter untuk lebar gambar
  set width(value) {
    if (value > 0) {
      this._width = value;
    }
  }

  // Getter untuk tinggi gambar
  get height() {
    return this._height || 0;
  }

  // Setter untuk tinggi gambar
  set height(value) {
    if (value > 0) {
      this._height = value;
    }
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
    y,
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
    this.isEat = false;
    this.intervalId; // Menyimpan ID interval
    this.removalInterval = 1000; // Interval waktu penghapusan dalam milidetik
    this.lastRemovalTime = 0; // Waktu penghapusan terakhir
    this.ahoge = new Ahoge("/public/assets/ahoge.png");
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
      ("Gambar belum dimuat. Panggil loadImage() terlebih dahulu.");
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

  removeAhogeWithDelay(ahoge, timestamp) {
    // Validasi bahwa parameter 'ahoge' adalah instance dari kelas Ahoge
    this.validateAhogeInstance(ahoge);

    const timeSinceLastRemoval = timestamp - this.lastRemovalTime;
    const canEat = this.canRemoveAhoge(ahoge);

    if (canEat && timeSinceLastRemoval >= this.removalInterval) {
      this.removeAhoge(ahoge, timestamp); // Proses penghapusan
    } else {
      this.prepareForNextRemoval(timeSinceLastRemoval); // Siapkan status untuk penghapusan berikutnya
    }
  }

  // Validasi apakah parameter adalah instance dari kelas Ahoge
  validateAhogeInstance(ahoge) {
    if (!(ahoge instanceof Ahoge)) {
      throw new Error(
        "Parameter 'ahoge' harus merupakan instance dari kelas Ahoge."
      );
    }
  }

  // Periksa apakah kondisi untuk menghapus Ahoge terpenuhi
  canRemoveAhoge(ahoge) {
    return this.isEat && ahoge.item.length >= 10 && ahoge.toRemove.length > 0;
  }

  // Proses penghapusan Ahoge
  removeAhoge(ahoge, timestamp) {
    const index = ahoge.toRemove.shift(); // Ambil item pertama dari antrian
    ahoge.item.splice(index, 1); // Hapus item dari array
    this.lastRemovalTime = timestamp; // Perbarui waktu penghapusan terakhir
    this.isEat = false; // Matikan status magnet
  }

  // Siapkan status untuk penghapusan berikutnya
  prepareForNextRemoval(timeSinceLastRemoval) {
    if (timeSinceLastRemoval >= this.removalInterval) {
      this.isEat = true; // Aktifkan status untuk penghapusan berikutnya
    }
  }

  startMagnetInterval(ahoge) {
    this.validateAhogeInstance(ahoge);
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        if (this.status) {
          this.deactivateMagnet(ahoge);
        } else {
          this.activateMagnet();
        }
      }, 10000);
    }
  }

  stopMagnetInterval(ahoge) {
    this.validateAhogeInstance(ahoge);
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.deactivateMagnet(ahoge);
    }
  }

  activateMagnet() {
    this.x = Math.random() * this.canvas.width * 0.9;
    this.y = Math.random() * this.canvas.height * 0.9;
    this.status = true;
  }

  deactivateMagnet(ahoge) {
    this.x = null;
    this.y = null;
    this.status = false;
    this.isEat = false;

    ahoge.item.forEach((p) => {
      p.vx += (Math.random() - 0.5) * 4;
      p.vy += (Math.random() - 0.5) * 4;
    });

    ahoge.toRemove = [];
  }
}

export class Doritos extends Images {
  constructor(src, canvasId = "canvas") {
    super(src, canvasId); // Panggil konstruktor kelas induk
    this._fill = 0; // Inisialisasi nilai awal fill
    // Default values
    console.log(`Lebar gambar (set di constructor): ${this.width}`);
    this.defaultValues = {
      x: Math.random() * canvas.width * 0.9,
      y: 0,
      vy: 0.2,
      vx: 0,
      gravity: 0.03,
      bounce: 0.8,
      spin: randomRotation(0, 2), // Pastikan fungsi ini dideklarasikan
      friction: 0.99,
      rotation: 0,
      fill: 0,
      width: 80,
      height: 80,
      isOnGround: false,
      isDragging: false,
      spawn: false,
      full: false,
      offsetX: 0,
      offsetY: 0,
    };
    // this.width = this.defaultValues.width;
    // this.height = this.defaultValues.height;

    // Set default values
    Object.assign(this, this.defaultValues);
  }

  draw(
    x,
    y,
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

    this.ctx.save();
    this.ctx.translate(x, y); // Pindahkan titik tengah ke posisi ahoge
    this.ctx.rotate((rotation * Math.PI) / 180); // Rotasi dalam radian
    // Gambar ahoge
    this.ctx.drawImage(
      this.imageElement,
      -width / 2,
      -height / 2,
      width,
      height
    );
    this.ctx.restore();
  }

  get fill() {
    return this._fill;
  }

  set fill(value) {
    this._fill = Math.min(value, 40); // Nilai maksimal fill adalah 80
  }

  update() {
    this.fill += 1;
    this.full = this.fill >= 40; // true jika penuh
    this.updateWidth();
  }
  updateWidth() {
    // Perbesar ukuran doritos setiap 10 poin saat kelipatan 10 dari fill sampai penuh
    if (this.fill % 10 === 0 && !this.full) {
      this.width += 10;
      this.height += 10;
    }
  }

  reset() {
    // Set ulang nilai ke default
    Object.assign(this, this.defaultValues);
  }

  applyGravityAndRotation() {
    this.rotation = (this.rotation + this.spin + 360) % 360; // Perbarui rotasi
    this.vy += this.gravity;
    this.y += this.vy;
  }

  handleTouchGround() {
    this.y = this.canvas.height - this.height / 2; // Atur posisi doritos
    this.vy *= -this.bounce; // Pantulkan doritos
    this.isOnGround = true; // Set status doritos di tanah
    this.spawn = true; // Set status doritos muncul
  }
  handleAfterTouchGround() {
    // Sesuaikan rotasi dengan penyesuaian bertahap
    if (this.rotation >= 0 && this.rotation < 45) {
      // Menyesuaikan dengan penurunan bertahap menuju 0°
      this.rotation -= 2;
      if (this.rotation <= 0) this.rotation = 0;
    } else if (this.rotation >= 45 && this.rotation < 135) {
      // Menyesuaikan dengan penambahan bertahap menuju 90°
      this.rotation += 2;
      if (this.rotation >= 90) this.rotation = 90;
    } else if (this.rotation >= 135 && this.rotation < 225) {
      // Menyesuaikan dengan penambahan bertahap menuju 180°
      this.rotation += 2;
      if (this.rotation >= 180) this.rotation = 180;
    } else if (this.rotation >= 225 && this.rotation < 315) {
      // Menyesuaikan dengan penambahan bertahap menuju 270°
      this.rotation += 2;
      if (this.rotation >= 270) this.rotation = 270;
    } else {
      // Menyesuaikan dengan penurunan bertahap menuju 0°
      this.rotation -= 2;
      if (this.rotation <= 0) this.rotation = 0;
    }
  }

  inside(pos) {
    /**
     * @param {Object} pos - Posisi klik.
     */
    return (
      pos.x >= this.x - this.width / 2 &&
      pos.x <= this.x + this.width / 2 &&
      pos.y >= this.y - this.height / 2 &&
      pos.y <= this.y + this.height / 2
    );
    /**
     * @returns {boolean} - True jika posisi klik berada di dalam doritos.
     */
  }

  clicked(e) {
    const pos = getMousePos(this.canvas, e);
    if (this.clicked(pos)) {
      this.isDragging = true;
      this.offsetX = pos.x - this.x;
      this.offsetY = pos.y - this.y;
    }
  }
  dragging(e) {
    if (this.isDragging) {
      const pos = getMousePos(this.canvas, e);
      this.draggingAnimation(pos);
    }
  }

  draggingAnimation(pos) {
    const distance = pos.x - this.startX;
    // Update posisi gambar
    this.isOnGround = false; // Set status doritos tidak
    this.x = pos.x - this.offsetX;
    this.y = pos.y - this.offsetY;
    this.rotation = distance; // Rotasi berdasarkan jarak
    this.startX = pos.x; // Perbarui posisi awal
  }

  stopDragging() {
    this.isDragging = false;
    this.spin = randomRotation(0, 1);
  }
}
