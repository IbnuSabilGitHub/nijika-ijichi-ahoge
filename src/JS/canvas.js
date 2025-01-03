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

// setup animation ahoge
ahoge.width = 20;
ahoge.height = 20;

Promise.all([
  logo.loadImage(),
  nijikaImage1.loadImage(),
  nijikaImage2.loadImage(),
  ahoge.loadImage(),
  magnet.loadImage(),
])
  .then(() => {
    let currentNijika = nijikaImage1;
    console.log(ahoge.item.le);
    function frameCanvas(timestamp) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawText(ctx, "Developed by IBNU with ❤️", 115, 18);
      // drawText(`Ahoge : ${ahoge.length}`,115, 18);
      // drawText( `Doritos : ${doritos.fill}`, 50, 80);
      // Gambar nijika
      currentNijika.draw(0, canvas.height - currentNijika.height);

      magnet.status && magnet.draw();
      // hanya saat ada ahoge, tangani tabrakan(menggunakan Optinoal Chaining)
      // ahoge.item?.length && ahoge.handleCollisions();
      ahoge.handleCollisions()

      ahoge.item.forEach((item, i) => {
        if (magnet.status) {
          // hitung gaya yang bekerja pada ahoge ()
          // Hitung jarak antara magnet dan ahoge
          let dx = magnet.x - item.x;
          let dy = magnet.y - item.y;
          // Gunakan rumus euclidean distance untuk menghitung jarak antara magnet dan ahoge
          let distance = Math.sqrt(50, Math.sqrt(dx * dx + dy * dy));
          let force = Math.min(ahoge.baseForce / distance, 0.1);
          let forceDx = (dx / distance) * force;
          let forceDy = (dy / distance) * force;
          // let speedMultiplier = Math.max(0.1, 1 - distance / maxDistance); // Mengurangi kecepatan berdasarkan jarak
          // terapkan gaya pada ahoge
          item.vx += forceDx;
          item.vy += forceDy;
          item.vx *= ahoge.damping;
          item.vy *= ahoge.damping;

          // // tandai ahoge ke berapa yang akan dihapus jika melewati batas jarak
          // if (distance <= 50 && !ahoge.toRemove.includes(i)) {
          //   ahoge.toRemove.push(i);
          //   // console.log("ahoge ke", i, "akan dihapus");
          //   // console.log(ahoge.toRemove.length);
          // }
        }

        // Perbarui posisi ahoge
        item.x += item.vx;
        item.y += item.vy;

        // Perbarui rotasi ahoge
        item.angle += item.angularSpeed || 0;
        item.x += Math.cos(item.angle) * item.radius * 0.01;
        item.y += Math.sin(item.angle) * item.radius * 0.01;

        // Update rotasi berputar dan melambat secara bertahap
        item.rotation += item.rotationSpeed;
        item.rotationSpeed *= 1 - item.rotationSlowdown;

        // Batasi ahoge agar tidak keluar dari layar
        if (item.x < 0 || item.x + ahoge.width > canvas.width) {
          item.vx *= -1;
        }
        if (item.y < 0 || item.y + ahoge.height > canvas.height) {
          item.vy *= -1;
        }

        // Gambar ahoge
        ahoge.draw(item.x, item.y, item.rotation, item.imgSize, item.imgSize);
      });

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
      ahoge.build(pos);
      if (currentNijika.clicked(pos)) {
        currentNijika = nijikaImage2;
        ahoge.build(pos);
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

// function startMagnetInterval() {
//   if (!intervalId) {
//     intervalId = setInterval(() => {
//       if (magnet.status) {
//         deactivateMagnet();
//       } else {
//         activateMagnet();
//       }
//     }, 10000);
//   }
// }

// function stopMagnetInterval() {
//   if (intervalId) {
//     clearInterval(intervalId);
//     intervalId = null;
//   }
// }

// function activateMagnet() {
//   magnet.x = Math.random() * canvas.width * 0.9;
//   magnet.y = Math.random() * canvas.height * 0.9;
//   magnet.status = true;
// }

// function deactivateMagnet() {
//   magnet.x = null;
//   magnet.y = null;
//   magnet.status = false;
// }

// // Mulai interval magnet jika ada 10 ahoge
// if (ahoge.item.length >= 10) {
//   startMagnetInterval();
// } else {
//   stopMagnetInterval();
// }
