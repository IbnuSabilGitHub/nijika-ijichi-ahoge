import {
  drawText,
  Images,
  Nijika,
  Ahoge,
  Magnet,
  Doritos,
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


const MAGNET_SIZE = 150;

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

      // Draw text
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
        magnet.draw(magnet.x, magnet.y, MAGNET_SIZE, MAGNET_SIZE);
        magnet.removeAhogeWithDelay(ahoge, timestamp);
      }

      // hanya saat ada 2 ahoge, tangani tabrakan(menggunakan Optinoal Chaining)
      ahoge.handleCollisions();

      ahoge.item.forEach((item, i) => {
        // update posisi dan rotasi ahoge
        ahoge.updatePosition(item);

        // update rotasi ahoge
        ahoge.updateRotation(item);

        // buat ahoge tetap dalam kanvas
        ahoge.keepWithinCanvas(item);

        // Terapkan efek magnet jika magnet aktif
        ahoge.magnetEffect(magnet.status, magnet.x, magnet.y, item, i);

        // Gambar ahoge
        ahoge.draw(item.x, item.y, item.rotation, item.imgSize, item.imgSize);

        // Terapkan efek doritos saat di drag dan belum full
        doritos.fillDoritos(ahoge.item, item, i);
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
    ctx.fillText("Failed to load resources. Please try again later.", 50, 50);
  });
