import { Sprite } from "../commons/Sprite.js";
import { Vector } from "../commons/Vector.js";
import { Boundary } from "../entities/Boundary.js";
import collisions from "../commons/collison.js";
import { Ninja } from "./Ninja.js";

export class WorldMap {
  constructor({ backgroundResource, treeResource }) {
    const possibleOffsets = [
      new Vector(-600, 0),
      new Vector(-295, -610),
      new Vector(-440, -245),
      new Vector(-345, -175),
      new Vector(-600, -825),
    ];
    const randomIndex = Math.floor(Math.random() * possibleOffsets.length);
    const randomOffset = possibleOffsets[randomIndex];

    this.offset = randomOffset;
    this.mapWidth = 16 * 63;
    this.mapHeight = 16 * 63;

    this.backgroundSprite = new Sprite({
      resource: backgroundResource,
      frameSize: new Vector(this.mapWidth, this.mapHeight),
    });
    this.treeSprite = new Sprite({
      resource: treeResource,
      frameSize: new Vector(this.mapWidth, this.mapHeight),
    });

    this.boundaries = [];
    collisions.forEach((row, i) => {
      row.forEach((symbol, j) => {
        if (symbol !== 0) {
          this.boundaries.push(
            new Boundary({
              position: { x: j * 16, y: i * 16 },
            })
          );
        }
      });
    });
  }

  draw(ctx) {
    this.backgroundSprite.drawImage(ctx, this.offset.x, this.offset.y);
  }

  drawOverlay(ctx) {
    this.treeSprite.drawImage(ctx, this.offset.x, this.offset.y);
  }

  resetOffset() {
    const possibleOffsets = [
      new Vector(-600, 0),
      new Vector(-295, -610),
      new Vector(-440, -245),
      new Vector(-345, -175),
      new Vector(-600, -825),
    ];
    const randomIndex = Math.floor(Math.random() * possibleOffsets.length);
    const randomOffset = possibleOffsets[randomIndex];
    this.offset = randomOffset;
  }

  moveOffset(direction, speed, canvas, heroPos) {
    if (direction === "DOWN") {
      if (this.offset.y > -(this.mapHeight - canvas.height)) {
        if (heroPos.y < 90) {
          return false;
        }
        this.offset.y -= speed;
        return true;
      }
    }
    if (direction === "UP") {
      if (this.offset.y < 0) {
        if (heroPos.y > 90) {
          return false;
        }
        this.offset.y += speed;
        return true;
      }
    }
    if (direction === "LEFT") {
      if (this.offset.x < 0) {
        if (heroPos.x > 160) {
          return false;
        }
        this.offset.x += speed;
        return true;
      }
    }
    if (direction === "RIGHT") {
      if (this.offset.x > -(this.mapWidth - canvas.width)) {
        if (heroPos.x < 160) {
          return false;
        }
        this.offset.x -= speed;
        return true;
      }
    }
    return false;
  }
}
