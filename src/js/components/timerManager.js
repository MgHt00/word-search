export function timerManager( globals, appSettingsFns ) {
  const { timerContainer, countdown } = globals.selectors;
  const { setTimer, getTimer } = appSettingsFns;

  let remainingTime;

  function _showCountdown() {
    timerContainer.classList.remove("invisible");
  }

  function _hideCountdown() {
    timerContainer.classList.add("invisible");
  }

  function _stopCountdown() {
    _hideCountdown();
  }

  function _updateCountdown(time) {
    countdown.textContent = time;
  }

  function _startCountdown(time) {
    _showCountdown();

    remainingTime = time;
    const countdownInterval = setInterval(() => {
      _updateCountdown(remainingTime);
      if (remainingTime <= 0) {
        _stopCountdown();
        clearInterval(countdownInterval);
      }
      remainingTime--;
    }, 1000); // Update every 1 second
  }

  function initializeTimer() {
    if(getTimer() > 0){
      _startCountdown(getTimer());
    }
  }

  return {
    initializeTimer,
  };
}