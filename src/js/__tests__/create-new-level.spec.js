import createNewLevel, { createNewField } from '../utils/create-new-level';

test('should create new field', () => {
  const boardSize = 8;
  const field = createNewField(boardSize);
  expect(field.length).toBe(boardSize ** 2);
  expect(field[10]).toBe(10);
});

test('should create new level', () => {
  const boardSize = 8;
  const team = createNewLevel(0, boardSize);
  expect(team.gamerTeam.length).toBe(2);
  expect(team.pcTeam.length).toBe(2);

  const team1 = createNewLevel(1, boardSize);
  expect(team1.gamerTeam.length).toBe(1);
  expect([1, 2].includes(team1.gamerTeam[0].character.level)).toBeTruthy();
  expect(team1.pcTeam.length).toBe(1);
  expect([1, 2].includes(team1.pcTeam[0].character.level)).toBeTruthy();

  const team2 = createNewLevel(2, boardSize);
  expect(team2.gamerTeam.length).toBe(2);
  expect([1, 2, 3].includes(team2.gamerTeam[0].character.level)).toBeTruthy();
  expect(team2.pcTeam.length).toBe(2);
  expect([1, 2, 3].includes(team2.pcTeam[0].character.level)).toBeTruthy();

  const team3 = createNewLevel(3, boardSize);
  expect(team3.gamerTeam.length).toBe(2);
  expect([1, 2, 3, 4].includes(team3.gamerTeam[0].character.level)).toBeTruthy();
  expect(team3.pcTeam.length).toBe(2);
  expect([1, 2, 3, 4].includes(team3.pcTeam[0].character.level)).toBeTruthy();

  const team5 = createNewLevel(5, boardSize);
  expect(team5).toEqual({ gamerTeam: undefined, pcTeam: undefined });

  const playerPosition = new Array(16).fill(0).map((_, index) => index);
  expect(playerPosition.includes(team.gamerTeam[0].position));
  const pcPositions = [];
  for (let i = boardSize ** 2 - 1; i >= boardSize ** 2 - 1 - boardSize * 2; i--) {
    pcPositions.push(i);
  }
  expect(pcPositions.includes(team.pcTeam[0].position));
});
