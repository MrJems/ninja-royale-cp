// network.js

import { io } from "socket.io-client";
export function initNetwork(gameState, onInit) {
  const socket = io("http://localhost:3000");

  socket.on("room_full", () => {
    alert("Room is full. Try again later!");
  });

  socket.on("init", (data) => {
    const { playerId, players, bullets } = data;
    gameState.players = players;
    gameState.bullets = bullets;
    onInit(playerId);
  });

  socket.on("player_joined", (data) => {
    const { playerId, x, y, dir } = data;
    gameState.players[playerId] = { x, y, dir, isMoving: false, frame: 0 };
  });

  socket.on("player_left", (data) => {
    const { playerId } = data;
    delete gameState.players[playerId];
  });

  socket.on("state_update", (data) => {
    gameState.players = data.players;
    gameState.bullets = data.bullets;
  });

  const keys = {
    up: false,
    down: false,
    left: false,
    right: false,
    shoot: false,
  };

  window.addEventListener("keydown", (e) => {
    switch (e.code) {
      case "ArrowUp":
        keys.up = true;
        sendInput();
        break;
      case "ArrowDown":
        keys.down = true;
        sendInput();
        break;
      case "ArrowLeft":
        keys.left = true;
        sendInput();
        break;
      case "ArrowRight":
        keys.right = true;
        sendInput();
        break;
      case "Space":
        keys.shoot = true;
        sendInput();
        break;
    }
  });

  window.addEventListener("keyup", (e) => {
    switch (e.code) {
      case "ArrowUp":
        keys.up = false;
        sendInput();
        break;
      case "ArrowDown":
        keys.down = false;
        sendInput();
        break;
      case "ArrowLeft":
        keys.left = false;
        sendInput();
        break;
      case "ArrowRight":
        keys.right = false;
        sendInput();
        break;
      case "Space":
        keys.shoot = false;
        sendInput();
        break;
    }
  });

  function sendInput() {
    socket.emit("player_input", {
      up: keys.up,
      down: keys.down,
      left: keys.left,
      right: keys.right,
      shoot: keys.shoot,
    });
  }
}
