const { Server } = require("socket.io");

function socketConnection(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  console.log("⚡ Socket.IO ulandi");

  let users = [];
  let food = generateFood(); // 🍎 birinchi ovqat joyi

  // 🔹 Ovqatni random joyda yaratish funksiyasi
  function generateFood() {
    return {
      x: Math.floor(Math.random() * 900),
      y: Math.floor(Math.random() * 600),
    };
  }

  io.on("connection", (socket) => {
    console.log("🟢 Yangi foydalanuvchi:", socket.id);

    socket.on("join", (user) => {
      const checkUser = users.find((u) => u.name === user.name);
      if (!checkUser) {
        users.push({ ...user, id: socket.id, size: 48 }); // 🎯 boshlang‘ich o‘lcham
      }
      io.emit("updateState", { users, food });
    });

    socket.on("move", (data) => {
      // 🔹 Harakatni yangilash
      users = users.map((u) =>
        u.name === data.name ? { ...u, x: data.x, y: data.y } : u
      );

      // 🔹 To‘qnashuvni tekshirish (shar ovqatga tegdimi?)
      const player = users.find((u) => u.name === data.name);
      if (player && checkCollision(player, food)) {
        console.log(`🍎 ${player.name} ovqatni yedi!`);
        player.size += 6; // kattalashadi
        player.score = (player.score || 0) + 1;
        food = generateFood(); // yangi ovqat
      }

      io.emit("updateState", { users, food });
    });

    socket.on("disconnect", () => {
      users = users.filter((u) => u.id !== socket.id);
      io.emit("updateState", { users, food });
    });
  });

  // 🔹 To‘qnashuvni aniqlash
  function checkCollision(player, food) {
    const dx = player.x - food.x;
    const dy = player.y - food.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < player.size / 2 + 10; // radius + food radius
  }
}

module.exports = socketConnection;
