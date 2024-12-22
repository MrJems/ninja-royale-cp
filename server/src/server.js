// server.js
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // or "*"
    methods: ["GET", "POST"],
  },
});

// Serve the 'public' folder for our frontend
app.use(express.static("public"));

// Game state in memory
const gameState = {
  players: {}, // playerId -> { x, y, dir, ... }
  bullets: [],
};

// Constants
const MAX_PLAYERS = 5;
const MOVE_SPEED = 2; // Adjust to your liking
const BULLET_SPEED = 5;

// Called when new client connects
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // If room is full, disconnect immediately
  if (Object.keys(gameState.players).length >= MAX_PLAYERS) {
    socket.emit("room_full");
    socket.disconnect(true);
    return;
  }

  // Initialize player state
  gameState.players[socket.id] = {
    x: 100, // spawn pos
    y: 100,
    dir: 0, // direction in degrees or radians
    frame: 0,
    isMoving: false,
  };

  // Send initial state to newly connected player
  socket.emit("init", {
    playerId: socket.id,
    players: gameState.players,
    bullets: gameState.bullets,
  });

  // Broadcast new player to all existing players
  socket.broadcast.emit("player_joined", {
    playerId: socket.id,
    x: 100,
    y: 100,
    dir: 0,
  });

  // Listen for player input
  socket.on("player_input", (input) => {
    handlePlayerInput(socket.id, input);
  });

  // Listen for disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    delete gameState.players[socket.id];
    io.emit("player_left", { playerId: socket.id });
  });
});

// Process player input to update position, direction, spawn bullets
function handlePlayerInput(playerId, input) {
  const player = gameState.players[playerId];
  if (!player) return;

  // Input might look like: { up: true, down: false, left: false, right: true, shoot: true }
  // Or: { moveX: 1, moveY: 0, shoot: false } or any format you want
  const { up, down, left, right, shoot } = input;

  // Update direction
  if (left) {
    player.dir -= 5; // rotate left 5 deg
  }
  if (right) {
    player.dir += 5; // rotate right 5 deg
  }

  // Convert deg -> rad
  const dirRad = (player.dir * Math.PI) / 180;

  // Move
  if (up) {
    player.x += MOVE_SPEED * Math.cos(dirRad);
    player.y += MOVE_SPEED * Math.sin(dirRad);
    player.isMoving = true;
  } else if (down) {
    player.x -= MOVE_SPEED * Math.cos(dirRad);
    player.y -= MOVE_SPEED * Math.sin(dirRad);
    player.isMoving = true;
  } else {
    player.isMoving = false;
  }

  // Shoot bullet
  if (shoot) {
    spawnBullet(player.x, player.y, dirRad, playerId);
  }
}

function spawnBullet(x, y, dirRad, ownerId) {
  gameState.bullets.push({
    x,
    y,
    dir: dirRad,
    ownerId,
  });
}

// Game loop (runs on the server)
setInterval(() => {
  // Update bullets
  gameState.bullets.forEach((bullet) => {
    bullet.x += BULLET_SPEED * Math.cos(bullet.dir);
    bullet.y += BULLET_SPEED * Math.sin(bullet.dir);
    // TODO: handle bullet collisions, out-of-bounds, etc.
  });

  // Possibly remove bullets that are off-screen or have collided
  // For now, let's just keep them

  // Broadcast updated state to all players
  io.emit("state_update", {
    players: gameState.players,
    bullets: gameState.bullets,
  });
}, 1000 / 30); // 30 ticks per second

server.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
