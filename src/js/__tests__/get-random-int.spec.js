import getRandomInt from '../utils/get-random-int';

test('getRandomInt', () => {
  const int = getRandomInt(0, 2);
  const rightResult = int === 0 || int === 1;
  expect(rightResult).toBeTruthy();
  expect(Number.isInteger(int)).toBeTruthy();

  const int2 = getRandomInt(1, 1);
  expect(int2).toBe(1);
});
