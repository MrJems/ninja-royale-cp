// src/commons/collision.js

// export function rectangularCollision(
//   ninjaPos,
//   ninjaSize,
//   boundaryPos,
//   boundarySize,
//   worldOffset
// ) {
//   // console.log(ninjaPos, boundaryPos, worldOffset);
//   // Adjust positions by the world offset
//   const ninjaX = ninjaPos.x + Math.abs(worldOffset.x);
//   const ninjaY = ninjaPos.y + Math.abs(worldOffset.y);

//   // Example "padding" if you need it
//   const w = ninjaSize / 2;

//   return (
//     ninjaX + w >= boundaryPos.x &&
//     ninjaX - w <= boundaryPos.x + boundarySize.width &&
//     ninjaY + w >= boundaryPos.y &&
//     ninjaY - w <= boundaryPos.y + boundarySize.height
//   );
// }

export function rectangularCollision(
  ninjaPos, // hero's screen coords
  ninjaSize,
  boundaryPos, // boundary’s map coords
  boundarySize,
  worldOffset
) {
  ninjaSize /= 2;
  // The hero's bounding box
  // If heroPos is top-left, no half-size offset needed. If heroPos is center,
  // subtract half-size.  Let's assume top-left for clarity:
  const heroLeft = ninjaPos.x;
  const heroRight = ninjaPos.x + ninjaSize;
  const heroTop = ninjaPos.y;
  const heroBottom = ninjaPos.y + ninjaSize;

  // Convert boundary (map) → boundary (screen)
  const boundaryLeft = boundaryPos.x + worldOffset.x;
  const boundaryRight = boundaryLeft + boundarySize.width + 8;
  const boundaryTop = boundaryPos.y + worldOffset.y;
  const boundaryBottom = boundaryTop + boundarySize.height + 5;

  return (
    heroRight > boundaryLeft &&
    heroLeft < boundaryRight &&
    heroBottom > boundaryTop &&
    heroTop < boundaryBottom
  );
}
