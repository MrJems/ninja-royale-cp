import { Sprite } from "../commons/Sprite";
import { Vector } from "../commons/Vector";

export class Gameover {
  constructor({ Resource, frameSize, hFrames, vFrames }) {
    this.sprite = new Sprite({
      resource: Resource,
      frame: 0,
      frameSize,
      hFrames,
      vFrames,
    });
    this.position = new Vector(-10, -10);
  }

  draw(ctx) {
    const drawX = this.position.x;
    const drawY = this.position.y;
    this.sprite.drawImage(ctx, 0, 0);
  }
}
