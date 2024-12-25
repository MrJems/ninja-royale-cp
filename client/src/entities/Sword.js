import { Sprite } from "../commons/Sprite";
import { Vector } from "../commons/Vector";
import { UP, DOWN, LEFT, RIGHT, SPACE } from "../commons/constants";

export class Sword {
  constructor({
    swordResource,
    frameSize,
    hFrames,
    vFrames,
    position,
    direction,
  }) {
    this.sprite = new Sprite({
      resource: swordResource,
      frameSize,
      hFrames,
      vFrames,
      frame: 0,
    });
    this.position = position;
    this.direction = direction;
    // this.hFrame = hFrame;
    // this.vFrame = vFrame;
    this.drow = false;
    this.swordOffset = new Vector(0, 0);
    this.currentDirection = DOWN;
  }

  update(direction, isAt) {
    // if (!direction) return;
    if (direction) {
      this.currentDirection = direction;
    }
    if (isAt) {
      // if (this.currentDirection === DOWN) {
      //   this.sprite.frame = 0;
      //   this.swordOffset.x = -5;
      //   this.swordOffset.y = 7;
      // }
      this.drow = true;
      setTimeout(() => {
        this.drow = false;
      }, 300);
    }
    if (this.currentDirection === DOWN) {
      this.sprite.frame = 0;
      this.swordOffset.x = -5;
      this.swordOffset.y = 7;
    }
    if (this.currentDirection === UP) {
      this.sprite.frame = 3;
      this.swordOffset.x = 0;
      this.swordOffset.y = -21;
    }
    if (this.currentDirection === LEFT) {
      this.sprite.frame = 1;
      this.swordOffset.x = -21;
      this.swordOffset.y = -10;
    }
    if (this.currentDirection === RIGHT) {
      this.sprite.frame = 2;
      this.swordOffset.x = 5;
      this.swordOffset.y = -10;
    }
  }

  draw(ctx) {
    const drawX = this.position.x + this.swordOffset.x;
    const drawY = this.position.y + this.swordOffset.y;
    if (this.drow) {
      this.sprite.drawImage(ctx, drawX, drawY);
    }
  }

  drawRemote(ctx) {
    if (this.direction === DOWN) {
      this.sprite.frame = 0;
      this.swordOffset.x = -5;
      this.swordOffset.y = 7;
    }
    if (this.direction === UP) {
      this.sprite.frame = 3;
      this.swordOffset.x = 0;
      this.swordOffset.y = -21;
    }
    if (this.direction === LEFT) {
      this.sprite.frame = 1;
      this.swordOffset.x = -21;
      this.swordOffset.y = -10;
    }
    if (this.direction === RIGHT) {
      this.sprite.frame = 2;
      this.swordOffset.x = 5;
      this.swordOffset.y = -10;
    }

    const drawX = this.position.x + this.swordOffset.x;
    const drawY = this.position.y + this.swordOffset.y;
    // if (this.drow) {
    this.sprite.drawImage(ctx, drawX, drawY);
    // }
  }
}
