import { Sprite } from "../commons/Sprite";
import { Vector } from "../commons/Vector";
import { UP, DOWN, LEFT, RIGHT } from "../commons/constants";

export class NinjaStar {
  constructor({
    ninjaStarResource,
    frameSize,
    hFrames,
    vFrames,
    position,
    direction,
    starId,
    speed = 4,
  }) {
    this.sprite = new Sprite({
      resource: ninjaStarResource,
      frameSize,
      hFrames,
      vFrames,
      frame: 0,
    });

    this.starId = starId;
    this.position = new Vector(position.x, position.y);
    this.direction = direction;
    this.speed = speed;
    this.velocity = new Vector(0, 0);
    switch (direction) {
      case UP:
        this.velocity.y = -speed;
        break;
      case DOWN:
        this.velocity.y = speed;
        break;
      case LEFT:
        this.velocity.x = -speed;
        break;
      case RIGHT:
        this.velocity.x = speed;
        break;
    }

    // if (direction === UP)    this.sprite.frame = 0;
    // if (direction === RIGHT) this.sprite.frame = 1;
    // if (direction === DOWN)  this.sprite.frame = 2;

    this.activeRemote = true;
    this.active = true;
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
  // draw(ctx, offset) {
  //   if (!this.active) return;

  //   const drawX = this.position.x - offset.x - 8;
  //   const drawY = this.position.y - offset.y - 8;
  //   this.sprite.drawImage(ctx, drawX, drawY);
  // }

  draw(ctx) {
    if (!this.active) return;

    ctx.save();
    ctx.filter = `contrast(200%) saturate(200%)`;

    const drawX = this.position.x - 8;
    const drawY = this.position.y - 8;
    this.sprite.drawImage(ctx, drawX, drawY);
    ctx.restore();
  }

  drawRemote(ctx, x, y) {
    if (!this.active) return;
    const drawX = this.position.x - 8 + x;
    const drawY = this.position.y - 8 + y;
    this.sprite.drawImage(ctx, drawX, drawY);
  }
  // draw(ctx, offset) {
  //   if (!this.active) return;

  //   // If this.position is in world coords, we do:
  //   const drawX = this.position.x - offset.x - 8;
  //   const drawY = this.position.y - offset.y - 8;
  //   this.sprite.drawImage(ctx, drawX, drawY);
  // }
}
