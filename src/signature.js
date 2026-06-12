/**
 * Signature/drawing canvas state management.
 */

const DEFAULT_COLORS = ['#ffffff', '#ec4899', '#ef4444', '#3b82f6', '#eab308'];
const BRUSH_TYPES = ['normal', 'neon', 'fur'];
const DEFAULT_BRUSH = 'neon';
const DEFAULT_COLOR = '#ec4899';

/**
 * Create initial signature state.
 * @returns {object}
 */
function createSignatureState() {
  return {
    currentColor: DEFAULT_COLOR,
    currentBrush: DEFAULT_BRUSH,
    isDrawing: false,
    hasDrawn: false,
    lastPos: { x: 0, y: 0 },
  };
}

/**
 * Set the active color.
 * @param {object} state
 * @param {string} color - hex color string
 * @returns {object} New state
 */
function setColor(state, color) {
  if (!DEFAULT_COLORS.includes(color) && !/^#[0-9a-fA-F]{6}$/.test(color)) {
    return state;
  }
  return { ...state, currentColor: color };
}

/**
 * Set the active brush type.
 * @param {object} state
 * @param {string} brushType
 * @returns {object} New state
 */
function setBrush(state, brushType) {
  if (!BRUSH_TYPES.includes(brushType)) {
    return state;
  }
  return { ...state, currentBrush: brushType };
}

/**
 * Start drawing (pointer/touch down).
 * @param {object} state
 * @param {{ x: number, y: number }} pos
 * @returns {object} New state
 */
function startDrawing(state, pos) {
  return { ...state, isDrawing: true, hasDrawn: true, lastPos: pos };
}

/**
 * Stop drawing (pointer/touch up).
 * @param {object} state
 * @returns {object} New state
 */
function stopDrawing(state) {
  return { ...state, isDrawing: false };
}

/**
 * Update last position during drawing.
 * @param {object} state
 * @param {{ x: number, y: number }} pos
 * @returns {object} New state
 */
function updatePosition(state, pos) {
  return { ...state, lastPos: pos };
}

/**
 * Clear the canvas (reset drawn state).
 * @param {object} state
 * @returns {object} New state
 */
function clearCanvas(state) {
  return { ...state, hasDrawn: false };
}

/**
 * Get canvas coordinates from a pointer/touch event.
 * @param {number} clientX
 * @param {number} clientY
 * @param {{ left: number, top: number }} rect - Canvas bounding rect
 * @returns {{ x: number, y: number }}
 */
function getCanvasCoordinates(clientX, clientY, rect) {
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
}

/**
 * Check if the signature actions wrapper should be visible.
 * @param {boolean} hasDrawn
 * @returns {{ visible: boolean, maxHeight: string, opacity: string }}
 */
function getActionsVisibility(hasDrawn) {
  if (hasDrawn) {
    return { visible: true, maxHeight: '100px', opacity: '1' };
  }
  return { visible: false, maxHeight: '0px', opacity: '0' };
}

module.exports = {
  DEFAULT_COLORS,
  BRUSH_TYPES,
  DEFAULT_BRUSH,
  DEFAULT_COLOR,
  createSignatureState,
  setColor,
  setBrush,
  startDrawing,
  stopDrawing,
  updatePosition,
  clearCanvas,
  getCanvasCoordinates,
  getActionsVisibility,
};
