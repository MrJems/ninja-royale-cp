import { Sprite } from "../commons/sprite.js";
import { Vector } from "../commons/Vector.js";
import { Boundary } from "../entities/Boundary.js";
import collisions from "../commons/collison.js"; // your array data
import { Ninja } from "./Ninja.js";

export class WorldMap {
  constructor({ backgroundResource, treeResource }) {
    this.offset = new Vector(-100, -100);
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

    // Build boundaries from collisions data
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
    // Draw main background
    this.backgroundSprite.drawImage(ctx, this.offset.x, this.offset.y);
  }

  drawOverlay(ctx) {
    // Draw tree overlay
    this.treeSprite.drawImage(ctx, this.offset.x, this.offset.y);
  }

  moveOffset(direction, speed, canvas, heroPos) {
    // Move the world offset if the hero is near screen center
    // Return `true` if we actually moved the offset, `false` if not

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
