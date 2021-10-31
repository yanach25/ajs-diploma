import Swordsman from './Swordsman';
import Bowman from './Bowman';
import Magician from './Magician';
import Daemon from './Daemon';
import Undead from './Undead';
import Vampire from './Vampire';
import allowedTypes from './allowed-types';

const types = {
  [allowedTypes.swordsman]: Swordsman,
  [allowedTypes.bowman]: Bowman,
  [allowedTypes.magician]: Magician,
  [allowedTypes.daemon]: Daemon,
  [allowedTypes.undead]: Undead,
  [allowedTypes.vampire]: Vampire,
};

export default types;
