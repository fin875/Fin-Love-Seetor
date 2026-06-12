const {
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
} = require('../src/signature');

describe('Signature Module', () => {
  describe('constants', () => {
    it('has 5 default colors', () => {
      expect(DEFAULT_COLORS).toHaveLength(5);
      DEFAULT_COLORS.forEach((c) => expect(c).toMatch(/^#[0-9a-fA-F]{6}$/));
    });

    it('has 3 brush types', () => {
      expect(BRUSH_TYPES).toEqual(['normal', 'neon', 'fur']);
    });

    it('default brush is neon', () => {
      expect(DEFAULT_BRUSH).toBe('neon');
    });

    it('default color is pink (#ec4899)', () => {
      expect(DEFAULT_COLOR).toBe('#ec4899');
    });
  });

  describe('createSignatureState', () => {
    it('returns initial state with correct defaults', () => {
      const state = createSignatureState();
      expect(state.currentColor).toBe('#ec4899');
      expect(state.currentBrush).toBe('neon');
      expect(state.isDrawing).toBe(false);
      expect(state.hasDrawn).toBe(false);
      expect(state.lastPos).toEqual({ x: 0, y: 0 });
    });
  });

  describe('setColor', () => {
    it('sets a valid predefined color', () => {
      const state = createSignatureState();
      const newState = setColor(state, '#ffffff');
      expect(newState.currentColor).toBe('#ffffff');
    });

    it('sets a valid hex color not in defaults', () => {
      const state = createSignatureState();
      const newState = setColor(state, '#abcdef');
      expect(newState.currentColor).toBe('#abcdef');
    });

    it('rejects invalid color format', () => {
      const state = createSignatureState();
      const newState = setColor(state, 'not-a-color');
      expect(newState.currentColor).toBe('#ec4899');
    });

    it('rejects empty string', () => {
      const state = createSignatureState();
      const newState = setColor(state, '');
      expect(newState.currentColor).toBe('#ec4899');
    });

    it('does not mutate original state', () => {
      const state = createSignatureState();
      setColor(state, '#ffffff');
      expect(state.currentColor).toBe('#ec4899');
    });
  });

  describe('setBrush', () => {
    it('sets valid brush types', () => {
      const state = createSignatureState();
      expect(setBrush(state, 'normal').currentBrush).toBe('normal');
      expect(setBrush(state, 'neon').currentBrush).toBe('neon');
      expect(setBrush(state, 'fur').currentBrush).toBe('fur');
    });

    it('rejects invalid brush type', () => {
      const state = createSignatureState();
      const newState = setBrush(state, 'invalid');
      expect(newState.currentBrush).toBe('neon');
    });

    it('does not mutate original state', () => {
      const state = createSignatureState();
      setBrush(state, 'normal');
      expect(state.currentBrush).toBe('neon');
    });
  });

  describe('startDrawing', () => {
    it('sets isDrawing and hasDrawn to true', () => {
      const state = createSignatureState();
      const newState = startDrawing(state, { x: 10, y: 20 });
      expect(newState.isDrawing).toBe(true);
      expect(newState.hasDrawn).toBe(true);
    });

    it('updates lastPos', () => {
      const state = createSignatureState();
      const newState = startDrawing(state, { x: 50, y: 100 });
      expect(newState.lastPos).toEqual({ x: 50, y: 100 });
    });
  });

  describe('stopDrawing', () => {
    it('sets isDrawing to false', () => {
      let state = createSignatureState();
      state = startDrawing(state, { x: 0, y: 0 });
      const newState = stopDrawing(state);
      expect(newState.isDrawing).toBe(false);
    });

    it('preserves hasDrawn state', () => {
      let state = createSignatureState();
      state = startDrawing(state, { x: 0, y: 0 });
      const newState = stopDrawing(state);
      expect(newState.hasDrawn).toBe(true);
    });
  });

  describe('updatePosition', () => {
    it('updates lastPos', () => {
      const state = createSignatureState();
      const newState = updatePosition(state, { x: 42, y: 99 });
      expect(newState.lastPos).toEqual({ x: 42, y: 99 });
    });
  });

  describe('clearCanvas', () => {
    it('resets hasDrawn to false', () => {
      let state = createSignatureState();
      state = startDrawing(state, { x: 0, y: 0 });
      expect(state.hasDrawn).toBe(true);
      const cleared = clearCanvas(state);
      expect(cleared.hasDrawn).toBe(false);
    });

    it('does not affect other state properties', () => {
      let state = createSignatureState();
      state = startDrawing(state, { x: 5, y: 10 });
      state = setBrush(state, 'fur');
      const cleared = clearCanvas(state);
      expect(cleared.currentBrush).toBe('fur');
      expect(cleared.lastPos).toEqual({ x: 5, y: 10 });
    });
  });

  describe('getCanvasCoordinates', () => {
    it('calculates coordinates relative to canvas rect', () => {
      const rect = { left: 100, top: 50 };
      const result = getCanvasCoordinates(150, 80, rect);
      expect(result).toEqual({ x: 50, y: 30 });
    });

    it('handles zero offset', () => {
      const rect = { left: 0, top: 0 };
      const result = getCanvasCoordinates(200, 300, rect);
      expect(result).toEqual({ x: 200, y: 300 });
    });

    it('handles negative results (click above/left of canvas)', () => {
      const rect = { left: 100, top: 100 };
      const result = getCanvasCoordinates(50, 50, rect);
      expect(result).toEqual({ x: -50, y: -50 });
    });
  });

  describe('getActionsVisibility', () => {
    it('returns visible state when hasDrawn is true', () => {
      const result = getActionsVisibility(true);
      expect(result.visible).toBe(true);
      expect(result.maxHeight).toBe('100px');
      expect(result.opacity).toBe('1');
    });

    it('returns hidden state when hasDrawn is false', () => {
      const result = getActionsVisibility(false);
      expect(result.visible).toBe(false);
      expect(result.maxHeight).toBe('0px');
      expect(result.opacity).toBe('0');
    });
  });
});
