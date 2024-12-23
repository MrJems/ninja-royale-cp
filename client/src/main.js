import { assets } from "./commons/Assets";
import { Sprite } from "./commons/sprite";
import { Vector } from "./commons/Vector";
import { GameLoop } from "./GameLoop";
import { Input } from "./Input";
import collisions from "./commons/collison";
import { Boundary } from "./entities/Boundary";
import {
  DOWN,
  LEFT,
  RIGHT,
  UP,
  DEFAULT_ANIMATION_COUNTER,
  DEFAULT_ANIMATION_FRAME,
  ANIMATION_SPEED,
  FRAME_SEQUENCES,
  DEFAULT_DIRECTION,
  MOVE_SPEED,
  MAP_WIDTH,
  MAP_HEIGHT,
} from "./commons/constants";
import { Ninja } from "./entities/Ninja";
import { WorldMap } from "./entities/WorldMap";
import { rectangularCollision } from "./services/collisonDetection";
// import attemptMove from "./services/attemptMove";

const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");

let animationFrame = DEFAULT_ANIMATION_FRAME;
let animationCounter = DEFAULT_ANIMATION_COUNTER;
const animationSpeed = ANIMATION_SPEED;
const frameSequences = FRAME_SEQUENCES;
let currentDirection = DEFAULT_DIRECTION;
const moveSpeed = MOVE_SPEED;

const backgroundOffset = new Vector(-100, -100);
const mapWidth = MAP_WIDTH;
const mapHeight = MAP_HEIGHT;

const input = new Input();

const ninjaPos = new Vector(canvas.width / 2, canvas.height / 2);
// const worldmap = new Sprite({
//   resource: assets.images.worldmap,
//   frameSize: new Vector(mapWidth, mapHeight),
// });

const worldMap = new WorldMap({
  backgroundResource: assets.images.worldmap,
  treeResource: assets.images.treeoverlay,
});
// const treemap = new Sprite({
//   resource: assets.images.treeoverlay,
//   frameSize: new Vector(mapWidth, mapHeight),
// });
const myNinja = new Ninja({
  spriteResource: assets.images.player1,
  frameSize: new Vector(16, 16),
  hFrames: 4,
  vFrames: 7,
  frameSequences: FRAME_SEQUENCES,
  position: ninjaPos,
});

// const boundaries = [];

// collisions.forEach((row, i) => {
//   row.forEach((symbol, j) => {
//     if (symbol !== 0) {
//       boundaries.push(
//         new Boundary({
//           position: {
//             x: j * 16,
//             y: i * 16,
//           },
//         })
//       );
//     }
//   });
// });

// function rectangularCollision(index) {
//   let NextX = heroPos.x;
//   let NextY = heroPos.y;
//   let WorldX = backgroundOffset.x;
//   let WorldY = backgroundOffset.y;
//   const detectBefore = 2;
//   if (input.direction === DOWN) {
//     if (heroPos.y < canvas.height / 2 - 16) {
//       NextY = heroPos.y + detectBefore;
//     } else if (backgroundOffset.y > -(mapHeight - canvas.height)) {
//       WorldY = backgroundOffset.y - detectBefore;
//     }
//   }

//   if (input.direction === UP) {
//     if (backgroundOffset.y < 0) {
//       WorldY = backgroundOffset.y + detectBefore;
//     } else if (heroPos.y > 0) {
//       NextY = heroPos.y - detectBefore;
//     }
//   }

//   if (input.direction === LEFT) {
//     if (backgroundOffset.x < 0) {
//       WorldX = backgroundOffset.x + detectBefore;
//     } else if (heroPos.x > 0) {
//       NextX = heroPos.x - detectBefore;
//     }
//   }
//   if (input.direction === RIGHT) {
//     if (heroPos.x < canvas.width / 2) {
//       NextX = heroPos.x + detectBefore;
//     } else if (backgroundOffset.x > -(mapWidth - canvas.width)) {
//       WorldX = backgroundOffset.x - detectBefore;
//     }
//   }
//   // index = 1;
//   // console.log(heroPos, boundaries[0], index, heroPos.x, backgroundOffset.y);

//   let w = 8;
//   // return true;

//   return (
//     NextX + w + Math.abs(WorldX) >= boundaries[index].position.x + 3 &&
//     NextX + Math.abs(WorldX) - w <= boundaries[index].position.x + 13 &&
//     NextY - w + Math.abs(WorldY) <= boundaries[index].position.y + 13 &&
//     NextY + w + Math.abs(WorldY) >= boundaries[index].position.y + 3
//     // heroPos.x <= boundaries[2].position.x + 16 &&
//     // heroPos.y <= boundaries[2].position.y + 16 &&
//     // heroPos.y + 16 >= boundaries[2].position.y
//   );
// }

// function moveable() {
//   let nextMove = input.direction;
//   for (let i = 0; i < boundaries.length; i++) {
//     if (rectangularCollision(i, nextMove)) {
//       return false;
//     }
//   }
//   return true;
// }

const update = () => {
  const direction = input.direction;
  if (!direction) return;

  let canMove = checkBoundaries(direction);

  if (!canMove) {
    console.log("colloeedd");
  }
  // let canMoveBack = () => {
  //   console.log(ninjaPos, myNinja);
  //   if (myNinja.y <= ninjaPos.y) {
  //     return false;
  //   }

  //   return true;
  // };
  let movedWorldOffset = false;
  // 2. If hero near center, attempt to move map offset
  if (canMove) {
    movedWorldOffset = worldMap.moveOffset(
      direction,
      myNinja.moveSpeed,
      canvas,
      myNinja.position
    );
  }
  // 3. If the map offset didn’t move, move hero
  if (canMove) {
    if (!movedWorldOffset) {
      myNinja.update(direction, true, movedWorldOffset);
    } else {
      // If map offset moved, hero only updates animation frame
      myNinja.update(direction, canMove, movedWorldOffset);
    }
  }
  // if (heroPos.x + 16)
  //   if (input.direction === DOWN) {
  //     // console.log(backgroundOffset, mapHeight, canvas, heroPos);
  //     // heroPos.y += 1;
  //     // backgroundOffset.y -= moveSpeed;
  //     if (moveable()) {
  //       if (heroPos.y < canvas.height / 2 - 16) {
  //         heroPos.y += moveSpeed;
  //       } else if (backgroundOffset.y > -(mapHeight - canvas.height)) {
  //         backgroundOffset.y -= moveSpeed;
  //       }
  //     }
  //     currentDirection = DOWN;
  //     animateHero(frameSequences[DOWN]);
  //   }
  // if (input.direction === UP && moveable()) {
  //   if (backgroundOffset.y < 0) {
  //     backgroundOffset.y += moveSpeed;
  //   } else if (heroPos.y > 0) {
  //     heroPos.y -= moveSpeed;
  //   }
  //   currentDirection = UP;
  //   animateHero(frameSequences[UP]);
  // }
  // if (input.direction === LEFT && moveable()) {
  //   if (backgroundOffset.x < 0) {
  //     backgroundOffset.x += moveSpeed;
  //   } else if (heroPos.x > 0) {
  //     heroPos.x -= moveSpeed;
  //   }
  //   currentDirection = LEFT;
  //   animateHero(frameSequences[LEFT]);
  // }
  // if (input.direction === RIGHT && moveable()) {
  //   if (heroPos.x < canvas.width / 2) {
  //     heroPos.x += moveSpeed;
  //   } else if (backgroundOffset.x > -(mapWidth - canvas.width)) {
  //     backgroundOffset.x -= moveSpeed;
  //   }
  //   currentDirection = RIGHT;
  //   animateHero(frameSequences[RIGHT]);
  // }
};

// const animateHero = (sequence) => {
//   animationCounter++;
//   if (animationCounter >= animationSpeed) {
//     animationCounter = 0;
//     animationFrame = (animationFrame + 1) % sequence.length;
//   }
//   hero.frame = sequence[animationFrame];
// };

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  worldMap.draw(ctx);

  // Draw hero
  myNinja.draw(ctx);

  // Draw map overlay (trees, etc.)
  worldMap.drawOverlay(ctx);

  // for (let i = 0; i < worldMap.boundaries.length; i++) {
  //   const boundary = worldMap.boundaries[i];
  //   boundary.draw(ctx, worldMap.offset);
  // }
  // const heroOffset = new Vector(-8, -8);
  // const heroPosX = heroPos.x + heroOffset.x;
  // const heroPosY = heroPos.y + heroOffset.y;

  // worldmap.drawImage(ctx, backgroundOffset.x, backgroundOffset.y);
  // hero.drawImage(ctx, heroPosX, heroPosY);
  // treemap.drawImage(ctx, backgroundOffset.x, backgroundOffset.y);
};

function checkBoundaries(direction) {
  // For every boundary, check collision
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
        16, // hero size
        boundary.position,
        { width: boundary.width, height: boundary.height },
        worldMap.offset,
        direction
      )
    ) {
      // console.log("colliede");
      // If there's a collision in the direction the hero wants to move, block it
      return false;
    }
  }
  return true;
}

const gameLoop = new GameLoop(update, draw);
gameLoop.start();
