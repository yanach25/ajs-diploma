import { calcHealthLevel, calcTileType } from '../utils';

test('calcTileType', () => {
  expect(calcTileType(0, 8)).toBe('top-left');
  expect(calcTileType(1, 8)).toBe('top');
  expect(calcTileType(7, 8)).toBe('top-right');
  expect(calcTileType(8, 8)).toBe('left');
  expect(calcTileType(15, 8)).toBe('right');
  expect(calcTileType(63, 8)).toBe('bottom-right');
  expect(calcTileType(56, 8)).toBe('bottom-left');
  expect(calcTileType(57, 8)).toBe('bottom');
  expect(calcTileType(9, 8)).toBe('center');
});

test('calcHealthLevel', () => {
  expect(calcHealthLevel(9)).toBe('critical');
  expect(calcHealthLevel(40)).toBe('normal');
  expect(calcHealthLevel(51)).toBe('high');
});
