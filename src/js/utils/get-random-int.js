/* eslint-disable no-param-reassign */
export default function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  if (max === min) {
    return min;
  }

  return Math.floor(Math.random() * (max - min)) + min;
}
