export default class Team {
  constructor() {
    this.players = [];
  }

  addPlayers(players) {
    this.players = [...this.players, ...players];
  }

  remove(index) {
    const indexOfPlayer = this.players.findIndex((player) => player.position === index);
    this.players.splice(indexOfPlayer, 1);
  }
}
