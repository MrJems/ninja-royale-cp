export class MobileControls {
  constructor(audioManager, input) {
    this.audioManager = audioManager;
    this.input = input;
  }

  initialize(gameLoop) {
    document.addEventListener("DOMContentLoaded", () => {
      const startScreen = document.getElementById("start-screen");
      const startButton = document.getElementById("start-button");

      startButton.addEventListener("click", () => {
        this.audioManager.playSound("bgMusic");
        startScreen.classList.add("hidden");
        setTimeout(() => {
          startScreen.style.display = "none";
          gameLoop.start();
        }, 1500);
      });

      const mobileControls = document.getElementById("mobile-controls");
      const canvasEl = document.getElementById("game-canvas");

      if (this.detectMobile()) {
        mobileControls.style.display = "flex";
        canvasEl.style.width = "100%";
        canvasEl.style.margin = 0;

        const fullscreenButton = document.getElementById("fullscreen");
        fullscreenButton.addEventListener("click", () => {
          const elem = document.documentElement;
          if (!document.fullscreenElement) {
            elem.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
        });

        const controls = {
          up: document.getElementById("up"),
          down: document.getElementById("down"),
          left: document.getElementById("left"),
          right: document.getElementById("right"),
          attack: document.getElementById("attack"),
        };

        const directions = {
          up: "UP",
          down: "DOWN",
          left: "LEFT",
          right: "RIGHT",
        };

        Object.keys(controls).forEach((key) => {
          controls[key].addEventListener("touchstart", () => {
            if (key === "attack") {
              this.audioManager.playSound("swordSound");
              this.input.isSpacePressed = true;
            } else {
              this.input.onArrowPressed(directions[key]);
            }
          });

          controls[key].addEventListener("touchend", () => {
            if (key === "attack") {
              this.input.isSpacePressed = false;
            } else {
              this.input.onArrowReleased(directions[key]);
            }
          });
        });
      } else {
        mobileControls.style.display = "none";
      }
    });
  }

  detectMobile() {
    const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i,
    ];
    return toMatch.some((toMatchItem) =>
      navigator.userAgent.match(toMatchItem)
    );
  }
}
