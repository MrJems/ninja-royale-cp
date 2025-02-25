import { assets } from "./commons/Assets";
import { Vector } from "./commons/Vector";
import { GameLoop } from "./GameLoop";
import { Input } from "./Input";
import { FRAME_SEQUENCES, serverUrl } from "./commons/constants";
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
import { DeadChar } from "./entities/DeadCharacter";
import { AudioManager } from "./commons/AudioManager";
import { MobileControls } from "./MobileControls";

const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");

const input = new Input();
const audioManager = new AudioManager();

const mobileControl = new MobileControls(audioManager, input);

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

let allPlayers = [];
let mySocketId = null;

const setSocketId = (id) => {
  mySocketId = id;
};

const setAllPlayers = (players) => {
  players.forEach((p) => {
    const existing = allPlayers.find((ap) => ap.id === p.id);
    if (existing && existing.ninjaInstance) {
      p.ninjaInstance = existing.ninjaInstance;
    }
    if (existing && existing.deadInstance) {
      p.deadInstance = existing.deadInstance;
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

let gameoverSoundPlayed = false;

const update = () => {
  if (myHearts.currentHealth <= 0) {
    if (!gameoverSoundPlayed) {
      audioManager.playSound("gameoverMusic");
      gameoverSoundPlayed = true;
    }

    setTimeout(() => {
      location.reload();
    }, 3000);
  }
  const direction = input.direction;
  let actualDirectionToSend = null;
  mySword.update(direction, input.isAttacking);
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
    network.playerMove({
      id: mySocketId,
      player: {
        x: myNinja.position.x,
        y: myNinja.position.y,
        direction: actualDirectionToSend,
        frame: myNinja.sprite.frame,
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
      health: myHearts.currentHealth,
    });
  }
};

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  worldMap.draw(ctx);
  myNinja.draw(ctx);

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
      }
      // console.log(remotePlayer);
      remotePlayer.ninjaInstance.sprite.frame = remotePlayer.player.frame;

      if (remotePlayer.health <= 0) {
        // console.log("-----------inside dead----------------");
        remotePlayer.deadInstance = new DeadChar({
          Resource: assets.images.characters,
          frameSize: new Vector(16, 16),
          hFrames: 7,
          vFrames: 2,
          position: remotePlayer.ninjaInstance.position,
        });

        remotePlayer.deadInstance.draw(ctx);
      } else {
        remotePlayer.ninjaInstance.draw(ctx);
      }

      if (remotePlayer.isAttacking) {
        remotePlayer.swordInstance = new Sword({
          swordResource: assets.images.sword,
          frameSize: new Vector(16, 16),
          hFrames: 2,
          vFrames: 2,
          position: remotePlayer.ninjaInstance.position,
          direction: remotePlayer.ninjaInstance.currentDirection,
        });
        remotePlayer.swordInstance.drawRemote(ctx);
        // console.log(remotePlayer.ninjaInstance);

        let rect1;
        let rect2;
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

        if (isColliding(rect1, rect2)) {
          myHearts.update("SWORD", gameLoop.lastFrameTime);
        }
      }
    }
  }
  // for (let i = 0; i < worldMap.boundaries.length; i++) {
  //   const boundary = worldMap.boundaries[i];
  //   console.log(boundary);
  //   boundary.draw(ctx, worldMap.offset);
  // }
  mySword.draw(ctx);

  worldMap.drawOverlay(ctx);
  myHearts.draw(ctx);

  if (myHearts.currentHealth <= 0) {
    document.getElementById("game-over-overlay").style.display = "flex";
  }
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

mobileControl.initialize(gameLoop);
