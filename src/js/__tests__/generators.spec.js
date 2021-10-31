import { generateTeam } from '../generators';
import Character from '../Character';
import { GAMER_TYPES } from '../utils/create-new-level';

test('generators', () => {
  const team = generateTeam(GAMER_TYPES, 2, 100);
  expect(team.length).toBe(100);
  expect(team[0] instanceof Character).toBeTruthy();
});
