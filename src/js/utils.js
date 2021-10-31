export function calcTileType(index, boardSize) {
  if (index > 0 && index < boardSize - 1) {
    return 'top';
  }

  const bottomEnd = boardSize * boardSize;
  const bottomStart = bottomEnd - boardSize;

  if (index === 0) {
    return 'top-left';
  }

  if (index === boardSize - 1) {
    return 'top-right';
  }

  if (index === bottomEnd - 1) {
    return 'bottom-right';
  }

  if (index === bottomStart) {
    return 'bottom-left';
  }

  if (index > bottomStart && index < bottomEnd) {
    return 'bottom';
  }

  if (index % boardSize === 0) {
    return 'left';
  }

  if (index % boardSize === boardSize - 1) {
    return 'right';
  }

  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
