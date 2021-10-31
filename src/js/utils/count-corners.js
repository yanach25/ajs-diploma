export default function countCorners(index, boardSize) {
  const leftCorner = index % boardSize;
  const rightCorner = boardSize - leftCorner - 1;
  const topCorner = Math.trunc(index / boardSize);
  const bottomCorner = boardSize - topCorner - 1;

  return {
    leftCorner, rightCorner, topCorner, bottomCorner,
  };
}
