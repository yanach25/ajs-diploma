import PositionedCharacter from '../PositionedCharacter';
import Undead from '../characters/Undead';

test('should create positioned character', () => {
  expect(() => new PositionedCharacter({}, 1)).toThrow('character must be instance of Character or its children');
  expect(() => new PositionedCharacter(new Undead(1), '1')).toThrow('position must be a number');

  const undead = new PositionedCharacter(new Undead(1), 2);
  expect(undead.character).toBeInstanceOf(Undead);
  expect(undead.position).toBe(2);
});
