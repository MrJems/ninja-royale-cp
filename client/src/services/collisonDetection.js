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
