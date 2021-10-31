import GameStateService from "../GameStateService";

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

test('', async () => {
  jest.spyOn(localStorageMock, 'getItem').mockReturnValue('')
    const gameStateService = new GameStateService(localStorageMock);

  expect(gameStateService.load).toThrow();
})
