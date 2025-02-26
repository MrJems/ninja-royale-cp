const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = 3000;

let allPlayers = [];

io.on("connection", (socket) => {
  // players[socket.id] = {
  //   x: 100,
  //   y: 100,
  // };
  socket.on("playerCreated", (data) => {
    allPlayers.push(data);
    socket.emit("currentPlayers", allPlayers);

    // console.log(allPlayers);
  });

  socket.on("playerMove", (data) => {
    // console.log("...............");
    // console.log(allPlayers);
    allPlayers = allPlayers.map((obj) => {
      if (obj.id === data.id) {
        // console.log("...........=====...");
        return {
          ...obj,
          player: data.player,
          world: data.world,
          isAttacking: data.isAttacking,
          sword: data.sword,
          health: data.health,
        };
      }
      return obj;
    });
    // players.push(data);
    // console.log(allPlayers);
    io.emit("currentPlayers", allPlayers);

    // console.log(allPlayers);
  });

  // socket.on("playerAttacked", (data) => {});
  // console.log(allPlayers);

  socket.on("playerFiredStar", (data) => {
    // data = { id, star: { starId, x, y, direction, speed, active } }

    // Find the player in allPlayers, add the new star to his "stars" array
    allPlayers = allPlayers.map((player) => {
      if (player.id === data.id) {
        if (!player.stars) player.stars = [];
        player.stars.push(data.star);
      }
      return player;
    });

    // Broadcast to everyone that currentPlayers changed
    io.emit("currentPlayers", allPlayers);
  });

  socket.on("disconnect", () => {
    console.log(`A user disconnected: ${socket.id}`);
    allPlayers = allPlayers.filter((obj) => obj.id !== socket.id);
    socket.broadcast.emit("playerDisconnected", socket.id);
  });
});

app.use(express.static("public"));

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
