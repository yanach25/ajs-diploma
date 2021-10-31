import GameController from '../GameController';
import GameStateService from '../GameStateService';
import GameState from '../GameState';
import GamePlay from '../GamePlay';
import PLAYERS from '../utils/players';
import cursors from '../cursors';

const localStorageMock = (function() {
  let store = {};

  return {
    getItem: function(key) {
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    }
  };

})();

describe('game controller', () => {
  let gameController;
  let gamePlay;
  let stateService;

  beforeEach(() => {
    gamePlay = {
      addCellEnterListener: jest.fn(),
      drawUi: jest.fn(),
      addCellLeaveListener: jest.fn(),
      addCellClickListener: jest.fn(),
      addNewGameListener: jest.fn(),
      addSaveGameListener: jest.fn(),
      addLoadGameListener: jest.fn(),
      boardSize: 8,
      redrawPositions: jest.fn(),
      showCellTooltip: jest.fn(),
      hideCellTooltip: jest.fn(),
      setCursor: jest.fn(),
      deselectCell: jest.fn(),
      showMessage: jest.fn(),
      selectCell: jest.fn(),
      showDamage: jest.fn(),
      onLoadGameClick: jest.fn(),
    };
    stateService = new GameStateService(localStorageMock);
    gameController = new GameController(gamePlay, stateService);
  });

  it('should create game controller', () => {
    expect(gameController).toBeDefined();
  });

  it('should call draw ui', () => {
    jest.spyOn(gamePlay, 'addCellEnterListener');
    const gc = new GameController(gamePlay, stateService);

    gc.init();
    expect(gamePlay.addCellEnterListener).toHaveBeenCalled();
  });

  it('should process onNewGameClick', () => {
    window.alert = jest.fn();
    jest.spyOn(gameController, 'createNewGame');
    gameController.onNewGameClick();

    expect(gameController.createNewGame).toHaveBeenCalled();
  });

  it('should process onCellEnter', () => {
    window.alert = jest.fn();
    jest.spyOn(gameController, 'showTooltip');
    gameController.onCellEnter();

    expect(gameController.showTooltip).toHaveBeenCalled();
  });

  it('should process onCellLeave', () => {
    window.alert = jest.fn();
    jest.spyOn(gamePlay, 'hideCellTooltip');
    jest.spyOn(gamePlay, 'setCursor');
    jest.spyOn(gamePlay, 'deselectCell');
    GameState.state.selected = 5;
    gameController.onCellLeave(1);

    expect(gameController.gamePlay.hideCellTooltip).toHaveBeenCalled();
    expect(gameController.gamePlay.setCursor).toHaveBeenCalled();
    expect(gameController.gamePlay.deselectCell).toHaveBeenCalled();
  });

  it('should process onCellLeave', () => {
    window.alert = jest.fn();
    jest.spyOn(GamePlay, 'showMessage');
    jest.spyOn(stateService, 'save');
    gameController.onSaveGameClick();

    expect(GamePlay.showMessage).toHaveBeenCalled();
    expect(gameController.stateService.save).toHaveBeenCalled();
  });

  it('should not process onNewGameClick if disabled', () => {
    window.alert = jest.fn();
    jest.spyOn(gamePlay, 'redrawPositions');
    gameController.createNewGame();
    GameState.state.disabled = true;
    gameController.onNewGameClick();

    expect(gameController.gamePlay.redrawPositions).not.toHaveBeenCalled();
  });

  it('should not process onCellEnter if disabled', () => {
    window.alert = jest.fn();
    jest.spyOn(gamePlay, 'showCellTooltip');
    gameController.createNewGame();
    GameState.state.disabled = true;
    gameController.onCellEnter();

    expect(gameController.gamePlay.showCellTooltip).not.toHaveBeenCalled();
  });

  it('should not process onCellLeave if disabled', () => {
    window.alert = jest.fn();
    jest.spyOn(gamePlay, 'hideCellTooltip');
    gameController.createNewGame();
    GameState.state.disabled = true;
    gameController.onCellLeave();

    expect(gameController.gamePlay.hideCellTooltip).not.toHaveBeenCalled();
  });

  it('should process onLoadGame', () => {
    window.alert = jest.fn();
    jest.spyOn(GamePlay, 'showMessage');
    gameController.createNewGame();
    gameController.onSaveGameClick();
    gameController.onLoadGame();

    expect(GamePlay.showMessage).toHaveBeenCalled();
  });

  it('should process showTooltip', () => {
    jest.spyOn(gamePlay, 'showCellTooltip');
    const player = {
      character: {
        level: 1, attack: 2, defence: 4, health: 5,
      },
    };
    gameController.showTooltip(player, false);

    expect(gameController.gamePlay.showCellTooltip).toHaveBeenCalled();
  });

  it('should process highlightCell', () => {
    jest.spyOn(gamePlay, 'selectCell');
    gameController.createNewGame();
    GameState.state.selected = 5;

    GameState.state.canStep = [6, 2];
    gameController.highlightCell(6);
    expect(gameController.gamePlay.selectCell).toHaveBeenCalled();
    GameState.state.canStep = [];
    GameState.state.canAttack = [6, 2];
    gameController.highlightCell(6);
    expect(gameController.gamePlay.selectCell).toHaveBeenCalled();
  });

  it('should try select user - gamer can step', () => {
    gameController.createNewGame();
    const player = GameState.state.team.players.find((player) => player.position < 16);

    gameController.trySelectUser(player.position, player);

    expect(GameState.state.canStep.length).toBeGreaterThan(0);
  });

  it('should try select user - gamer can attack', () => {
    GameState.state = {};
    gameController.createNewGame();
    const player = GameState.state.team.players.find((player) => player.position < 16);
    const enemy = GameState.state.team.players.find((player) => player.position > 63 - 16);
    player.position = enemy.position - 8;

    gameController.trySelectUser(player.position, player);

    expect(GameState.state.canAttack.length).toBeGreaterThan(0);
  });

  it('should try select user - pc', () => {
    jest.spyOn(GamePlay, 'showError');
    GameState.state = {};
    gameController.createNewGame();
    const player = GameState.state.team.players.find((player) => player.position > 63 - 16);

    gameController.trySelectUser(player.position, player);

    expect(GamePlay.showError).toHaveBeenCalled();
  });

  it('should not attack if selected or disabled', async () => {
    jest.spyOn(gamePlay, 'showDamage');
    gameController.createNewGame();
    GameState.state.selected = 1;
    GameState.state.disabled = true;

    await gameController.attack(1, 0);

    expect(gameController.gamePlay.showDamage).not.toHaveBeenCalled();
  });

  it('should attack', async () => {
    jest.spyOn(gamePlay, 'showDamage');
    gameController.createNewGame();
    const attacker = GameState.state.team.players.find((player) => player.position < 16);
    const target = GameState.state.team.players.find((player) => player.position > 63 - 16);
    attacker.position = 24;
    target.position = 32;
    await gameController.attack(24, 32);
    let find = GameState.state.team.players.find((player) => player.position === 32);
    expect(gameController.gamePlay.showDamage).toHaveBeenCalled();
    expect(find).toBeDefined();
    target.character.health = 1;
    await gameController.attack(24, 32);
    find = GameState.state.team.players.find((player) => player.position === 32);

    expect(find).not.toBeDefined();
  });

  it('should test checkStepResults loose', () => {
    GameState.state = {};
    jest.spyOn(GamePlay, 'showMessage');
    gameController.createNewGame();
    GameState.state.maxScores = 1;
    const gamePlayers = GameState.state.team.players.filter((player) => player.position < 16);
    for (let i = 0; i < gamePlayers.length; i++) {
      GameState.state.team.remove(gamePlayers[i].position);
    }

    gameController.checkStepResults();

    expect(GameState.state.team.players).toHaveLength(2);
    expect(GamePlay.showMessage).toHaveBeenCalledWith('You loose! Current scores: 0, max scores: 1');
  });

  it('should test checkStepResults win', () => {
    GameState.state = {};
    jest.spyOn(GamePlay, 'showMessage');
    gameController.createNewGame();
    GameState.state.maxScores = 1;
    GameState.state.currentScores = 5;
    GameState.state.level = 3;
    const pcPlayers = GameState.state.team.players.filter((player) => player.position > 63 - 16);
    for (let i = 0; i < pcPlayers.length; i++) {
      GameState.state.team.remove(pcPlayers[i].position);
    }

    gameController.checkStepResults();

    expect(GameState.state.team.players).toHaveLength(2);
    expect(GamePlay.showMessage).toHaveBeenCalledWith('You win! Current scores: 5, max scores: 1');
    expect(GameState.state.maxScores).toBe(5);
  });

  it('should test checkStepResults new level', () => {
    GameState.state = {};
    gameController.createNewGame();
    GameState.state.maxScores = 1;

    const pcPlayers = GameState.state.team.players.filter((player) => player.position > 63 - 16);
    for (let i = 0; i < pcPlayers.length; i++) {
      GameState.state.team.remove(pcPlayers[i].position);
    }

    gameController.checkStepResults();

    expect(GameState.state.team.players).toHaveLength(6);
    expect(GameState.state.level).toBe(1);
  });

  it('should test checkStepResults call play by pc', () => {
    jest.spyOn(gameController, 'playByPc');
    GameState.state = {};
    gameController.createNewGame();
    GameState.state.maxScores = 1;

    gameController.checkStepResults();

    expect(GameState.state.team.players).toHaveLength(4);
    expect(gameController.playByPc).toHaveBeenCalled();
  });

  it('should play by pc - step', async () => {
    GameState.state = {};
    gameController.createNewGame();
    const pcPlayers = GameState.state.team.players.filter((item) => item.position > 63 - 16);
    GameState.state.player = PLAYERS.pc;
    GameState.state.team.remove(pcPlayers[0].position);

    expect(GameState.state.team.players).toHaveLength(3);
    const start = pcPlayers[1].position;

    await gameController.playByPc();
    expect(start).not.toBe(pcPlayers[1].position);
  });

  it('should play by pc - attack', async () => {
    GameState.state = {};
    gameController.createNewGame();
    const pcPlayers = GameState.state.team.players.filter((item) => item.position > 63 - 16);
    GameState.state.player = PLAYERS.pc;
    GameState.state.team.remove(pcPlayers[0].position);
    const gamerPlayer = GameState.state.team.players.filter((item) => item.position < 16);
    pcPlayers[1].position = 63;
    gamerPlayer[0].position = 63 - 8;
    const gamerHealth = gamerPlayer[0].character.health;

    await gameController.playByPc();
    expect(pcPlayers[1].position).toBe(63);
    expect(gamerPlayer[0].character.health).not.toBe(gamerHealth);
    expect(GameState.state.player).toBe(PLAYERS.gamer);
  });

  it('should play by pc - fatality', async () => {
    jest.spyOn(gamePlay, 'showMessage');
    GameState.state = {};
    gameController.createNewGame();
    GameState.state.maxScores = 5;
    GameState.state.currentScores = 1;

    const pcPlayers = GameState.state.team.players.filter((item) => item.position > 63 - 16);
    GameState.state.player = PLAYERS.pc;
    GameState.state.team.remove(pcPlayers[0].position);
    const gamerPlayer = GameState.state.team.players.filter((item) => item.position < 16);
    GameState.state.team.remove(gamerPlayer[0].position);
    pcPlayers[1].position = 63;
    gamerPlayer[1].position = 63 - 8;
    gamerPlayer[1].character.health = 1;

    await gameController.playByPc();
    expect(pcPlayers[1].position).toBe(63);
    expect(GamePlay.showMessage).toHaveBeenCalledWith('You loose! Current scores: 1, max scores: 5');
  });

  it('should load state and create new game', () => {
    jest.spyOn(gameController, 'createNewGame');
    GameState.state = {};
    gameController.createNewGame();
    GameState.state.team.players = [];
    GameState.state.level = 3;
    gameController.stateService.save(GameState.state);
    gameController.loadState();
    expect(gameController.createNewGame).toHaveBeenCalled();
  });

  it('should load state and create new game', () => {
    jest.spyOn(gameController, 'playByPc');
    GameState.state = {};
    gameController.createNewGame();
    GameState.state.player = PLAYERS.pc;
    gameController.stateService.save(GameState.state);
    gameController.loadState();
    expect(gameController.playByPc).toHaveBeenCalled();
  });

  it('should test setCursor', () => {
    jest.spyOn(gamePlay, 'setCursor');
    GameState.state = {};
    gameController.createNewGame();
    const gamerPlayers = GameState.state.team.players.filter((item) => item.position < 16);
    const pcPlayers = GameState.state.team.players.filter((item) => item.position > 63 - 16);

    gamerPlayers[0].position = 25;
    pcPlayers[0].position = 25 + 8;
    GameState.state.selected = 25;
    GameState.state.canStep = [25 - 8];
    GameState.state.canAttack = [25 + 8];

    gameController.setCursor(25 - 8, gamerPlayers[0]);
    expect(gameController.gamePlay.setCursor).toHaveBeenCalledWith(cursors.pointer);

    gameController.setCursor(25 + 8, pcPlayers[0]);
    expect(gameController.gamePlay.setCursor).toHaveBeenCalledWith(cursors.crosshair);

    gameController.setCursor(gamerPlayers[1].position, pcPlayers[0]);
    expect(gameController.gamePlay.setCursor).toHaveBeenCalledWith(cursors.pointer);

    gamerPlayers[0].position = 0;
    pcPlayers[0].position = 63;
    GameState.state.canAttack = [];
    GameState.state.canStep = [];

    gameController.setCursor(63, pcPlayers[0]);
    expect(gameController.gamePlay.setCursor).toHaveBeenCalledWith(cursors.notallowed);

    GameState.state.selected = null;
    gameController.setCursor(63, pcPlayers[0]);
    expect(gameController.gamePlay.setCursor).toHaveBeenCalledWith(cursors.pointer);
  });

  it('should test setCursor if is gamer', () => {
    jest.spyOn(gamePlay, 'setCursor');
    GameState.state = {};
    gameController.createNewGame();
    const gamerPlayers = GameState.state.team.players.filter((item) => item.position < 16);
    gamerPlayers[0].position = 0;
    gamerPlayers[1].position = 15;
    GameState.state.canAttack = [];
    GameState.state.canStep = [];
    GameState.state.selected = gamerPlayers[0].position

    gameController.setCursor(15, gamerPlayers[0]);
    expect(gameController.gamePlay.setCursor).toHaveBeenCalledWith(cursors.pointer);
  });

  it('should test oncellclick', function () {
    jest.spyOn(gameController, 'trySelectUser')
    GameState.state = {};
    gameController.createNewGame();
    gameController.onCellClick()
    expect(gameController.trySelectUser).toHaveBeenCalled();

    const gamerPlayers = GameState.state.team.players.filter((item) => item.position < 16);
    GameState.state.selected = gamerPlayers[0].position;
    gameController.onCellClick(GameState.state.selected);
    expect(GameState.state.selected).toBe(null);

    GameState.state.selected = gamerPlayers[0].position;
    gameController.onCellClick(gamerPlayers[1].position);
    expect(GameState.state.selected).toBe(gamerPlayers[1].position);
  });

  it('should attack with onclick',  async () => {
    jest.spyOn(gameController, 'attack')
    GameState.state = {};
    gameController.createNewGame();
    const gamerPlayers = GameState.state.team.players.filter((item) => item.position < 16);
    const pcPlayers = GameState.state.team.players.filter((item) => item.position > 63 - 16);

    gamerPlayers[0].position = 33;
    pcPlayers[0].position = 33+8;
    GameState.state.selected = gamerPlayers[0].position
    GameState.state.canAttack = [33+8];
    gameController.onCellClick(33+8);

    expect(gameController.attack).toHaveBeenCalled();
  });

  it('should step on click', () => {
    jest.spyOn(gameController, 'playByPc')
    GameState.state = {};
    gameController.createNewGame();
    const gamerPlayers = GameState.state.team.players.filter((item) => item.position < 16);

    gamerPlayers[0].position = 33;
    GameState.state.selected = gamerPlayers[0].position
    GameState.state.canStep = [33+8];
    gameController.onCellClick(33+8);

    expect(GameState.state.selected).toBe(null);
    expect(gameController.playByPc).toHaveBeenCalled();
    expect(gamerPlayers[0].position).toBe(33+8);
  });

  it('should not select if pc playing', () => {
    GameState.state = {};
    gameController.createNewGame();
    const gamerPlayers = GameState.state.team.players.filter((item) => item.position < 16);

    gamerPlayers[0].position = 33;
    GameState.state.player = PLAYERS.pc;
    GameState.state.canStep = [];
    gameController.onCellClick(33+8);
    expect(gamerPlayers[0].position).toBe(33);
    expect(GameState.state.selected).not.toBe(33+8)
  });


  it('should not react on cell enter if pc playing', () => {
    jest.spyOn(gameController, 'showTooltip')
    GameState.state = {};
    gameController.createNewGame();
    const gamerPlayers = GameState.state.team.players.filter((item) => item.position < 16);

    gamerPlayers[0].position = 33;
    GameState.state.player = PLAYERS.pc;
    GameState.state.canStep = [];
    gameController.onCellEnter(33);
    expect(gameController.showTooltip).not.toHaveBeenCalled();
  });

  it('should not react on save game if pc playing', () => {
    jest.spyOn(gamePlay, 'showMessage')
    GameState.state = {};
    gameController.createNewGame();
    const gamerPlayers = GameState.state.team.players.filter((item) => item.position < 16);

    gamerPlayers[0].position = 33;
    GameState.state.player = PLAYERS.pc;
    GameState.state.canStep = [];
    gameController.onSaveGameClick();
    expect(gameController.gamePlay.showMessage).not.toHaveBeenCalled();
  });

  it('should not react on onLoadGame if pc playing', () => {
    jest.spyOn(gamePlay, 'showMessage')
    GameState.state = {};
    gameController.createNewGame();
    const gamerPlayers = GameState.state.team.players.filter((item) => item.position < 16);

    gamerPlayers[0].position = 33;
    GameState.state.player = PLAYERS.pc;
    GameState.state.canStep = [];
    gameController.onLoadGame();
    expect(gameController.gamePlay.showMessage).not.toHaveBeenCalled();
  });
});
