export function timerManager( globals, appSettingsFns, enableGameOver ) {
  const { timerContainer, countdown } = globals.selectors;
  const { setTimer, getTimer } = appSettingsFns;

  const initialTime = getTimer();
  let remainingTime;

  function _showCountdown() {
    timerContainer.classList.remove("invisible");
  }

  function _hideCountdown() {
    timerContainer.classList.add("invisible");
  }

  function _updateCountdown(time) {
    countdown.textContent = time;
  }

  function _resetCountdown() {
    setTimer(initialTime);
  }

  function _startCountdown(time) {
    remainingTime = time;
    const countdownInterval = setInterval(() => {
      _showCountdown();
      _updateCountdown(remainingTime);
      if (remainingTime <= 0) {
        _hideCountdown();
        enableGameOver();
        _resetCountdown();
        clearInterval(countdownInterval);
      }
      remainingTime--;
    }, 1000); // Update every 1 second
  }

  function initializeCountdown() {
    if(getTimer() > 0){
      _startCountdown(getTimer());
    }
  }

  return {
    initializeCountdown,
  };
}