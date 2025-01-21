import {
  drawText,
  Images,
  Nijika,
  getMousePos,
  Ahoge,
  Magnet,
  Doritos,
  randomRotation,
} from "./function.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth; // Lebar kanvas mengikuti lebar layar
canvas.height = window.innerHeight; // leabr kanvas mengikuti tinggi layar

const logo = new Images("/public/assets/image/Kessoku_Band_Logo.svg");
const nijikaImage1 = new Nijika("/public/assets/image/nijika-0.png");
const nijikaImage2 = new Nijika("/public/assets/image/nijika-1.png");
const ahoge = new Ahoge("/public/assets/image/ahoge.webp");
const magnet = new Magnet("/public/assets/image/eww_people.png");
const doritos = new Doritos("/public/assets/image/doritos.webp");

// setup animation ahoge
ahoge.width = 20;
ahoge.height = 20;

Promise.all([
  logo.loadImage(),
  nijikaImage1.loadImage(),
  nijikaImage2.loadImage(),
  ahoge.loadImage(),
  magnet.loadImage(),
  doritos.loadImage(),
])
  .then(() => {
    let currentNijika = nijikaImage1;
    function frameCanvas(timestamp) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawText(ctx, "Developed by IBNU with ❤️", 115, 18);
      drawText(ctx, `Ahoge : ${ahoge.item.length}`, 50, 50);
      drawText(ctx, `Doritos : ${doritos.fill}`, 50, 80);
      // Gambar nijika
      currentNijika.draw(0, canvas.height - currentNijika.height);

      // Draw logo
      logo.draw(
        (canvas.width - logo.width) / 2,
        (canvas.height - logo.height) / 4,
        logo.width,
        logo.height,
        0.3
      );

      // Mulai interval magnet jika ada 10 ahoge
      if (ahoge.item.length > 10) {
        magnet.startMagnetInterval(ahoge);
      } else {
        magnet.stopMagnetInterval(ahoge);
      }
      if (magnet.status) {
        magnet.draw(magnet.x, magnet.y, 150, 150);
        magnet.removeAhogeWithDelay(ahoge, timestamp);
      }

      // hanya saat ada ahoge, tangani tabrakan(menggunakan Optinoal Chaining)
      ahoge.item?.length && ahoge.handleCollisions();

      ahoge.item.forEach((item, i) => {
        if (magnet.status) {
          // hitung gaya yang bekerja pada ahoge ()
          // Hitung jarak antara magnet dan ahoge
          let dx = magnet.x - item.x;
          let dy = magnet.y - item.y;
          // Gunakan rumus euclidean distance untuk menghitung jarak antara magnet dan ahoge
          let distance = Math.max(50, Math.sqrt(dx * dx + dy * dy));
          let force = Math.min(ahoge.baseForce / distance, 0.1);
          let forceDx = (dx / distance) * force;
          let forceDy = (dy / distance) * force;
          // let speedMultiplier = Math.max(0.1, 1 - distance / maxDistance); // Mengurangi kecepatan berdasarkan jarak
          // terapkan gaya pada ahoge
          item.vx += forceDx;
          item.vy += forceDy;
          item.vx *= ahoge.damping;
          item.vy *= ahoge.damping;

          // tandai ahoge ke berapa yang akan dihapus jika melewati batas jarak
          if (distance <= 50 && !ahoge.toRemove.includes(i)) {
            ahoge.toRemove.push(i);
          }
        }

        doritos.fillDoritos(ahoge.item, item, i);
        
        ahoge.updatePosition(item);
        ahoge.updateRotation(item);
        ahoge.keepWithinCanvas(item);
        // Gambar ahoge
        ahoge.draw(item.x, item.y, item.rotation, item.imgSize, item.imgSize);
      });

      doritos.draw(doritos.x, doritos.y, doritos.rotation);

      doritos.applyGravityAndRotation();

      doritos.handleTouchGround();

      doritos.handleAfterTouchGround();

      requestAnimationFrame(frameCanvas); // Ulangi animasi
    }

    canvas.addEventListener("click", (e) => {
      currentNijika.clicked(
        e,
        ahoge,
        nijikaImage1,
        nijikaImage2,
        (switchObject) => {
          currentNijika = switchObject; // Tetapkan gambar baru ke currentNijika
        }
      );
    });

    canvas.addEventListener("mousedown", doritos.clicked.bind(doritos));
    canvas.addEventListener("mousemove", doritos.dragging.bind(doritos));
    canvas.addEventListener("mouseleave", doritos.stopDragging.bind(doritos));
    canvas.addEventListener("mouseup", doritos.stopDragging.bind(doritos));
    frameCanvas();
  })
  .catch((error) => {
    console.error("Error loading images:", error);
  });
