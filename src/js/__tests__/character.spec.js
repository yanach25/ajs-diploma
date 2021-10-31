import Character from '../Character';
import Bowman from '../characters/Bowman';

test('character', () => {
  expect(() => new Character(1)).toThrow();
  expect(() => new Bowman(1)).not.toThrow();
});
