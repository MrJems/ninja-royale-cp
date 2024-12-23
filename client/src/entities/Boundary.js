export class Boundary {
  constructor({ position, width = 16, height = 16 }) {
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

// const boundaries = [];

// collisions.forEach((row, i) => {
//   row.forEach((symbol, j) => {
//     if (symbol !== 0) {
//       boundaries.push(
//         new Boundary({
//           position: {
//             x: j * 16,
//             y: i * 16,
//           },
//         })
//       );
//     }
//   });
// });

// export default boundaries;
