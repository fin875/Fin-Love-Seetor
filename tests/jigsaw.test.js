const {
  isAdjacentToEmpty,
  isPuzzleSolved,
  swapTiles,
  getNeighbors,
  shufflePuzzle,
  handleTileClick,
  shouldShowSkipButton,
} = require('../src/jigsaw');

describe('Jigsaw Puzzle Module', () => {
  describe('isAdjacentToEmpty', () => {
    // 3x3 grid layout:
    // 0 1 2
    // 3 4 5
    // 6 7 8

    it('detects horizontal adjacency', () => {
      expect(isAdjacentToEmpty(3, 4)).toBe(true);
      expect(isAdjacentToEmpty(4, 3)).toBe(true);
      expect(isAdjacentToEmpty(4, 5)).toBe(true);
      expect(isAdjacentToEmpty(0, 1)).toBe(true);
    });

    it('detects vertical adjacency', () => {
      expect(isAdjacentToEmpty(1, 4)).toBe(true);
      expect(isAdjacentToEmpty(4, 1)).toBe(true);
      expect(isAdjacentToEmpty(4, 7)).toBe(true);
      expect(isAdjacentToEmpty(7, 4)).toBe(true);
    });

    it('rejects diagonal positions', () => {
      expect(isAdjacentToEmpty(0, 4)).toBe(false);
      expect(isAdjacentToEmpty(4, 0)).toBe(false);
      expect(isAdjacentToEmpty(2, 4)).toBe(false);
      expect(isAdjacentToEmpty(6, 4)).toBe(false);
      expect(isAdjacentToEmpty(8, 4)).toBe(false);
    });

    it('rejects same position', () => {
      expect(isAdjacentToEmpty(4, 4)).toBe(false);
    });

    it('rejects non-adjacent positions in same row', () => {
      expect(isAdjacentToEmpty(0, 2)).toBe(false);
      expect(isAdjacentToEmpty(6, 8)).toBe(false);
    });

    it('rejects non-adjacent positions in same column', () => {
      expect(isAdjacentToEmpty(0, 6)).toBe(false);
      expect(isAdjacentToEmpty(2, 8)).toBe(false);
    });

    it('correctly handles edge wrapping (should NOT wrap)', () => {
      // index 2 (row 0, col 2) and index 3 (row 1, col 0) are NOT adjacent
      expect(isAdjacentToEmpty(2, 3)).toBe(false);
      expect(isAdjacentToEmpty(5, 6)).toBe(false);
    });
  });

  describe('isPuzzleSolved', () => {
    it('returns true for solved state', () => {
      expect(isPuzzleSolved([0, 1, 2, 3, 4, 5, 6, 7, 8])).toBe(true);
    });

    it('returns false for unsolved state', () => {
      expect(isPuzzleSolved([1, 0, 2, 3, 4, 5, 6, 7, 8])).toBe(false);
      expect(isPuzzleSolved([0, 1, 2, 3, 4, 5, 6, 8, 7])).toBe(false);
    });

    it('returns false for completely scrambled state', () => {
      expect(isPuzzleSolved([8, 7, 6, 5, 4, 3, 2, 1, 0])).toBe(false);
    });
  });

  describe('swapTiles', () => {
    it('swaps two tiles at given indices', () => {
      const tiles = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      const result = swapTiles(tiles, 0, 8);
      expect(result).toEqual([8, 1, 2, 3, 4, 5, 6, 7, 0]);
    });

    it('does not mutate the original array', () => {
      const tiles = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      swapTiles(tiles, 0, 1);
      expect(tiles).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it('swapping same index returns unchanged array', () => {
      const tiles = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      expect(swapTiles(tiles, 4, 4)).toEqual(tiles);
    });

    it('works for adjacent positions', () => {
      const tiles = [0, 1, 2, 3, 8, 5, 6, 7, 4];
      const result = swapTiles(tiles, 3, 4);
      expect(result).toEqual([0, 1, 2, 8, 3, 5, 6, 7, 4]);
    });
  });

  describe('getNeighbors', () => {
    it('returns 2 neighbors for corner positions', () => {
      expect(getNeighbors(0).sort()).toEqual([1, 3]);
      expect(getNeighbors(2).sort()).toEqual([1, 5]);
      expect(getNeighbors(6).sort()).toEqual([3, 7]);
      expect(getNeighbors(8).sort()).toEqual([5, 7]);
    });

    it('returns 3 neighbors for edge positions', () => {
      expect(getNeighbors(1).sort()).toEqual([0, 2, 4]);
      expect(getNeighbors(3).sort()).toEqual([0, 4, 6]);
      expect(getNeighbors(5).sort()).toEqual([2, 4, 8]);
      expect(getNeighbors(7).sort()).toEqual([4, 6, 8]);
    });

    it('returns 4 neighbors for center position', () => {
      expect(getNeighbors(4).sort()).toEqual([1, 3, 5, 7]);
    });
  });

  describe('shufflePuzzle', () => {
    it('returns an array of 9 elements', () => {
      const result = shufflePuzzle(6);
      expect(result).toHaveLength(9);
    });

    it('contains all numbers 0-8', () => {
      const result = shufflePuzzle(6);
      expect(result.sort()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it('with 0 moves returns solved state', () => {
      expect(shufflePuzzle(0)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it('with more moves produces a different arrangement (usually)', () => {
      // With 20 moves it's extremely unlikely to return to solved state
      let differentCount = 0;
      for (let i = 0; i < 10; i++) {
        const result = shufflePuzzle(20);
        if (!isPuzzleSolved(result)) differentCount++;
      }
      expect(differentCount).toBeGreaterThan(0);
    });
  });

  describe('handleTileClick', () => {
    it('swaps tile with empty when adjacent', () => {
      // Empty (8) is at index 8, tile 7 is at index 7 (adjacent)
      const tiles = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      const result = handleTileClick(tiles, 7);
      expect(result.moved).toBe(true);
      expect(result.tiles).toEqual([0, 1, 2, 3, 4, 5, 6, 8, 7]);
    });

    it('does not swap when not adjacent', () => {
      const tiles = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      const result = handleTileClick(tiles, 0);
      expect(result.moved).toBe(false);
      expect(result.tiles).toEqual(tiles);
    });

    it('swaps vertically adjacent tile with empty', () => {
      // Empty (8) at index 8 (row 2, col 2), tile 5 at index 5 (row 1, col 2) - adjacent
      const tiles = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      const result = handleTileClick(tiles, 5);
      expect(result.moved).toBe(true);
      expect(result.tiles).toEqual([0, 1, 2, 3, 4, 8, 6, 7, 5]);
    });

    it('does not move the empty tile itself', () => {
      const tiles = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      const result = handleTileClick(tiles, 8);
      expect(result.moved).toBe(false);
    });
  });

  describe('shouldShowSkipButton', () => {
    it('returns true when moveCount >= 5 and not solved', () => {
      expect(shouldShowSkipButton(5, false)).toBe(true);
      expect(shouldShowSkipButton(10, false)).toBe(true);
    });

    it('returns false when moveCount < 5', () => {
      expect(shouldShowSkipButton(0, false)).toBe(false);
      expect(shouldShowSkipButton(4, false)).toBe(false);
    });

    it('returns false when solved regardless of moveCount', () => {
      expect(shouldShowSkipButton(5, true)).toBe(false);
      expect(shouldShowSkipButton(100, true)).toBe(false);
    });
  });
});
