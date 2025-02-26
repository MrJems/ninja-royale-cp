import { Sprite } from "../commons/Sprite";
import { Vector } from "../commons/Vector";

export class Heart {
  constructor({ hearResource, frameSize, hFrames, vFrames }) {
    this.sprite = new Sprite({
      resource: hearResource,
      frameSize,
      hFrames,
      vFrames,
      frame: 4,
    });
    this.position = new Vector(10, 5);
    this.maxHealth = 6;
    this.currentHealth = this.maxHealth;
    this.lastDamageTime = 0;
    this.damageCooldown = 500;
  }

  update(damagetype, currentTime) {
    if (
      damagetype === "SWORD" &&
      currentTime - this.lastDamageTime >= this.damageCooldown
    ) {
      this.currentHealth = Math.max(this.currentHealth - 2, 0);
      this.lastDamageTime = currentTime;
    }
    if (
      damagetype === "STAR" &&
      currentTime - this.lastDamageTime >= this.damageCooldown
    ) {
      this.currentHealth = Math.max(this.currentHealth - 1, 0);
      this.lastDamageTime = currentTime;
    }
  }

  draw(ctx) {
    const heartWidth = 17;
    for (let i = 0; i < this.maxHealth / 2; i++) {
      let frame;
      const heartHealth = this.currentHealth - i * 2;

      if (heartHealth >= 2) {
        frame = 4;
      } else if (heartHealth === 1) {
        frame = 2;
      } else {
        frame = 0;
      }

      this.sprite.frame = frame;
      this.sprite.drawImage(
        ctx,
        this.position.x + i * heartWidth,
        this.position.y
      );
    }
  }
}
