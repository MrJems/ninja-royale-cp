import { assets } from "./commons/Assets";
import { Vector } from "./commons/Vector";
import { GameLoop } from "./GameLoop";
import { Input } from "./Input";
import { FRAME_SEQUENCES } from "./commons/constants";
import { Ninja } from "./entities/Ninja";
import { WorldMap } from "./entities/WorldMap";
import { rectangularCollision } from "./services/collisonDetection";

const socket = io("http://localhost:3000/");

const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");

const input = new Input();

const ninjaPos = new Vector(canvas.width / 2, canvas.height / 2);

const worldMap = new WorldMap({
  backgroundResource: assets.images.worldmap,
  treeResource: assets.images.treeoverlay,
});

const myNinja = new Ninja({
  spriteResource: assets.images.player1,
  frameSize: new Vector(16, 16),
  hFrames: 4,
  vFrames: 7,
  frameSequences: FRAME_SEQUENCES,
  position: ninjaPos,
});

// const playersData = {};
let allPlayers = [];
let mySocketId = null;

const update = () => {
  const direction = input.direction;
  if (!direction) return;

  let canMove = checkBoundaries(direction);
  let movedWorldOffset = false;
  if (canMove) {
    movedWorldOffset = worldMap.moveOffset(
      direction,
      myNinja.moveSpeed,
      canvas,
      myNinja.position
    );
  }
  if (canMove) {
    if (!movedWorldOffset) {
      myNinja.update(direction, true, movedWorldOffset);
    } else {
      myNinja.update(direction, canMove, movedWorldOffset);
    }
  }

  if (mySocketId) {
    socket.emit("playerMove", {
      id: mySocketId,
      player: { x: myNinja.position.x, y: myNinja.position.y },
      world: { x: worldMap.offset.x, y: worldMap.offset.y },
    });
  }
};
socket.on("currentPlayers", (players) => {
  console.log(players);
  allPlayers = players;
  console.log(allPlayers);
});
const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  worldMap.draw(ctx);
  myNinja.draw(ctx);

  for (let i = 0; i < allPlayers.length; i++) {
    if (allPlayers[i].id != mySocketId) {
      new Ninja({
        spriteResource: assets.images.player1,
        frameSize: new Vector(16, 16),
        hFrames: 4,
        vFrames: 7,
        frameSequences: FRAME_SEQUENCES,
        position: new Vector(
          worldMap.offset.x - allPlayers[i].world.x + allPlayers[i].player.x,
          worldMap.offset.y - allPlayers[i].world.y + allPlayers[i].player.y
        ),
      }).draw(ctx);
      console.log(
        worldMap.offset.x,

        worldMap.offset.y,
        allPlayers[i].world.x,
        allPlayers[i].world.y,
        allPlayers[i].player.x,
        allPlayers[i].player.y
      );
      // nin
      //   .animateHero(FRAME_SEQUENCES)
      // allPlayers[i].ninjaInstance.draw(ctx);
      // new Ninja({
      //   spriteResource: assets.images.player1,
      //   frameSize: new Vector(16, 16),
      //   hFrames: 4,
      //   vFrames: 7,
      //   frameSequences: FRAME_SEQUENCES,
      //   position: ninjaPos,
      // });
      console.log(allPlayers[i]);
    }
  }
  // for (let i = 0; i < worldMap.boundaries.length; i++) {
  //   const boundary = worldMap.boundaries[i];
  //   console.log(boundary);
  //   boundary.draw(ctx, worldMap.offset);
  // }

  worldMap.drawOverlay(ctx);
};

function checkBoundaries(direction) {
  const speed = myNinja.moveSpeed;
  let nextX = myNinja.position.x;
  let nextY = myNinja.position.y;

  switch (direction) {
    case "UP":
      nextY -= speed;
      break;
    case "DOWN":
      nextY += speed;
      break;
    case "LEFT":
      nextX -= speed;
      break;
    case "RIGHT":
      nextX += speed;
      break;
  }
  for (let i = 0; i < worldMap.boundaries.length; i++) {
    const boundary = worldMap.boundaries[i];
    if (
      rectangularCollision(
        { x: nextX, y: nextY },
        16,
        boundary.position,
        { width: boundary.width, height: boundary.height },
        worldMap.offset,
        direction
      )
    ) {
      return false;
    }
  }
  return true;
}

const gameLoop = new GameLoop(update, draw);
gameLoop.start();

socket.on("connect", () => {
  mySocketId = socket.id;
  console.log("Connected to server with ID:", mySocketId);

  // playersData[mySocketId] = {
  //   x: myNinja.position.x + worldMap.offset.x,
  //   y: myNinja.position.y + worldMap.offset.y,
  // };
  // let pos = {
  //   x: worldMap.offset.x,
  //   y: worldMap.offset.y,
  // };
  // console.log(worldMap);
  // const newNinja = new Ninja({
  //   spriteResource: assets.images.player1,
  //   frameSize: new Vector(16, 16),
  //   hFrames: 4,
  //   vFrames: 7,
  //   frameSequences: FRAME_SEQUENCES,
  //   position: new Vector(pos.x, pos.y),
  // });

  socket.emit("playerCreated", {
    id: mySocketId,
    player: { x: myNinja.position.x, y: myNinja.position.y },
    world: { x: worldMap.offset.x, y: worldMap.offset.y },
    // ninjaInstance: newNinja,
  });
});
