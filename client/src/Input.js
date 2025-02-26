import { UP, DOWN, LEFT, RIGHT, SPACE } from "./commons/constants";
import { AudioManager } from "./commons/AudioManager";
export class Input {
  constructor() {
    const audioManager = new AudioManager();

    this.heldDirections = [];
    this.isSpacePressed = false;

    this.isXPressed = false;
    this.justPressedX = false;

    document.addEventListener("keydown", (e) => {
      if (e.code === "ArrowUp" || e.code === "KeyW") {
        this.onArrowPressed(UP);
      }
      if (e.code === "ArrowDown" || e.code === "KeyS") {
        this.onArrowPressed(DOWN);
      }
      if (e.code === "ArrowLeft" || e.code === "KeyA") {
        this.onArrowPressed(LEFT);
      }
      if (e.code === "ArrowRight" || e.code === "KeyD") {
        this.onArrowPressed(RIGHT);
      }
      if (e.key == " " || e.code == "Space") {
        audioManager.playSound("swordSound");
        this.isSpacePressed = true;
      }

      // Listen for "X" key to throw NinjaStar
      if (e.code === "KeyX") {
        // If you want only once per press:
        if (!this.isXPressed) {
          this.justPressedX = true; // We'll use this to spawn one star
        }
        this.isXPressed = true;
      }
    });

    document.addEventListener("keyup", (e) => {
      if (e.code === "ArrowUp" || e.code === "KeyW") {
        this.onArrowReleased(UP);
      }
      if (e.code === "ArrowDown" || e.code === "KeyS") {
        this.onArrowReleased(DOWN);
      }
      if (e.code === "ArrowLeft" || e.code === "KeyA") {
        this.onArrowReleased(LEFT);
      }
      if (e.code === "ArrowRight" || e.code === "KeyD") {
        this.onArrowReleased(RIGHT);
      }
      if (e.key == " " || e.code == "Space") {
        this.isSpacePressed = false;
      }

      if (e.code === "KeyX") {
        this.isXPressed = false;
      }
    });
  }

  get direction() {
    return this.heldDirections[0];
  }

  get isAttacking() {
    return this.isSpacePressed;
  }

  consumeXPress() {
    if (this.justPressedX) {
      this.justPressedX = false;
      return true;
    }
    return false;
  }

  onArrowPressed(direction) {
    if (this.heldDirections.indexOf(direction) === -1) {
      this.heldDirections.unshift(direction);
    }
  }

  onArrowReleased(direction) {
    const index = this.heldDirections.indexOf(direction);
    if (index === -1) {
      return;
    }
    this.heldDirections.splice(index, 1);
  }
}
