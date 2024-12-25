import { Sprite } from "../commons/Sprite";
import { Vector } from "../commons/Vector";

export class DeadChar {
  constructor({ Resource, frameSize, hFrames, vFrames, position }) {
    this.sprite = new Sprite({
      resource: Resource,
      frameSize,
      hFrames,
      vFrames,
      frame: 11,
    });
    this.position = position;
  }
  draw(ctx) {
    const heroOffset = new Vector(-8, -8);
    const drawX = this.position.x + heroOffset.x;
    const drawY = this.position.y + heroOffset.y;

    this.sprite.drawImage(ctx, drawX, drawY);
  }
}
