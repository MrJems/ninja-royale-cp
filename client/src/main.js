import { assets } from "./commons/Assets";
import { Sprite } from "./commons/sprite";
import { Vector } from "./commons/Vector";
import { GameLoop } from "./GameLoop";
import { Input } from "./Input";
import collisions from "./commons/collison";
import { DOWN, LEFT, RIGHT, UP } from "./Input";
// import attemptMove from "./services/attemptMove";
const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");

let animationFrame = 0;
let animationCounter = 0;
const animationSpeed = 4;
const frameSequences = {
  [DOWN]: [0, 4, 8, 12, 16, 20, 0],
  [UP]: [1, 5, 9, 13, 17, 21, 1],
  [LEFT]: [2, 6, 10, 14, 18, 22, 2],
  [RIGHT]: [3, 7, 11, 15, 19, 23, 3],
};

// console.log(collisions.length);

let currentDirection = null;
const moveSpeed = 2;
const backgroundOffset = new Vector(-100, -100);
const mapWidth = 16 * 63;
const mapHeight = 16 * 63;
const input = new Input();

const heroPos = new Vector(canvas.width / 2, canvas.height / 2);
const worldmap = new Sprite({
  resource: assets.images.worldmap,
  frameSize: new Vector(63 * 16, 63 * 16),
});
const treemap = new Sprite({
  resource: assets.images.treeoverlay,
  frameSize: new Vector(63 * 16, 63 * 16),
});
const hero = new Sprite({
  resource: assets.images.player1,
  frameSize: new Vector(16, 16),
  hFrames: 4,
  vFrames: 7,
  frame: 0,
});

class Boundary {
  constructor({ position }) {
    this.position = position;
    this.width = 16;
    this.height = 16;
  }
  draw(bf) {
    ctx.fillStyle = "red";
    ctx.fillRect(
      this.position.x + bf.x,
      this.position.y + bf.y,
      this.width,
      this.height
    );
  }
}

const boundaries = [];

collisions.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol !== 0) {
      boundaries.push(
        new Boundary({
          position: {
            x: j * 16,
            y: i * 16,
          },
        })
      );
    }
  });
});
// console.log("boudnry :", boundaries);

function rectangularCollision(index) {
  let NextX = heroPos.x;
  let NextY = heroPos.y;
  let WorldX = backgroundOffset.x;
  let WorldY = backgroundOffset.y;
  const detectBefore = 2;
  if (input.direction === DOWN) {
    if (heroPos.y < canvas.height / 2 - 16) {
      NextY = heroPos.y + detectBefore;
    } else if (backgroundOffset.y > -(mapHeight - canvas.height)) {
      WorldY = backgroundOffset.y - detectBefore;
    }
  }

  if (input.direction === UP) {
    if (backgroundOffset.y < 0) {
      WorldY = backgroundOffset.y + detectBefore;
    } else if (heroPos.y > 0) {
      NextY = heroPos.y - detectBefore;
    }
  }

  if (input.direction === LEFT) {
    if (backgroundOffset.x < 0) {
      WorldX = backgroundOffset.x + detectBefore;
    } else if (heroPos.x > 0) {
      NextX = heroPos.x - detectBefore;
    }
  }
  if (input.direction === RIGHT) {
    if (heroPos.x < canvas.width / 2) {
      NextX = heroPos.x + detectBefore;
    } else if (backgroundOffset.x > -(mapWidth - canvas.width)) {
      WorldX = backgroundOffset.x - detectBefore;
    }
    currentDirection = RIGHT;
    animateHero(frameSequences[RIGHT]);
  }
  // index = 1;
  // console.log(heroPos, boundaries[0], index, heroPos.x, backgroundOffset.y);

  let w = 8;
  // return true;

  return (
    NextX + w + Math.abs(WorldX) >= boundaries[index].position.x + 3 &&
    NextX + Math.abs(WorldX) - w <= boundaries[index].position.x + 13 &&
    NextY - w + Math.abs(WorldY) <= boundaries[index].position.y + 13 &&
    NextY + w + Math.abs(WorldY) >= boundaries[index].position.y + 3
    // heroPos.x <= boundaries[2].position.x + 16 &&
    // heroPos.y <= boundaries[2].position.y + 16 &&
    // heroPos.y + 16 >= boundaries[2].position.y
  );

  return (
    heroPos.x + w + Math.abs(backgroundOffset.x) >=
      boundaries[index].position.x &&
    heroPos.x + Math.abs(backgroundOffset.x) - w <=
      boundaries[index].position.x + 16 &&
    heroPos.y - w + Math.abs(backgroundOffset.y) <=
      boundaries[index].position.y + 16 &&
    heroPos.y + w + Math.abs(backgroundOffset.y) >= boundaries[index].position.y
    // heroPos.x <= boundaries[2].position.x + 16 &&
    // heroPos.y <= boundaries[2].position.y + 16 &&
    // heroPos.y + 16 >= boundaries[2].position.y
  );
}

function moveable() {
  let nextMove = input.direction;
  for (let i = 0; i < boundaries.length; i++) {
    // console.log(i);
    if (rectangularCollision(i, nextMove)) {
      return false;
    }
  }
  return true;
}

// if (rectangularCollision()) {
//   // console.log(boundaries[2]);
//   console.log("colideed");
// }
const update = () => {
  // const attemptMoveParams = {
  //   direction: input.direction,
  //   heroPos,
  //   backgroundOffset,
  //   collisions,
  //   TILE_SIZE: 16,
  //   mapWidth,
  //   mapHeight,
  //   moveSpeed,
  //   canvas,
  // };
  // if (input.direction === DOWN) {
  //   if (attemptMove(attemptMoveParams)) {
  //     currentDirection = DOWN;
  //     animateHero(frameSequences[DOWN]);
  //   }
  // }

  // if (input.direction === UP) {
  //   if (attemptMove(attemptMoveParams)) {
  //     currentDirection = UP;
  //     animateHero(frameSequences[UP]);
  //   }
  // }

  // if (input.direction === LEFT) {
  //   if (attemptMove(attemptMoveParams)) {
  //     currentDirection = LEFT;
  //     animateHero(frameSequences[LEFT]);
  //   }
  // }

  // if (input.direction === RIGHT) {
  //   if (attemptMove(attemptMoveParams)) {
  //     currentDirection = RIGHT;
  //     animateHero(frameSequences[RIGHT]);
  //   }
  // }

  if (heroPos.x + 16)
    if (input.direction === DOWN) {
      // console.log(backgroundOffset, mapHeight, canvas, heroPos);
      // heroPos.y += 1;
      // backgroundOffset.y -= moveSpeed;

      if (moveable()) {
        if (heroPos.y < canvas.height / 2 - 16) {
          heroPos.y += moveSpeed;
        } else if (backgroundOffset.y > -(mapHeight - canvas.height)) {
          backgroundOffset.y -= moveSpeed;
        }
      }

      // if (
      //   backgroundOffset.y > -(mapHeight - canvas.height) ||
      //   backgroundOffset.y < -(canvas.height / 2)
      // ) {
      //   backgroundOffset.y -= moveSpeed;
      // } else if (heroPos.y < canvas.height - 16) {
      //   heroPos.y += moveSpeed;
      // }

      // if (
      //   backgroundOffset.y > -(mapHeight - canvas.height) ||
      //   backgroundOffset.y < -(canvas.height / 2)
      // ) {
      //   backgroundOffset.y -= moveSpeed;
      // } else if (heroPos.y < canvas.height - 16) {
      //   heroPos.y += moveSpeed;
      // }
      currentDirection = DOWN;
      animateHero(frameSequences[DOWN]);
    }
  if (input.direction === UP && moveable()) {
    if (backgroundOffset.y < 0) {
      backgroundOffset.y += moveSpeed;
    } else if (heroPos.y > 0) {
      heroPos.y -= moveSpeed;
    }
    currentDirection = UP;
    animateHero(frameSequences[UP]);
  }
  if (input.direction === LEFT && moveable()) {
    if (backgroundOffset.x < 0) {
      backgroundOffset.x += moveSpeed;
    } else if (heroPos.x > 0) {
      heroPos.x -= moveSpeed;
    }
    currentDirection = LEFT;
    animateHero(frameSequences[LEFT]);
  }
  if (input.direction === RIGHT && moveable()) {
    if (heroPos.x < canvas.width / 2) {
      heroPos.x += moveSpeed;
    } else if (backgroundOffset.x > -(mapWidth - canvas.width)) {
      backgroundOffset.x -= moveSpeed;
    }
    currentDirection = RIGHT;
    animateHero(frameSequences[RIGHT]);
  }
};

const animateHero = (sequence) => {
  animationCounter++;
  if (animationCounter >= animationSpeed) {
    animationCounter = 0;
    animationFrame = (animationFrame + 1) % sequence.length;
  }
  hero.frame = sequence[animationFrame];
};

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  worldmap.drawImage(ctx, backgroundOffset.x, backgroundOffset.y);

  const heroOffset = new Vector(-8, -8);
  const heroPosX = heroPos.x + heroOffset.x;
  const heroPosY = heroPos.y + heroOffset.y;
  hero.drawImage(ctx, heroPosX, heroPosY);
  treemap.drawImage(ctx, backgroundOffset.x, backgroundOffset.y);
  // boundaries.forEach((bound) => {
  //   bound.draw(backgroundOffset);
  // });
};

const gameLoop = new GameLoop(update, draw);
gameLoop.start();
