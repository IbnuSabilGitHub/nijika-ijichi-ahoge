import {
  drawText,
  Images,
  Nijika,
  getMousePos,
  Ahoge,
  Magnet,
} from "./function.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth; // Lebar kanvas mengikuti lebar layar
canvas.height = window.innerHeight; // leabr kanvas mengikuti tinggi layar

const logo = new Images("/public/assets/image/Kessoku_Band_Logo.svg"); // I,ahe Logo
const nijikaImage1 = new Nijika("/public/assets/image/nijika-0.png");
const nijikaImage2 = new Nijika("/public/assets/image/nijika-1.png");
const ahoge = new Ahoge("/public/assets/image/ahoge.webp");
const magnet = new Magnet("/public/assets/image/eww_people.png");

Promise.all([
  logo.loadImage(),
  nijikaImage1.loadImage(),
  nijikaImage2.loadImage(),
  ahoge.loadImage(),
  magnet.loadImage(),
])
  .then(() => {
    let currentNijika = nijikaImage1;

    function frameCanvas(timestamp) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawText(ctx, "Developed by IBNU with ❤️", 115, 18);
      // drawText(`Ahoge : ${ahoge.length}`,115, 18);
      // drawText( `Doritos : ${doritos.fill}`, 50, 80);

      currentNijika.draw(0, canvas.height - currentNijika.height); // Gambar nijika
      if (magnet.status) {
        magnet.draw();
      }
      // ahoge.ahogeItems.forEach((item, i) => {
      //   let dx = mangnet.x - item.x;
      //   let dy = mangnet.y - item.y;
      // });

      // Draw logo
      logo.draw(
        (canvas.width - logo.width) / 2,
        (canvas.height - logo.height) / 4,
        logo.width,
        logo.height,
        0.3
      ); // Gambar kedua di posisi (120, 0
      requestAnimationFrame(frameCanvas); // Ulangi animasi
    }

    canvas.addEventListener("click", (e) => {
      const pos = getMousePos(canvas, e);
      // Jika gambar ditekan, ganti gambar setelah 100msg
      if (currentNijika.clicked(pos)) {
        currentNijika = nijikaImage2;
        ahoge.build(pos)
        setTimeout(() => {
          currentNijika = nijikaImage1;
        }, 100);
      }
    });
    frameCanvas();
  })
  .catch((error) => {
    console.error("Error loading images:", error);
  });

let intervalId; // Menyimpan ID interval

function startMagnetInterval() {
  if (!intervalId) {
    intervalId = setInterval(() => {
      if (magnet.status) {
        deactivateMagnet();
      } else {
        activateMagnet();
      }
    }, 10000);
  }
}

function stopMagnetInterval() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function activateMagnet() {
  magnet.x = Math.random() * canvas.width * 0.9;
  magnet.y = Math.random() * canvas.height * 0.9;
  magnet.status = true;
}

function deactivateMagnet() {
  magnet.x = null;
  magnet.y = null;
  magnet.status = false;
}

// Kondisi untuk memulai atau menghentikan interval
if (ahoge.item.length !== 0) {
  startMagnetInterval();
} else {
  stopMagnetInterval();
}
