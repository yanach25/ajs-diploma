/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
import getRandomInt from './utils/get-random-int';

export function* characterGenerator(allowedTypes, maxLevel) {
  const level = getRandomInt(1, maxLevel);
  const NewType = allowedTypes[getRandomInt(0, allowedTypes.length)];

  yield new NewType(level);
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const team = [];

  for (let i = 0; i < characterCount; i++) {
    const gen = characterGenerator(allowedTypes, maxLevel);
    team.push(gen.next().value);
  }

  return team;
}
