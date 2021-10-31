import countCorners from './count-corners';
import GameState from '../GameState';

export default function countCanAttack(index, radius, boardSize, enemyTypes) {
  const {
    leftCorner, rightCorner, topCorner, bottomCorner,
  } = countCorners(index, boardSize);
  const left = Math.min(radius, leftCorner);
  const right = Math.min(radius, rightCorner);
  let top = Math.min(radius, topCorner);
  let bottom = Math.min(radius, bottomCorner);

  const canAttack = [];

  const currentStart = index - left;
  const currentEnd = index + right;

  const middleLine = [];

  for (let i = currentStart; i <= currentEnd; i++) {
    middleLine.push(i);
  }

  canAttack.push(...middleLine);

  /* eslint-disable no-loop-func */
  while (top > 0) {
    middleLine.forEach((item) => {
      canAttack.push(item - boardSize * top);
    });

    top--;
  }

  while (bottom > 0) {
    middleLine.forEach((item) => {
      canAttack.push(item + boardSize * bottom);
    });

    bottom--;
  }

  const playerPositions = GameState.state.team.players
    .filter((item) => enemyTypes.some((type) => item.character instanceof type))
    .map((item) => item.position);

  return canAttack
    .sort((a, b) => Math.sign(a - b))
    .filter((item) => playerPositions.includes(item));
}
