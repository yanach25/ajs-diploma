import allowedTypes from './allowed-types';

const attackDefenceConfig = {
  [allowedTypes.bowman]: {
    attack: 25, defence: 25, stepDistance: 2, attackDistance: 2,
  },
  [allowedTypes.swordsman]: {
    attack: 40, defence: 10, stepDistance: 4, attackDistance: 1,
  },
  [allowedTypes.magician]: {
    attack: 10, defence: 40, stepDistance: 1, attackDistance: 4,
  },
  [allowedTypes.vampire]: {
    attack: 25, defence: 25, stepDistance: 2, attackDistance: 2,
  },
  [allowedTypes.undead]: {
    attack: 40, defence: 10, stepDistance: 4, attackDistance: 1,
  },
  [allowedTypes.daemon]: {
    attack: 10, defence: 40, stepDistance: 1, attackDistance: 4,
  },
};

export default attackDefenceConfig;
