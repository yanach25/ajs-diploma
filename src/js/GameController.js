import themes from './themes';
import GameState from './GameState';
import Team from './Team';
import createNewLevel, { GAMER_TYPES, PC_TYPES } from './utils/create-new-level';
import cursors from './cursors';
import GamePlay from './GamePlay';
import PcController from './PcController';
import countCanAttack from './utils/can-attack';
import countCanStep from './utils/can-step';
import PLAYERS from './utils/players';
import types from './characters/types';
import timeout from './utils/timeout';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(Object.values(themes)[0]);

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGame.bind(this));

    if (!GameState.state) {
      this.loadState();
    }

    this.gamePlay.redrawPositions(GameState.state.team.players);
  }

  onNewGameClick() {
    if (GameState.state.disabled || GameState.state.player === PLAYERS.pc) {
      return;
    }

    this.createNewGame();
    this.gamePlay.redrawPositions(GameState.state.team.players);
    GamePlay.showMessage('New game started');
  }

  onCellClick(index) {
    if (GameState.state.disabled || GameState.state.player === PLAYERS.pc) {
      return;
    }

    const player = GameState.state.team.players.find((player) => player.position === index);

    if (GameState.state.selected !== null) { // если юзер выделен
      if (player) {
        const isGamer = GAMER_TYPES.some((item) => player.character instanceof item);
        const isPcGamer = PC_TYPES.some((item) => player.character instanceof item);
        // 1. попали в того же своего - пытаемся снять выделение
        if (index === player.position && index === GameState.state.selected) {
          this.gamePlay.deselectCell(index);
          GameState.state.selected = null;
        } else if (isGamer) { // 2. попали в другого своего - пытаемся выделять
          this.gamePlay.deselectCell(GameState.state.selected);
          GameState.state.selected = null;
          this.trySelectUser(index, player);
        } else if (isPcGamer && GameState.state.canAttack.includes(index)) {
          // 3. попали в чужого - пытаемся убить
          this.attack(GameState.state.selected, index).then(() => {
            this.gamePlay.deselectCell(GameState.state.selected);
            GameState.state.selected = null;
            this.gamePlay.deselectCell(index);
            this.gamePlay.setCursor(cursors.auto);
            this.gamePlay.redrawPositions(GameState.state.team.players);
            GameState.state.disabled = true;

            this.checkStepResults();
          });
        }
        // 4. попали в пустое поле - пытаемся ходить
      } else if (GameState.state.canStep.includes(index)) {
        const prev = GameState.state.selected;
        this.gamePlay.deselectCell(prev);
        const currSelected = GameState.state.team.players.find((item) => item.position === prev);
        currSelected.position = index;
        GameState.state.selected = null;
        this.gamePlay.redrawPositions(GameState.state.team.players);
        this.gamePlay.deselectCell(index);
        this.playByPc();
      }
    } else { // если не выделен юзер, пытаемся выделять
      this.trySelectUser(index, player);
    }
  }

  onCellEnter(index) {
    if (GameState.state.disabled || GameState.state.player === PLAYERS.pc) {
      return;
    }

    const player = GameState.state.team.players.find((player) => player.position === index);
    this.showTooltip(player, GameState.state.selected);
    this.setCursor(index, player);
    this.highlightCell(index);
  }

  onCellLeave(index) {
    if (GameState.state.disabled) {
      return;
    }

    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor(cursors.auto);
    if (GameState.state.selected !== null && GameState.state.selected !== index) {
      this.gamePlay.deselectCell(index);
    }
  }

  onSaveGameClick() {
    if (GameState.state.disabled || GameState.state.player === PLAYERS.pc) {
      return;
    }

    this.stateService.save(GameState.state);
    GamePlay.showMessage('Game saved');
  }

  onLoadGame() {
    if (GameState.state.disabled || GameState.state.player === PLAYERS.pc) {
      return;
    }

    this.loadState();
    this.gamePlay.redrawPositions(GameState.state.team.players);
    GamePlay.showMessage('Game loaded');
  }

  createNewGame() {
    const { gamerTeam, pcTeam } = createNewLevel(0, this.gamePlay.boardSize);
    const team = new Team();
    team.addPlayers([...pcTeam, ...gamerTeam]);

    GameState.state = {
      team,
      level: 0,
      player: PLAYERS.gamer,
      selected: null,
      canStep: [],
      canAttack: [],
      disabled: false,
      currentScores: 0,
      maxScores: GameState.state ? GameState.state.maxScores : 0,
    };

    this.stateService.save(GameState.state);
  }

  showTooltip(player, selected) {
    if (player && !selected) {
      const {
        level, attack, defence, health,
      } = player.character;
      this.gamePlay.showCellTooltip(`🎖${level} ⚔${attack} 🛡${defence} ❤${health}`, player.position);
    }
  }

  setCursor(index, player) {
    if (GameState.state.selected !== null) {
      if (GameState.state.canStep.includes(index)) {
        this.gamePlay.setCursor(cursors.pointer);
      } else {
        const isGamer = GAMER_TYPES.some((item) => player && player.character instanceof item);
        const isPcGamer = PC_TYPES.some((item) => player && player.character instanceof item);

        if (isGamer) {
          this.gamePlay.setCursor(cursors.pointer);
        } else if (isPcGamer) {
          if (GameState.state.canAttack.includes(index)) {
            this.gamePlay.setCursor(cursors.crosshair);
          } else {
            this.gamePlay.setCursor(cursors.notallowed);
          }
        }
      }
    } else if (player) {
      this.gamePlay.setCursor(cursors.pointer);
    }
  }

  highlightCell(index) {
    if (GameState.state.selected !== null) {
      if (GameState.state.canStep.includes(index)) {
        this.gamePlay.selectCell(index, 'green');
      }
      if (GameState.state.canAttack.includes(index)) {
        this.gamePlay.selectCell(index, 'red');
      }
    }
  }

  trySelectUser(index, player) {
    const isGamer = GAMER_TYPES.some((item) => player && player.character instanceof item);
    const isPcGamer = PC_TYPES.some((item) => player && player.character instanceof item);

    if (isGamer) {
      GameState.state.selected = index;
      this.gamePlay.selectCell(index);
      const filteringPositions = GameState.state.team.players.map((item) => item.position);
      GameState.state.canStep = countCanStep(
        index,
        player.character.stepDistance,
        this.gamePlay.boardSize,
        filteringPositions,
      );
      GameState.state.canAttack = countCanAttack(
        index,
        player.character.attackDistance,
        this.gamePlay.boardSize,
        PC_TYPES,
      );
    } else if (isPcGamer) {
      GamePlay.showError('You can not use this person');
    }
  }

  async attack(attackerIndex, targetIndex) {
    if (GameState.state.selected && GameState.state.disabled) {
      return;
    }

    GameState.state.disabled = true;

    const attacker = GameState.state.team.players
      .find((item) => item.position === attackerIndex).character;
    const target = GameState.state.team.players
      .find((item) => item.position === targetIndex).character;

    const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
    await this.gamePlay.showDamage(targetIndex, damage);

    let health = target.health - damage;

    health = health > 0 ? health : 0;

    target.health = health;

    if (target.health === 0) {
      GameState.state.team.remove(targetIndex);
    }
  }

  checkStepResults() {
    GameState.state.disabled = true;
    let gamerPlayers = GameState.state.team.players
      .map((item) => item.character)
      .filter((item) => GAMER_TYPES.some((type) => item instanceof type));

    const pcPlayers = GameState.state.team.players
      .map((item) => item.character)
      .filter((item) => PC_TYPES.some((type) => item instanceof type));

    if (gamerPlayers.length === 0) {
      GamePlay.showMessage(
        `You loose! Current scores: ${GameState.state.currentScores}, max scores: ${GameState.state.maxScores}`,
      );
      GameState.state.selected = null;
      GameState.state.disabled = false;
      GameState.state.player = PLAYERS.gamer;
      this.stateService.save(GameState.state);
    } else if (pcPlayers.length === 0) {
      // последний уровень - мы выиграли
      if (GameState.state.level === Object.keys(themes).length - 1) {
        GamePlay.showMessage(
          `You win! Current scores: ${GameState.state.currentScores}, max scores: ${GameState.state.maxScores}`,
        );
        GameState.state.maxScores = GameState.state.maxScores > GameState.state.currentScores
          ? GameState.state.maxScores
          : GameState.state.currentScores;
        GameState.state.selected = null;
        GameState.state.disabled = false;
        GameState.state.player = PLAYERS.gamer;

        this.stateService.save(GameState.state);
      } else { // иначе - новый уровень
        const currentScores = gamerPlayers
          .reduce((sum, current) => sum + current.health, GameState.state.currentScores);

        gamerPlayers = gamerPlayers.map((target) => {
          /* eslint-disable  no-param-reassign */
          target.level += 1;
          const health = target.health + 80;
          target.health = health > 100 ? 100 : health;
          const attackAfter = Math.max(target.attack, target.attack * (80 + target.health) / 100);
          const defenceAfter = Math.max(target.defence, target.defence * (80 + target.health) / 100);
          target.attack = attackAfter;
          target.defence = defenceAfter;
          /* eslint-enable  no-param-reassign */

          return target;
        });

        const level = GameState.state.level + 1;

        const { gamerTeam, pcTeam } = createNewLevel(level, this.gamePlay.boardSize, gamerPlayers);
        const team = new Team();
        team.addPlayers([...pcTeam, ...gamerTeam]);

        GameState.state = {
          team,
          level,
          selected: null,
          player: PLAYERS.gamer,
          canStep: [],
          canAttack: [],
          disabled: false,
          currentScores,
          maxScores: GameState.state.maxScores,
        };

        this.gamePlay.drawUi(Object.values(themes)[level]);
        this.gamePlay.redrawPositions(GameState.state.team.players);
      }
    } else { // играет комп
      this.playByPc();
    }
  }

  async playByPc() {
    GameState.state.player = PLAYERS.pc;
    GameState.state.disabled = true;
    this.pcController = new PcController(GameState.state.team.players, this.gamePlay.boardSize);
    const { result } = this.pcController;
    await timeout(500);
    // выделяем
    this.gamePlay.selectCell(result.start);
    // выделяем target
    await timeout(500);
    const color = result.type === 'step' ? 'green' : 'red';
    this.gamePlay.selectCell(result.end, color);
    // finish
    await timeout(500);
    if (result.type === 'step') {
      const player = GameState.state.team.players.find((item) => item.position === result.start);
      if (player) {
        player.position = result.end;
        this.gamePlay.redrawPositions(GameState.state.team.players);
        this.gamePlay.deselectCell(result.start);
        this.gamePlay.deselectCell(result.end);
      }
    } else {
      await this.attack(result.start, result.end);
      this.gamePlay.redrawPositions(GameState.state.team.players);
      this.gamePlay.deselectCell(result.start);
      this.gamePlay.deselectCell(result.end);
    }

    await timeout(50);
    const gamerPlayers = GameState.state.team.players
      .map((item) => item.character)
      .filter((item) => GAMER_TYPES.some((type) => item instanceof type));

    if (gamerPlayers.length === 0) {
      GamePlay.showMessage(
        `You loose! Current scores: ${GameState.state.currentScores}, max scores: ${GameState.state.maxScores}`,
      );
      GameState.state.selected = null;
      GameState.state.disabled = false;
      GameState.state.player = PLAYERS.gamer;
      this.stateService.save(GameState.state);
    } else {
      GameState.state.disabled = false;
      GameState.state.player = PLAYERS.gamer;
    }
  }

  loadState() {
    const state = this.stateService.load();
    if (state) {
      const team = new Team();
      const players = state.team.players.map((item) => {
        const {
          level,
          type,
          attack,
          attackDistance,
          defence,
          health,
          stepDistance,
        } = item.character;
        const PlayerType = types[type];
        const character = new PlayerType(level);
        character.attack = attack;
        character.attackDistance = attackDistance;
        character.defence = defence;
        character.health = health;
        character.stepDistance = stepDistance;
        return { character, position: item.position };
      });

      team.addPlayers(players);
      state.team = team;
      state.canStep = [];
      state.canAttack = [];
      state.selected = null;
      GameState.from(state);
    }

    if (!GameState.state) {
      this.createNewGame();
    }

    const gamerPlayers = GameState.state.team.players.filter((item) => GAMER_TYPES.some((type) => item instanceof type));
    const pcPlayers = GameState.state.team.players.filter((item) => PC_TYPES.some((type) => item instanceof type));

    if (GameState.state.level === Object.keys(themes).length - 1 && (gamerPlayers.length === 0 || pcPlayers.length === 0)) {
      this.createNewGame();
    }

    if (GameState.state.player === PLAYERS.pc) {
      this.playByPc();
    }
  }
}
