import { Sprite } from "../commons/Sprite";
import { Vector } from "../commons/Vector";
import { UP, DOWN, LEFT, RIGHT, SPACE } from "../commons/constants";

export class NinjaStar {
  constructor({
    ninjaStarResource,
    frameSize,
    hFrames,
    vFrames,
    position,
    direction,
  }) {
    this.sprite = new Sprite({
      resource: ninjaStarResource,
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
    this.ninjaStarOffset = new Vector(0, 0);
    this.currentDirection = DOWN;
  }
  update() {}

  draw(ctx) {
    const drawX = this.position.x + this.ninjaStarOffset.x;
    const drawY = this.position.y + this.ninjaStarOffset.y;
    if (this.drow) {
      this.sprite.drawImage(ctx, drawX, drawY);
    }
  }

  drawRemote(ctx) {}
}
