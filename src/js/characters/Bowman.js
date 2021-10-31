import Character from '../Character';
import allowedTypes from './allowed-types';
import attackDefenceConfig from './attack-defence.config';

export default class Bowman extends Character {
  constructor(args) {
    super(args);
    this.type = allowedTypes.bowman;
    const {
      attack, defence, stepDistance, attackDistance,
    } = attackDefenceConfig[allowedTypes.bowman];
    this.attack = attack;
    this.defence = defence;
    this.stepDistance = stepDistance;
    this.attackDistance = attackDistance;
  }
}
