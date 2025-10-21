import { useEffect, useState } from "react";
import socket from "./socket";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [food, setFood] = useState({ x: 300, y: 200 });
  const [me, setMe] = useState({
    name: "Azim",
    x: 400,
    y: 300,
    score: 0,
    avatar: "https://images.iptv.rt.ru/images/ct926o3ir4sqiatd9cs0.jpg",
  });

  useEffect(() => {
    socket.emit("join", me);
  }, []);

  // 🔹 Klaviatura bilan harakat
  useEffect(() => {
    const handleKeyDown = (e) => {
      const step = 15;
      let { x, y } = me;

      if (e.key.toLowerCase() === "w") y -= step;
      if (e.key.toLowerCase() === "s") y += step;
      if (e.key.toLowerCase() === "a") x -= step;
      if (e.key.toLowerCase() === "d") x += step;

      const updated = { ...me, x, y };
      setMe(updated);
      socket.emit("move", updated);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [me]);

  // 🔹 Serverdan umumiy o‘yinni yangilash
  useEffect(() => {
    socket.on("updateState", (data) => {
      setUsers(data.users);
      setFood(data.food);
    });
  }, []);

  return (
    <div className="w-screen h-screen bg-green-100 relative overflow-hidden">
      {/* 🍎 Ovqat */}
      <div
        className="absolute bg-orange-500 rounded-full"
        style={{
          top: food.y,
          left: food.x,
          width: 20,
          height: 20,
        }}
      ></div>

      {/* 👤 Foydalanuvchilar */}
      {users.map((user, i) => (
        <div
          key={i}
          className="absolute flex flex-col items-center justify-center text-white font-semibold"
          style={{
            top: user.y,
            left: user.x,
          }}
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="rounded-full border-2 border-white shadow-md"
            style={{
              width: user.size || 48,
              height: user.size || 48,
            }}
          />
          <span className="text-sm mt-1 text-black font-bold">{user.name}</span>
        </div>
      ))}

      {/* 🔢 Ball */}
      <div className="absolute top-3 left-3 bg-white shadow-lg rounded-lg px-4 py-2 font-bold">
        🧍 {me.name} — 🏆 {users.find((u) => u.name === me.name)?.score || 0}
      </div>
    </div>
  );
}

export default App;
