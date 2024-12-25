import { assets } from "./commons/Assets";
import { Vector } from "./commons/Vector";
import { GameLoop } from "./GameLoop";
import { Input } from "./Input";
import { DOWN, FRAME_SEQUENCES, serverUrl } from "./commons/constants";
import { Ninja } from "./entities/Ninja";
import { WorldMap } from "./entities/WorldMap";
import {
  rectangularCollision,
  isColliding,
} from "./services/collisonDetection";
import { Network } from "./network";
import {
  handleConnect,
  handleCurrentPlayers,
} from "./services/networkServices";
import { Sword } from "./entities/Sword";
import { Heart } from "./entities/Heart";
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

const mySword = new Sword({
  swordResource: assets.images.sword,
  frameSize: new Vector(16, 16),
  hFrames: 2,
  vFrames: 2,
  position: myNinja.position,
});

const myHearts = new Heart({
  hearResource: assets.images.life,
  frameSize: new Vector(16, 16),
  hFrames: 5,
  vFrames: 1,
});

// const playersData = {};
let allPlayers = [];
let mySocketId = null;

const setSocketId = (id) => {
  mySocketId = id;
};

const setAllPlayers = (players) => {
  // allPlayers = players;

  players.forEach((p) => {
    const existing = allPlayers.find((ap) => ap.id === p.id);
    if (existing && existing.ninjaInstance) {
      p.ninjaInstance = existing.ninjaInstance;
    }
  });
  allPlayers = players;
};

const network = new Network(serverUrl);

network.init(
  (socketId) =>
    handleConnect(socketId, network, myNinja, worldMap, setSocketId),
  (players) => handleCurrentPlayers(players, setAllPlayers)
);

const update = () => {
  const direction = input.direction;
  let actualDirectionToSend = null;
  // if (input.isAttacking) {
  mySword.update(direction, input.isAttacking);
  // }
  if (direction) {
    const canMove = checkBoundaries(direction);
    let movedWorldOffset = false;

    if (canMove) {
      movedWorldOffset = worldMap.moveOffset(
        direction,
        myNinja.moveSpeed,
        canvas,
        myNinja.position
      );

      if (canMove) {
        if (!movedWorldOffset) {
          myNinja.update(direction, true, movedWorldOffset, input.isAttacking);
        } else {
          myNinja.update(
            direction,
            canMove,
            movedWorldOffset,
            input.isAttacking
          );
        }
      }

      actualDirectionToSend = direction;
    }
  }

  if (mySocketId) {
    // network.playerAttacked({
    //   id: mySocketId,
    //   isAttacking: input.isAttacking,
    //   sword: {
    //     x: mySword.position.x,
    //     y: mySword.position.y,
    //     direction: mySword.currentDirection,
    //   },
    // });
    network.playerMove({
      id: mySocketId,
      player: {
        x: myNinja.position.x,
        y: myNinja.position.y,
        direction: actualDirectionToSend,
      },
      world: {
        x: worldMap.offset.x,
        y: worldMap.offset.y,
      },
      isAttacking: input.isAttacking,
      sword: {
        x: mySword.position.x,
        y: mySword.position.y,
        direction: mySword.currentDirection,
      },
    });
  }
};

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  worldMap.draw(ctx);
  myNinja.draw(ctx);
  // let rect1;
  // let rect2;
  // let flag = false;
  for (let i = 0; i < allPlayers.length; i++) {
    const remotePlayer = allPlayers[i];
    if (remotePlayer.id !== mySocketId) {
      if (!remotePlayer.ninjaInstance) {
        remotePlayer.ninjaInstance = new Ninja({
          spriteResource: assets.images.player1,
          frameSize: new Vector(16, 16),
          hFrames: 4,
          vFrames: 7,
          frameSequences: FRAME_SEQUENCES,
          position: new Vector(0, 0),
        });
      }

      remotePlayer.ninjaInstance.position.x =
        worldMap.offset.x - remotePlayer.world.x + remotePlayer.player.x;
      remotePlayer.ninjaInstance.position.y =
        worldMap.offset.y - remotePlayer.world.y + remotePlayer.player.y;

      const remoteDirection = remotePlayer.player.direction;
      if (remoteDirection) {
        remotePlayer.ninjaInstance.currentDirection = remoteDirection;
        remotePlayer.ninjaInstance.animateHero(
          remotePlayer.ninjaInstance.frameSequences[remoteDirection]
        );
      }

      remotePlayer.ninjaInstance.draw(ctx);
      if (remotePlayer.isAttacking) {
        remotePlayer.swordInstance = new Sword({
          swordResource: assets.images.sword,
          frameSize: new Vector(16, 16),
          hFrames: 2,
          vFrames: 2,
          position: remotePlayer.ninjaInstance.position,
          direction: remotePlayer.ninjaInstance.currentDirection,
        });
        // console.log(remotePlayer);
        // console.log("yess");
        remotePlayer.swordInstance.drawRemote(ctx);
        // flag = true;
        console.log(remotePlayer.ninjaInstance);

        let rect1;
        let rect2;
        // if (remotePlayer.ninjaInstance.currentDirection) {
        rect1 = {
          x: myNinja.position.x - 8,
          y: myNinja.position.y - 8,
          width: 16,
          height: 16,
        };
        rect2 = {
          x:
            remotePlayer.swordInstance.position.x +
            remotePlayer.swordInstance.swordOffset.x,
          y:
            remotePlayer.swordInstance.position.y +
            remotePlayer.swordInstance.swordOffset.y,
          width: 16,
          height: 16,
        };

        if (remotePlayer.ninjaInstance.currentDirection == "DOWN") {
          rect2.width = 6;
        }
        if (remotePlayer.ninjaInstance.currentDirection == "UP") {
          rect2.width = 6;
        }
        if (remotePlayer.ninjaInstance.currentDirection == "LEFT") {
          rect2.y += 10;
          rect2.height = 6;
        }
        if (remotePlayer.ninjaInstance.currentDirection == "RIGHT") {
          rect2.y += 10;
          rect2.height = 6;
        }
        // } else {
        //   rect1 = {
        //     x: myNinja.position.x,
        //     y: myNinja.position.y,
        //     width: 16,
        //     height: 16,
        //   };
        //   rect2 = {
        //     x: remotePlayer.swordInstance.position.x,
        //     y: remotePlayer.swordInstance.position.y,
        //     width: 6,
        //     height: 16,
        //   };
        // }

        if (isColliding(rect1, rect2)) {
          // setInterval(() => {
          myHearts.update("SWORD", gameLoop.lastFrameTime); // Apply damage every 2 seconds
          // }, 2000);
          // console.log("damageadf");
          // // gameLoop.stop();
          // // gameLoop.start();
          // worldMap.resetOffset();
          // myNinja.position.x = 0;
        }

        // ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
        // ctx.fillRect(rect1.x, rect1.y, rect1.width, rect1.height);

        // ctx.fillStyle = "rgba(0, 76, 255, 0.3)";
        // ctx.fillRect(rect2.x, rect2.y, rect2.width, rect2.height);

        // ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
        // ctx.fillRect(
        //   remotePlayer.swordInstance.position.x +
        //     remotePlayer.swordInstance.s wordOffset.x,
        //   remotePlayer.swordInstance.position.y +
        //     remotePlayer.swordInstance.swordOffset.y,
        //   16,
        //   16
        // );
      }
    }
  }
  // for (let i = 0; i < worldMap.boundaries.length; i++) {
  //   const boundary = worldMap.boundaries[i];
  //   console.log(boundary);
  //   boundary.draw(ctx, worldMap.offset);
  // }
  mySword.draw(ctx);

  // if (flag) {

  //   // if (isColliding(rect1, rect2)) {
  //   //   console.log("damageadf");
  //   // }
  // }
  worldMap.drawOverlay(ctx);
  myHearts.draw(ctx);
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
