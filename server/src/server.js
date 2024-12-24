const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const PORT = 3000;

let allPlayers = [];

io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // players[socket.id] = {
  //   x: 100,
  //   y: 100,
  // };
  socket.on("playerCreated", (data) => {
    allPlayers.push(data);
    socket.emit("currentPlayers", allPlayers);

    console.log(allPlayers);
  });

  socket.on("playerMove", (data) => {
    console.log("...............");
    console.log(allPlayers);
    allPlayers = allPlayers.map((obj) => {
      if (obj.id === data.id) {
        console.log("...........=====...");
        // Return the updated object
        return { ...obj, player: data.player, world: data.world };
      }
      // Return the object as is if it doesn't match the id
      return obj;
    });
    // players.push(data);
    console.log(allPlayers);
    io.emit("currentPlayers", allPlayers);

    // console.log(allPlayers);
  });
  // console.log(allPlayers);

  socket.on("disconnect", () => {
    console.log(`A user disconnected: ${socket.id}`);
    allPlayers = allPlayers.filter((obj) => obj.id !== socket.id);
    console.log(allPlayers);

    socket.broadcast.emit("playerDisconnected", socket.id);
  });
});

app.use(express.static("public"));

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
