import Character from '../Character';
import allowedTypes from './allowed-types';
import attackDefenceConfig from './attack-defence.config';

export default class Undead extends Character {
  constructor(args) {
    super(args);
    this.type = allowedTypes.undead;
    const {
      attack, defence, stepDistance, attackDistance,
    } = attackDefenceConfig[allowedTypes.undead];
    this.attack = attack;
    this.defence = defence;
    this.stepDistance = stepDistance;
    this.attackDistance = attackDistance;
  }
}
