import { generateTeam } from '../generators';
import PositionedCharacter from '../PositionedCharacter';
import getRandomInt from './get-random-int';
import Bowman from '../characters/Bowman';
import Swordsman from '../characters/Swordsman';
import Magician from '../characters/Magician';
import Undead from '../characters/Undead';
import Daemon from '../characters/Daemon';
import Vampire from '../characters/Vampire';

export const GAMER_TYPES = [Bowman, Swordsman, Magician];
export const PC_TYPES = [Undead, Daemon, Vampire];

export function createNewField(boardSize) {
  return new Array(boardSize * boardSize)
    .fill(null)
    .map((_, index) => index);
}

function createNewPositionedTeam(
  allowedTypes,
  positions,
  maxLevel,
  characterCount,
  initialTeam = [],
) {
  const team = [...initialTeam, ...generateTeam(allowedTypes, maxLevel, characterCount)];

  return team.map((player) => {
    const position = getRandomInt(0, positions.length);
    const pos = positions[position];
    positions.splice(position, 1);

    return new PositionedCharacter(player, pos);
  });
}

function getGamerPositions(boardSize) {
  return createNewField(boardSize)
    .filter((index) => index < boardSize * 2);
}

function getPcPositions(boardSize) {
  return createNewField(boardSize)
    .filter((index) => index > boardSize ** 2 - boardSize * 2);
}

export default function createNewLevel(level, boardSize, initialTeam = []) {
  const gamerPositions = getGamerPositions(boardSize);
  const pcPositions = getPcPositions(boardSize);
  let gamerTeam;
  let pcTeam;

  switch (level) {
    case 0:
      gamerTeam = createNewPositionedTeam([Bowman, Swordsman], gamerPositions, level + 1, 2);
      pcTeam = createNewPositionedTeam(PC_TYPES, pcPositions, level + 1, 2);
      break;
    case 1:
      gamerTeam = createNewPositionedTeam(GAMER_TYPES, gamerPositions, level + 1, 1, initialTeam);
      pcTeam = createNewPositionedTeam(PC_TYPES, pcPositions, level + 1, gamerTeam.length);
      break;
    case 2:
    case 3:
      gamerTeam = createNewPositionedTeam(GAMER_TYPES, gamerPositions, level + 1, 2, initialTeam);
      pcTeam = createNewPositionedTeam(PC_TYPES, pcPositions, level + 1, gamerTeam.length);
      break;
    default:
      break;
  }

  return { gamerTeam, pcTeam };
}
