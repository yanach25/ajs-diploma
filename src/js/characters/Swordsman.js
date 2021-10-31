import Character from '../Character';
import allowedTypes from './allowed-types';
import attackDefenceConfig from './attack-defence.config';

export default class Swordsman extends Character {
  constructor(args) {
    super(args);
    this.type = allowedTypes.swordsman;
    const {
      attack, defence, stepDistance, attackDistance,
    } = attackDefenceConfig[allowedTypes.swordsman];
    this.attack = attack;
    this.defence = defence;
    this.stepDistance = stepDistance;
    this.attackDistance = attackDistance;
  }
}
