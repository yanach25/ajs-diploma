import Character from '../Character';
import allowedTypes from './allowed-types';
import attackDefenceConfig from './attack-defence.config';

export default class Daemon extends Character {
  constructor(args) {
    super(args);
    this.type = allowedTypes.daemon;
    const {
      attack, defence, stepDistance, attackDistance,
    } = attackDefenceConfig[allowedTypes.daemon];
    this.attack = attack;
    this.defence = defence;
    this.stepDistance = stepDistance;
    this.attackDistance = attackDistance;
  }
}
