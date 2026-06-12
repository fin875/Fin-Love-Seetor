/**
 * Grid gallery utilities.
 */

/**
 * Wrapping function for infinite scrolling grid.
 * Wraps a value into the range [0, max).
 * @param {number} val
 * @param {number} max
 * @returns {number}
 */
function wrap(val, max) {
  return ((val % max) + max) % max;
}

/**
 * Calculate the scale and opacity of a grid item based on distance from center.
 * Items closer to the center are larger and more opaque.
 * @param {number} dist - Distance from the center
 * @param {number} effectRadius - Maximum radius of the effect
 * @param {number} maxScale - Maximum scale factor
 * @returns {{ scale: number, opacity: number, zIndex: number }}
 */
function calculateItemAppearance(dist, effectRadius, maxScale) {
  let scale = 1;
  let opacity = 0.35;
  let zIndex = 0;

  if (dist < effectRadius) {
    const b = Math.cos((dist / effectRadius) * (Math.PI / 2));
    scale = 1 + b * (maxScale - 1);
    opacity = 0.35 + b * 0.65;
    zIndex = Math.floor(b * 100);
  }

  return { scale, opacity, zIndex };
}

/**
 * Calculate grid layout parameters based on viewport width.
 * @param {number} viewportWidth
 * @returns {{ itemSize: number, minGap: number, cellSize: number, cols: number, rows: number }}
 */
function getGridLayout(viewportWidth) {
  const isMobile = viewportWidth < 768;
  const itemSize = isMobile ? 65 : 110;
  const maxScale = 1.25;
  const minGap = isMobile ? 12 : 20;
  const cellSize = itemSize * maxScale + minGap;
  const cols = 15;
  const rows = 15;

  return { itemSize, minGap, cellSize, cols, rows };
}

/**
 * Calculate the position of a grid item given its column, row, and pan offset.
 * @param {number} col
 * @param {number} row
 * @param {{ x: number, y: number }} pan - Current pan offset
 * @param {number} cellSize
 * @param {number} cols
 * @param {number} rows
 * @returns {{ x: number, y: number }}
 */
function calculateItemPosition(col, row, pan, cellSize, cols, rows) {
  const totalW = cols * cellSize;
  const totalH = rows * cellSize;
  const x = wrap(col * cellSize + pan.x, totalW) - totalW / 2;
  const y = wrap(row * cellSize + pan.y, totalH) - totalH / 2;
  return { x, y };
}

/**
 * Apply inertia to velocity (friction decay).
 * @param {{ x: number, y: number }} vel
 * @param {number} friction - Friction coefficient (0-1)
 * @returns {{ x: number, y: number }}
 */
function applyInertia(vel, friction) {
  return {
    x: vel.x * friction,
    y: vel.y * friction,
  };
}

/**
 * Calculate distance from origin for a point.
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */
function distanceFromCenter(x, y) {
  return Math.sqrt(x * x + y * y);
}

module.exports = {
  wrap,
  calculateItemAppearance,
  getGridLayout,
  calculateItemPosition,
  applyInertia,
  distanceFromCenter,
};
