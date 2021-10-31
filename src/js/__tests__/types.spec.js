import types from '../characters/types';
import allowedTypes from '../characters/allowed-types';
import Swordsman from '../characters/Swordsman';

test('should have right type', () => {
  expect(types[allowedTypes.swordsman]).toBe(Swordsman);
});
