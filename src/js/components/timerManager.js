export function timerManager(globals) {
  const { timerContainer } = globals.selectors;

  function _hideTimer() {
    timerContainer.classList.add("invisible");
  }

  

  function initializeTimer() {
    _hideTimer();
  }

  return {
    initializeTimer,
  };
}