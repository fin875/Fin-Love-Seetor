const {
  wrap,
  calculateItemAppearance,
  getGridLayout,
  calculateItemPosition,
  applyInertia,
  distanceFromCenter,
} = require('../src/gallery');

describe('Gallery Module', () => {
  describe('wrap', () => {
    it('wraps positive values exceeding max', () => {
      expect(wrap(10, 5)).toBe(0);
      expect(wrap(7, 5)).toBe(2);
      expect(wrap(11, 4)).toBe(3);
    });

    it('returns value as-is when within range', () => {
      expect(wrap(3, 5)).toBe(3);
      expect(wrap(0, 5)).toBe(0);
      expect(wrap(4, 5)).toBe(4);
    });

    it('wraps negative values correctly', () => {
      expect(wrap(-1, 5)).toBe(4);
      expect(wrap(-3, 5)).toBe(2);
      expect(wrap(-5, 5)).toBe(0);
      expect(wrap(-6, 5)).toBe(4);
    });

    it('handles zero value', () => {
      expect(wrap(0, 10)).toBe(0);
    });

    it('handles value equal to max', () => {
      expect(wrap(5, 5)).toBe(0);
    });

    it('handles large positive values', () => {
      expect(wrap(1000, 7)).toBe(1000 % 7);
    });

    it('handles large negative values', () => {
      expect(wrap(-1000, 7)).toBe((((-1000) % 7) + 7) % 7);
    });
  });

  describe('calculateItemAppearance', () => {
    it('returns default values when distance exceeds effectRadius', () => {
      const result = calculateItemAppearance(200, 100, 1.25);
      expect(result.scale).toBe(1);
      expect(result.opacity).toBe(0.35);
      expect(result.zIndex).toBe(0);
    });

    it('returns max values at distance 0 (center)', () => {
      const result = calculateItemAppearance(0, 100, 1.25);
      expect(result.scale).toBeCloseTo(1.25);
      expect(result.opacity).toBeCloseTo(1.0);
      expect(result.zIndex).toBe(100);
    });

    it('returns intermediate values at half distance', () => {
      const result = calculateItemAppearance(50, 100, 1.25);
      expect(result.scale).toBeGreaterThan(1);
      expect(result.scale).toBeLessThan(1.25);
      expect(result.opacity).toBeGreaterThan(0.35);
      expect(result.opacity).toBeLessThan(1.0);
      expect(result.zIndex).toBeGreaterThan(0);
      expect(result.zIndex).toBeLessThan(100);
    });

    it('returns default values at exactly effectRadius', () => {
      // At the boundary cos(PI/2) = 0, so same as defaults
      const result = calculateItemAppearance(100, 100, 1.25);
      expect(result.scale).toBe(1);
      expect(result.opacity).toBe(0.35);
      expect(result.zIndex).toBe(0);
    });
  });

  describe('getGridLayout', () => {
    it('returns mobile layout for viewport < 768', () => {
      const layout = getGridLayout(375);
      expect(layout.itemSize).toBe(65);
      expect(layout.minGap).toBe(12);
      expect(layout.cols).toBe(15);
      expect(layout.rows).toBe(15);
    });

    it('returns desktop layout for viewport >= 768', () => {
      const layout = getGridLayout(1024);
      expect(layout.itemSize).toBe(110);
      expect(layout.minGap).toBe(20);
      expect(layout.cols).toBe(15);
      expect(layout.rows).toBe(15);
    });

    it('calculates cellSize correctly for mobile', () => {
      const layout = getGridLayout(375);
      expect(layout.cellSize).toBeCloseTo(65 * 1.25 + 12);
    });

    it('calculates cellSize correctly for desktop', () => {
      const layout = getGridLayout(1024);
      expect(layout.cellSize).toBeCloseTo(110 * 1.25 + 20);
    });

    it('treats exactly 768 as desktop', () => {
      const layout = getGridLayout(768);
      expect(layout.itemSize).toBe(110);
    });
  });

  describe('calculateItemPosition', () => {
    it('calculates position with zero pan offset', () => {
      const cellSize = 100;
      const pos = calculateItemPosition(0, 0, { x: 0, y: 0 }, cellSize, 15, 15);
      expect(pos.x).toBe(-750); // 0 - 1500/2
      expect(pos.y).toBe(-750);
    });

    it('wraps position correctly with large pan', () => {
      const cellSize = 100;
      const totalW = 15 * 100; // 1500
      // col 0, pan.x = 1600 should wrap
      const pos = calculateItemPosition(0, 0, { x: 1600, y: 0 }, cellSize, 15, 15);
      // wrap(0 + 1600, 1500) = wrap(1600, 1500) = 100
      // x = 100 - 750 = -650
      expect(pos.x).toBe(-650);
    });

    it('calculates non-zero col and row', () => {
      const cellSize = 100;
      const pos = calculateItemPosition(7, 7, { x: 0, y: 0 }, cellSize, 15, 15);
      // wrap(700, 1500) = 700; x = 700 - 750 = -50
      expect(pos.x).toBe(-50);
      expect(pos.y).toBe(-50);
    });
  });

  describe('applyInertia', () => {
    it('reduces velocity by friction coefficient', () => {
      const result = applyInertia({ x: 10, y: 20 }, 0.5);
      expect(result.x).toBe(5);
      expect(result.y).toBe(10);
    });

    it('returns zero velocity when friction is 0', () => {
      const result = applyInertia({ x: 100, y: 200 }, 0);
      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
    });

    it('preserves velocity when friction is 1', () => {
      const result = applyInertia({ x: 5, y: 3 }, 1);
      expect(result.x).toBe(5);
      expect(result.y).toBe(3);
    });

    it('handles negative velocity', () => {
      const result = applyInertia({ x: -10, y: -6 }, 0.5);
      expect(result.x).toBe(-5);
      expect(result.y).toBe(-3);
    });
  });

  describe('distanceFromCenter', () => {
    it('returns 0 for origin', () => {
      expect(distanceFromCenter(0, 0)).toBe(0);
    });

    it('calculates correct distance for 3-4-5 triangle', () => {
      expect(distanceFromCenter(3, 4)).toBe(5);
    });

    it('handles negative coordinates', () => {
      expect(distanceFromCenter(-3, -4)).toBe(5);
    });

    it('calculates along axis', () => {
      expect(distanceFromCenter(10, 0)).toBe(10);
      expect(distanceFromCenter(0, 7)).toBe(7);
    });
  });
});
