export class Boundary {
  constructor({ position, width = 15, height = 15 }) {
    this.position = position;
    this.width = width;
    this.height = height;
  }

  draw(ctx, offset) {
    // For debugging collision boxes
    ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
    ctx.fillRect(
      this.position.x + offset.x,
      this.position.y + offset.y,
      this.width,
      this.height
    );
  }
}
