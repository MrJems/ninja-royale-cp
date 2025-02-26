export function initNetwork(socket, onConnect, onCurrentPlayers) {
  socket.on("connect", () => {
    if (onConnect) {
      onConnect(socket.id);
    }
  });

  socket.on("currentPlayers", (players) => {
    if (onCurrentPlayers) {
      onCurrentPlayers(players);
    }
  });
}

export function emitPlayerCreated(socket, data) {
  socket.emit("playerCreated", data);
}

export function emitPlayerMove(socket, data) {
  socket.emit("playerMove", data);
}
export function emitPlayerAttacked(socket, data) {
  socket.emit("playerAttacked", data);
}

export function emitPlayerFiredStar(socket, data) {
  // data will have { id, star: { starId, x, y, direction, speed, active } }
  socket.emit("playerFiredStar", data);
}

export function handleConnect(
  socketId,
  network,
  myNinja,
  worldMap,
  setSocketId
) {
  setSocketId(socketId);
  console.log("Connected with ID:", socketId);

  network.playerCreated({
    id: socketId,
    player: { x: myNinja.position.x, y: myNinja.position.y },
    world: { x: worldMap.offset.x, y: worldMap.offset.y },
  });
}

export function handleCurrentPlayers(players, setAllPlayers) {
  setAllPlayers(players);
}
