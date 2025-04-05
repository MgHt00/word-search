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
    // if one digit, need to add zero at the start.
  }

  function _resetCountdown() {
    setTimer(initialTime);
  }

  function _startCountdown(time) {
    remainingTime = time;
    _showCountdown();
    _updateCountdown("--");
    const countdownInterval = setInterval(() => {
      _updateCountdown(remainingTime);
      if (remainingTime <= 0) {
        _hideCountdown();
        enableGameOver();
        _resetCountdown();
        clearInterval(countdownInterval);
      }
      remainingTime--;
    }, 1000); 
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