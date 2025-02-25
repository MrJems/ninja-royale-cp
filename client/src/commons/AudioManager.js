export class AudioManager {
  constructor() {
    this.sounds = {
      bgMusic: new Audio("/backgroundmusic.mp3"),
      gameoverMusic: new Audio("/gameover.wav"),
      swordSound: new Audio("/sword-sound.mp3"),
    };

    this.sounds.bgMusic.loop = true;
    this.sounds.bgMusic.volume = 0.2;

    this.sounds.gameoverMusic.volume = 0.5;
    this.sounds.swordSound.volume = 1.0;
  }

  playSound(name) {
    if (this.sounds[name]) {
      this.sounds[name].currentTime = 0;
      this.sounds[name].play();
    } else {
      console.warn(`Sound "${name}" not found.`);
    }
  }

  stopSound(name) {
    if (this.sounds[name]) {
      this.sounds[name].pause();
      this.sounds[name].currentTime = 0;
    } else {
      console.warn(`Sound "${name}" not found.`);
    }
  }

  setVolume(name, volume) {
    if (this.sounds[name]) {
      this.sounds[name].volume = volume;
    } else {
      console.warn(`Sound "${name}" not found.`);
    }
  }

  toggleMute(name) {
    if (this.sounds[name]) {
      this.sounds[name].muted = !this.sounds[name].muted;
    } else {
      console.warn(`Sound "${name}" not found.`);
    }
  }
}
