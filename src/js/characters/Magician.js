import Character from '../Character';
import allowedTypes from './allowed-types';
import attackDefenceConfig from './attack-defence.config';

export default class Magician extends Character {
  constructor(args) {
    super(args);
    this.type = allowedTypes.magician;
    const {
      attack, defence, stepDistance, attackDistance,
    } = attackDefenceConfig[allowedTypes.magician];
    this.attack = attack;
    this.defence = defence;
    this.stepDistance = stepDistance;
    this.attackDistance = attackDistance;
  }
}
