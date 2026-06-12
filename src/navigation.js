/**
 * Navigation and screen routing logic.
 */

/**
 * Determine the actual screen element ID for a given step number.
 * Steps 3, 5, 7, 9 use the warp transition screen.
 * @param {number} step
 * @returns {string} The DOM element ID for the screen
 */
function getScreenIdForStep(step) {
  if (step === 3 || step === 5 || step === 7 || step === 9) {
    return 'step-warp';
  }
  return `step-${step}`;
}

/**
 * Calculate the target step when going back from a given step.
 * Going back always skips 2 steps (current step - 2).
 * @param {number} currentStepNum
 * @returns {number}
 */
function getBackTargetStep(currentStepNum) {
  return currentStepNum - 2;
}

/**
 * Determine which initialization function should be called for a step.
 * @param {number} step
 * @returns {string|null} The name of the init function, or null
 */
function getInitFunctionForStep(step) {
  const stepActions = {
    1: 'runIntroSequence',
    2: 'showLoginCard',
    3: 'runWarpTransition',
    4: 'initGridGallery',
    5: 'runWarpTransition',
    6: 'initJigsaw',
    7: 'runWarpTransition',
    8: 'initSignature',
    9: 'runWarpTransition',
    10: 'initFlowerPage',
  };
  return stepActions[step] || null;
}

/**
 * Check whether a step triggers a warp transition.
 * @param {number} step
 * @returns {boolean}
 */
function isWarpStep(step) {
  return step === 3 || step === 5 || step === 7 || step === 9;
}

module.exports = {
  getScreenIdForStep,
  getBackTargetStep,
  getInitFunctionForStep,
  isWarpStep,
};
