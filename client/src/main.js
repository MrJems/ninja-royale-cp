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
import { NinjaStar } from "./entities/NinjaStar";

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
const ninjaStars = [];

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

    if (!p.starInstances) p.starInstances = {};
    if (existing && existing.starInstances) {
      p.starInstances = existing.starInstances;
    }

    if (p.stars) {
      p.stars.forEach((starData) => {
        if (!p.starInstances[starData.starId]) {
          p.starInstances[starData.starId] = new NinjaStar({
            ninjaStarResource: assets.images.stars,
            frameSize: new Vector(16, 16),
            hFrames: 3,
            vFrames: 1,
            position: new Vector(starData.x, starData.y),
            direction: starData.direction,
            speed: starData.speed,
            starId: starData.starId,
          });
        }
      });
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
  if (input.consumeXPress()) {
    const star = new NinjaStar({
      ninjaStarResource: assets.images.stars,
      frameSize: new Vector(16, 16),
      hFrames: 3,
      vFrames: 1,
      position: new Vector(
        myNinja.position.x,
        // + worldMap.offset.x,
        myNinja.position.y
        //  + worldMap.offset.y
      ),
      direction: myNinja.currentDirection,
      speed: 4,
      starId: Date.now() + "-" + Math.random(),
    });
    ninjaStars.push(star);

    if (mySocketId) {
      network.playerFiredStar({
        id: mySocketId,
        star: {
          starId: star.starId,
          x: star.position.x,
          y: star.position.y,
          direction: star.direction,
          speed: star.speed,
          active: star.active,
        },
      });
    }
  }

  ninjaStars.forEach((star) => {
    if (star.active && checkBoundaries2(star, star.direction, false)) {
      star.update();
    }
    // if (star.position.x < 0 || star.position.x > canvas.width)
  });

  for (let i = ninjaStars.length - 1; i >= 0; i--) {
    if (!ninjaStars[i].active) {
      ninjaStars.splice(i, 1);
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
      remotePlayer.ninjaInstance.sprite.frame = remotePlayer.player.frame;

      if (remotePlayer.health <= 0) {
        remotePlayer.deadInstance = new DeadChar({
          Resource: assets.images.characters,
          frameSize: new Vector(16, 16),
          hFrames: 7,
          vFrames: 2,
          position: remotePlayer.ninjaInstance.position,
        });

        remotePlayer.deadInstance.draw(ctx);
      } else {
        remotePlayer.ninjaInstance.drawRemote(ctx);
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

      if (remotePlayer.starInstances) {
        Object.values(remotePlayer.starInstances).forEach((starObj) => {
          if (starObj.active) {
            let x = worldMap.offset.x - remotePlayer.world.x;
            let y = worldMap.offset.y - remotePlayer.world.y;

            if (
              starObj.activeRemote &&
              checkBoundaries2(starObj, starObj.direction, true, x, y)
            ) {
              let rect1;
              let rect2;
              rect1 = {
                x: myNinja.position.x - 8,
                y: myNinja.position.y - 8,
                width: 16,
                height: 16,
              };
              rect2 = {
                x: starObj.position.x + x,
                y: starObj.position.y + y,
                width: 16,
                height: 16,
              };

              if (isColliding(rect1, rect2)) {
                myHearts.update("STAR", gameLoop.lastFrameTime);
              }
              starObj.update();

              starObj.drawRemote(ctx, x, y);
            }
          }
        });
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
  ninjaStars.forEach((star) => {
    star.draw(ctx);
  });

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

function checkBoundaries2(star, direction, isRemote, x = 0, y = 0) {
  const speed = 4;
  let nextX = star.position.x + x;
  let nextY = star.position.y + y;

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
      if (isRemote) {
        star.activeRemote = false;
      } else {
        star.active = false;
      }
      return false;
    }
  }
  return true;
}

const gameLoop = new GameLoop(update, draw);

mobileControl.initialize(gameLoop);
