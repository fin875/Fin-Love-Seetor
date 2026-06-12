const {
  getScreenIdForStep,
  getBackTargetStep,
  getInitFunctionForStep,
  isWarpStep,
} = require('../src/navigation');

describe('Navigation Module', () => {
  describe('getScreenIdForStep', () => {
    it('returns step-warp for warp steps (3, 5, 7, 9)', () => {
      expect(getScreenIdForStep(3)).toBe('step-warp');
      expect(getScreenIdForStep(5)).toBe('step-warp');
      expect(getScreenIdForStep(7)).toBe('step-warp');
      expect(getScreenIdForStep(9)).toBe('step-warp');
    });

    it('returns step-N for non-warp steps', () => {
      expect(getScreenIdForStep(0)).toBe('step-0');
      expect(getScreenIdForStep(1)).toBe('step-1');
      expect(getScreenIdForStep(2)).toBe('step-2');
      expect(getScreenIdForStep(4)).toBe('step-4');
      expect(getScreenIdForStep(6)).toBe('step-6');
      expect(getScreenIdForStep(8)).toBe('step-8');
      expect(getScreenIdForStep(10)).toBe('step-10');
    });
  });

  describe('getBackTargetStep', () => {
    it('returns current step minus 2', () => {
      expect(getBackTargetStep(4)).toBe(2);
      expect(getBackTargetStep(6)).toBe(4);
      expect(getBackTargetStep(8)).toBe(6);
      expect(getBackTargetStep(10)).toBe(8);
    });

    it('handles edge case of going back from step 2', () => {
      expect(getBackTargetStep(2)).toBe(0);
    });
  });

  describe('getInitFunctionForStep', () => {
    it('returns runIntroSequence for step 1', () => {
      expect(getInitFunctionForStep(1)).toBe('runIntroSequence');
    });

    it('returns showLoginCard for step 2', () => {
      expect(getInitFunctionForStep(2)).toBe('showLoginCard');
    });

    it('returns runWarpTransition for warp steps', () => {
      expect(getInitFunctionForStep(3)).toBe('runWarpTransition');
      expect(getInitFunctionForStep(5)).toBe('runWarpTransition');
      expect(getInitFunctionForStep(7)).toBe('runWarpTransition');
      expect(getInitFunctionForStep(9)).toBe('runWarpTransition');
    });

    it('returns initGridGallery for step 4', () => {
      expect(getInitFunctionForStep(4)).toBe('initGridGallery');
    });

    it('returns initJigsaw for step 6', () => {
      expect(getInitFunctionForStep(6)).toBe('initJigsaw');
    });

    it('returns initSignature for step 8', () => {
      expect(getInitFunctionForStep(8)).toBe('initSignature');
    });

    it('returns initFlowerPage for step 10', () => {
      expect(getInitFunctionForStep(10)).toBe('initFlowerPage');
    });

    it('returns null for unknown steps', () => {
      expect(getInitFunctionForStep(11)).toBeNull();
      expect(getInitFunctionForStep(-1)).toBeNull();
      expect(getInitFunctionForStep(99)).toBeNull();
    });
  });

  describe('isWarpStep', () => {
    it('returns true for warp steps', () => {
      expect(isWarpStep(3)).toBe(true);
      expect(isWarpStep(5)).toBe(true);
      expect(isWarpStep(7)).toBe(true);
      expect(isWarpStep(9)).toBe(true);
    });

    it('returns false for non-warp steps', () => {
      expect(isWarpStep(0)).toBe(false);
      expect(isWarpStep(1)).toBe(false);
      expect(isWarpStep(2)).toBe(false);
      expect(isWarpStep(4)).toBe(false);
      expect(isWarpStep(6)).toBe(false);
      expect(isWarpStep(8)).toBe(false);
      expect(isWarpStep(10)).toBe(false);
    });
  });
});
