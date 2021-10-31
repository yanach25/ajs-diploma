import Undead from '../characters/Undead';
import Daemon from '../characters/Daemon';
import Vampire from '../characters/Vampire';

test('character', () => {
  const daemon = new Daemon(1);

  expect(daemon).toEqual({
    attack: 10, attackDistance: 4, defence: 40, health: 50, level: 1, stepDistance: 1, type: 'daemon',
  });

  const undead = new Undead(2);
  expect(undead).toEqual({
    attack: 40, attackDistance: 1, defence: 10, health: 50, level: 2, stepDistance: 4, type: 'undead',
  });

  const vampire = new Vampire(2);
  expect(vampire).toEqual({
    attack: 25, attackDistance: 2, defence: 25, health: 50, level: 2, stepDistance: 2, type: 'vampire',
  });
});
