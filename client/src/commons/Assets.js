class Assets {
  constructor() {
    this.toLoad = {
      worldmap: "/world/worldmap.png",
      player1: "/player.png",
      shadow: "/shadow.png",
      treeoverlay: "/world/treemap.png",
      sword: "/swordsprite.png",
      life: "/heart.png",
    };

    this.images = {};

    Object.keys(this.toLoad).forEach((key) => {
      const img = new Image();
      img.src = this.toLoad[key];
      this.images[key] = {
        image: img,
        isLoaded: false,
      };
      img.onload = () => {
        this.images[key].isLoaded = true;
      };
    });
  }
}

export const assets = new Assets();
