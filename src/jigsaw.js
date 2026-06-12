/**
 * Jigsaw puzzle game logic.
 */

/**
 * Check if a tile at a given index is adjacent to the empty space.
 * In a 3x3 grid, adjacency means sharing an edge (not diagonal).
 * @param {number} tileIndex - Index of the tile being clicked
 * @param {number} emptyIndex - Index of the empty space
 * @returns {boolean}
 */
function isAdjacentToEmpty(tileIndex, emptyIndex) {
  const row = Math.floor(tileIndex / 3);
  const col = tileIndex % 3;
  const emptyRow = Math.floor(emptyIndex / 3);
  const emptyCol = emptyIndex % 3;

  return (
    (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
    (Math.abs(col - emptyCol) === 1 && row === emptyRow)
  );
}

/**
 * Check if the puzzle is solved (all tiles in order: 0,1,2,...,8).
 * @param {number[]} tiles - Current tile positions
 * @returns {boolean}
 */
function isPuzzleSolved(tiles) {
  return tiles.every((val, i) => val === i);
}

/**
 * Swap two tiles in the tiles array (immutable).
 * @param {number[]} tiles - Current tile positions
 * @param {number} indexA
 * @param {number} indexB
 * @returns {number[]} New array with swapped positions
 */
function swapTiles(tiles, indexA, indexB) {
  const result = [...tiles];
  [result[indexA], result[indexB]] = [result[indexB], result[indexA]];
  return result;
}

/**
 * Get valid neighbors of a position in the 3x3 grid.
 * @param {number} index - Position index (0-8)
 * @returns {number[]} Array of neighbor indices
 */
function getNeighbors(index) {
  const row = Math.floor(index / 3);
  const col = index % 3;
  const neighbors = [];

  if (row > 0) neighbors.push(index - 3);
  if (row < 2) neighbors.push(index + 3);
  if (col > 0) neighbors.push(index - 1);
  if (col < 2) neighbors.push(index + 1);

  return neighbors;
}

/**
 * Shuffle the puzzle by making random valid moves from the solved state.
 * This ensures the puzzle is always solvable.
 * @param {number} moves - Number of random moves to make
 * @returns {number[]} Shuffled tile positions
 */
function shufflePuzzle(moves) {
  let tiles = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  let emptyIdx = 8;
  let lastPick = -1;

  for (let i = 0; i < moves; i++) {
    const neighbors = getNeighbors(emptyIdx);
    const validNeighbors = neighbors.filter((n) => n !== lastPick);
    const pick =
      validNeighbors[Math.floor(Math.random() * validNeighbors.length)];

    tiles = swapTiles(tiles, emptyIdx, pick);
    lastPick = emptyIdx;
    emptyIdx = pick;
  }

  return tiles;
}

/**
 * Process a tile click: if adjacent to empty, swap them.
 * @param {number[]} tiles - Current tile positions
 * @param {number} tileId - The tile ID that was clicked
 * @returns {{ tiles: number[], moved: boolean }}
 */
function handleTileClick(tiles, tileId) {
  const currentIndex = tiles.indexOf(tileId);
  const emptyIndex = tiles.indexOf(8);

  if (isAdjacentToEmpty(currentIndex, emptyIndex)) {
    return { tiles: swapTiles(tiles, emptyIndex, currentIndex), moved: true };
  }
  return { tiles, moved: false };
}

/**
 * Determine whether the skip button should be shown.
 * @param {number} moveCount
 * @param {boolean} solved
 * @returns {boolean}
 */
function shouldShowSkipButton(moveCount, solved) {
  return moveCount >= 5 && !solved;
}

module.exports = {
  isAdjacentToEmpty,
  isPuzzleSolved,
  swapTiles,
  getNeighbors,
  shufflePuzzle,
  handleTileClick,
  shouldShowSkipButton,
};
