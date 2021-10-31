import countCorners from './count-corners';

export default function countCanStep(index, radius, boardSize, filteringPositions) {
  const {
    leftCorner, rightCorner, topCorner, bottomCorner,
  } = countCorners(index, boardSize);
  const left = Math.min(radius, leftCorner);
  const right = Math.min(radius, rightCorner);
  const top = Math.min(radius, topCorner);
  const bottom = Math.min(radius, bottomCorner);
  const leftTop = Math.min(left, top);
  const rightTop = Math.min(right, top);
  const leftBottom = Math.min(left, bottom);
  const rightBottom = Math.min(right, bottom);

  const canStep = [];
  // go left
  for (let i = index - left; i < index; i++) {
    canStep.push(i);
  }

  // go right
  for (let i = index + 1; i <= index + right; i++) {
    canStep.push(i);
  }

  // go top
  let topCopy = top;
  while (topCopy > 0) {
    canStep.push(index - boardSize * topCopy);
    topCopy -= 1;
  }

  // go bottom
  let bottomCopy = bottom;
  while (bottomCopy > 0) {
    canStep.push(index + boardSize * bottomCopy);
    bottomCopy -= 1;
  }

  // go left-top
  let leftTopCopy = leftTop;
  while (leftTopCopy > 0) {
    canStep.push(index - leftTopCopy - boardSize * leftTopCopy);
    leftTopCopy--;
  }

  // go rightTop
  let rightTopCopy = rightTop;
  while (rightTopCopy > 0) {
    canStep.push(index + rightTopCopy - boardSize * rightTopCopy);
    rightTopCopy--;
  }

  // go leftBottom
  let leftBottomCopy = leftBottom;
  while (leftBottomCopy > 0) {
    canStep.push(index - leftBottomCopy + boardSize * leftBottomCopy);
    leftBottomCopy--;
  }

  // go leftBottom
  let rightBottomCopy = rightBottom;
  while (rightBottomCopy > 0) {
    canStep.push(index + rightBottomCopy + boardSize * rightBottomCopy);
    rightBottomCopy--;
  }

  return canStep
    .sort((a, b) => Math.sign(a - b))
    .filter((item) => !filteringPositions.includes(item));
}
