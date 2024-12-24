import { Sprite } from "../commons/sprite.js";
import { Vector } from "../commons/Vector.js";
import { DOWN, UP, LEFT, RIGHT } from "../commons/constants.js";

export class Ninja {
  constructor({
    spriteResource,
    frameSize,
    hFrames,
    vFrames,
    frameSequences,
    position,
    moveSpeed = 2,
  }) {
    this.sprite = new Sprite({
      resource: spriteResource,
      frameSize,
      hFrames,
      vFrames,
      frame: 0,
    });
    this.position = position;
    this.moveSpeed = moveSpeed;

    // Animation state
    this.frameSequences = frameSequences;
    this.currentDirection = DOWN;
    this.animationFrame = 0;
    this.animationCounter = 0;
    this.animationSpeed = 4;
  }

  update(direction, canMove, walk) {
    if (!direction) return;

    if (direction === DOWN && canMove) {
      if (this.position.y > 172) {
        return;
      }
      if (!walk) this.position.y += this.moveSpeed;
      this.currentDirection = DOWN;
    }
    if (direction === UP && canMove) {
      if (this.position.y < 8) {
        return;
      }
      if (!walk) this.position.y -= this.moveSpeed;
      this.currentDirection = UP;
    }
    if (direction === LEFT && canMove) {
      if (this.position.x < 8) {
        return;
      }
      if (!walk) this.position.x -= this.moveSpeed;
      this.currentDirection = LEFT;
    }
    if (direction === RIGHT && canMove) {
      if (this.position.y > 312) {
        return;
      }
      if (!walk) this.position.x += this.moveSpeed;
      this.currentDirection = RIGHT;
    }

    this.animateHero(this.frameSequences[this.currentDirection]);
  }

  animateHero(sequence) {
    this.animationCounter++;
    if (this.animationCounter >= this.animationSpeed) {
      this.animationCounter = 0;
      this.animationFrame = (this.animationFrame + 1) % sequence.length;
    }
    this.sprite.frame = sequence[this.animationFrame];
  }

  draw(ctx) {
    const heroOffset = new Vector(-8, -8);
    const drawX = this.position.x + heroOffset.x;
    const drawY = this.position.y + heroOffset.y;

    this.sprite.drawImage(ctx, drawX, drawY);
  }
}
