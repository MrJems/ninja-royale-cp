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
  return (
    r1.x < r2.x + r2.width &&
    r1.x + r1.width > r2.x &&
    r1.y < r2.y + r2.height &&
    r1.y + r1.height > r2.y
  );
}
