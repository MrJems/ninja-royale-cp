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
import { DeadChar } from "./entities/DeadCharacter";
const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");

const input = new Input();
document.addEventListener("DOMContentLoaded", () => {
  // const isMobileDevice = () =>
  //   /Mobi|Android|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent);

  const mobileControls = document.getElementById("mobile-controls");
  const canvasEl = document.getElementById("game-canvas");
  // window.mobileCheck = function () {
  //   let check = false;
  //   (function (a) {
  //     if (
  //       /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
  //         a
  //       ) ||
  //       /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
  //         a.substr(0, 4)
  //       )
  //     )
  //       check = true;
  //   })(navigator.userAgent || navigator.vendor || window.opera);
  //   return check;
  // };

  function detectMob() {
    const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i,
    ];

    return toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem);
    });
  }

  if (detectMob()) {
    mobileControls.style.display = "flex";
    canvasEl.style.width = "100%";
    canvasEl.style.margin = 0;

    const fullscreenButton = document.getElementById("fullscreen");
    fullscreenButton.addEventListener("click", () => {
      const elem = document.documentElement;
      if (!document.fullscreenElement) {
        elem.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });

    const controls = {
      up: document.getElementById("up"),
      down: document.getElementById("down"),
      left: document.getElementById("left"),
      right: document.getElementById("right"),
      attack: document.getElementById("attack"),
    };

    const directions = { up: "UP", down: "DOWN", left: "LEFT", right: "RIGHT" };

    Object.keys(controls).forEach((key) => {
      controls[key].addEventListener("touchstart", () => {
        if (key === "attack") {
          input.isSpacePressed = true;
        } else {
          input.onArrowPressed(directions[key]);
        }
      });

      controls[key].addEventListener("touchend", () => {
        if (key === "attack") {
          input.isSpacePressed = false;
        } else {
          input.onArrowReleased(directions[key]);
        }
      });
    });
  } else {
    mobileControls.style.display = "none";
  }
});

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

const deadChar = new DeadChar({
  Resource: assets.images.characters,
  frameSize: new Vector(16, 16),
  hFrames: 7,
  vFrames: 2,
  position: myNinja.position,
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

const update = () => {
  if (myHearts.currentHealth <= 0) {
    setTimeout(() => {
      location.reload();
    }, 3000);
  }
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
  // if (myHearts.currentHealth <= 0) {
  //   deadChar.draw(ctx);
  // } else {
  myNinja.draw(ctx);
  // }
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
        //   remotePlayer.ninjaInstance.animateHero(
        //     remotePlayer.ninjaInstance.frameSequences[remoteDirection]
        //   );
      }
      console.log(remotePlayer);
      remotePlayer.ninjaInstance.sprite.frame = remotePlayer.player.frame;

      if (remotePlayer.health <= 0) {
        // if (remotePlayer.deadInstance) {
        console.log("-----------inside dead----------------");
        remotePlayer.deadInstance = new DeadChar({
          Resource: assets.images.characters,
          frameSize: new Vector(16, 16),
          hFrames: 7,
          vFrames: 2,
          position: remotePlayer.ninjaInstance.position,
        });
        // }
        remotePlayer.deadInstance.draw(ctx);
      } else {
        remotePlayer.ninjaInstance.draw(ctx);
      }
      // // if(remotePlayer.health <= 0){
      // remotePlayer.heartInstance = new DeadChar({
      //   spriteResource: assets.images.characters,
      //   frameSize: new Vector(16, 16),
      //   hFrames: 7,
      //   vFrames: 2,

      //   position: remotePlayer.ninjaInstance.position,
      // });
      // // }
      // remotePlayer.heartInstance.draw(ctx);

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

  if (myHearts.currentHealth <= 0) {
    // gameOver.draw(ctx);
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
gameLoop.start();
