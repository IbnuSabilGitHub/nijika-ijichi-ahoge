import { drawText, Images, Nijika, getMousePos } from "./function.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth; // Lebar kanvas mengikuti lebar layar
canvas.height = window.innerHeight; // leabr kanvas mengikuti tinggi layar

const logo = new Images("/public/assets/image/Kessoku_Band_Logo.svg"); // I,ahe Logo
const nijikaImage1 = new Nijika("/public/assets/image/nijika-0.png");
const nijikaImage2 = new Nijika("/public/assets/image/nijika-1.png");

Promise.all([
  logo.loadImage(),
  nijikaImage1.loadImage(),
  nijikaImage2.loadImage(),
])
  .then(() => {
    let currentNijika = nijikaImage1;
   
    function frameCanvas(timestamp) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawText(ctx, "Developed by IBNU with ❤️", 115, 18);
      // drawText(`Ahoge : ${ahoge.length}`,115, 18);
      // drawText( `Doritos : ${doritos.fill}`, 50, 80);

      currentNijika.draw(0, canvas.height - currentNijika.height); // Gambar nijika

  
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
      // Jika gambar ditekan, ganti gambar setelah 100ms
      if (currentNijika.clicked(pos)) {
        currentNijika = nijikaImage2;
        setTimeout(() => {
          currentNijika = nijikaImage1;
        },100);
      }
    });
    frameCanvas();
  })
  .catch((error) => {
    console.error("Error loading images:", error);
  });
