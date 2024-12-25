export function rectangularCollision(
  ninjaPos,
  ninjaSize,
  boundaryPos,
  boundarySize,
  worldOffset
) {
  ninjaSize /= 2;

  const heroLeft = ninjaPos.x;
  const heroRight = ninjaPos.x + ninjaSize;
  const heroTop = ninjaPos.y;
  const heroBottom = ninjaPos.y + ninjaSize;

  const boundaryLeft = boundaryPos.x + worldOffset.x + 2;
  const boundaryRight = boundaryLeft + boundarySize.width + 5;
  const boundaryTop = boundaryPos.y + worldOffset.y;
  const boundaryBottom = boundaryTop + boundarySize.height + 5;

  return (
    heroRight > boundaryLeft &&
    heroLeft < boundaryRight &&
    heroBottom > boundaryTop &&
    heroTop < boundaryBottom
  );
}

export function isColliding(r1, r2) {
  console.log("in");
  return (
    r1.x < r2.x + r2.width && // r1's left edge is left of r2's right edge
    r1.x + r1.width > r2.x && // r1's right edge is right of r2's left edge
    r1.y < r2.y + r2.height && // r1's top edge is above r2's bottom edge
    r1.y + r1.height > r2.y // r1's bottom edge is below r2's top edge
  );
}
