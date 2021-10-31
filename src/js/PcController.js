import { GAMER_TYPES, PC_TYPES } from './utils/create-new-level';
import countCanAttack from './utils/can-attack';
import countCanStep from './utils/can-step';
import GameState from './GameState';

export default class PcController {
  constructor(players, boardSize) {
    this.players = players;
    this.boardSize = boardSize;
    this.pcPlayers = players.filter((player) => PC_TYPES.some((type) => player.character instanceof type));
    this.gamerPlayers = players.filter((player) => GAMER_TYPES.some((type) => player.character instanceof type));
    this.result = {};

    this.init();
  }

  init() {
    const result = this.findCanAttack();

    if (result.listOfAttacked.length > 0) {
      this.result = { start: result.player.position, end: result.listOfAttacked[0], type: 'attack' };
    } else {
      this.findBestWay(this.findClosestPlayer());
    }

    return this;
  }

  findCanAttack() {
    let count = this.pcPlayers.length - 1;
    let listOfAttacked = [];
    let player;
    while (count >= 0) {
      player = this.pcPlayers[count];
      listOfAttacked = countCanAttack(player.position, player.character.attackDistance, this.boardSize, GAMER_TYPES);
      if (listOfAttacked.length > 0) {
        count = 0;
      }
      count--;
    }

    return { listOfAttacked, player };
  }

  findClosestPlayer() {
    let result = {};
    let square = Infinity;

    this.pcPlayers.forEach((pcPlayer) => {
      this.gamerPlayers.forEach((gamerPlayer) => {
        const pcPlayerRow = Math.trunc(pcPlayer.position / this.boardSize);
        const gamerPlayerRow = Math.trunc(gamerPlayer.position / this.boardSize);

        const height = Math.abs(pcPlayerRow - gamerPlayerRow);

        const pcPlayerCol = pcPlayer.position % this.boardSize;
        const gamerPlayerCol = gamerPlayer.position % this.boardSize;

        const width = Math.abs(pcPlayerCol - gamerPlayerCol);

        const countedSquare = height * width;

        if (countedSquare < square) {
          result = { pcPlayer, gamerPlayer };
          square = countedSquare;
        }
      });
    });

    return result;
  }

  findBestWay(initial) {
    const gamePlayerRow = Math.trunc(initial.gamerPlayer.position / this.boardSize);
    const gamePlayerCol = initial.gamerPlayer.position % this.boardSize;

    const filteringPositions = GameState.state.team.players.map((item) => item.position);
    const canStepList = countCanStep(initial.pcPlayer.position, initial.pcPlayer.character.stepDistance, this.boardSize, filteringPositions);

    const weightedCanStepList = canStepList.map((index) => {
      const pcPlayerRow = Math.trunc(index / this.boardSize);
      const pcPlayerCol = index % this.boardSize;

      const height = Math.abs(pcPlayerRow - gamePlayerRow);
      const width = Math.abs(pcPlayerCol - gamePlayerCol);
      return { index, empiricPath: height + width };
    });

    const empiricPaths = weightedCanStepList.map((item) => item.empiricPath);
    const minimal = Math.min(...empiricPaths);
    const endIndex = weightedCanStepList.find((item) => item.empiricPath === minimal).index;
    this.result = { start: initial.pcPlayer.position, end: endIndex, type: 'step' };
  }
}
