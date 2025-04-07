export function timerManager( globals, appSettingsFns, enableGameOver ) {
  const { timerContainer, countdown } = globals.selectors;
  const { setCountdown, getCountdown } = appSettingsFns;

  const initialTime = getCountdown();
  let remainingTime;
  let countdownInterval;

  function _showCountdown() { timerContainer.classList.remove("invisible"); }
  function _hideCountdown() { timerContainer.classList.add("invisible"); }
  function _updateCountdownDisplay(time) { countdown.textContent = formatTimeMMSS(time); }

  function formatTimeMMSS(seconds) { // [sn5]
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }  

  function _resetCountdown() {
    setCountdown(initialTime);
  }

  function _startCountdown(time) {
    remainingTime = time;
    _showCountdown();
    _updateCountdownDisplay(remainingTime);
    countdownInterval = setInterval(() => {
      _updateCountdownDisplay(remainingTime);
      if (remainingTime <= 0) {
        _hideCountdown();
        enableGameOver();
        _resetCountdown();
        clearInterval(countdownInterval);
      }
      remainingTime--;
    }, 1000); 
  }

  function pauseCountdown() {
    clearInterval(countdownInterval);
  }

  function initializeCountdown() {
    if(getCountdown() > 0){
      _startCountdown(getCountdown());
    }
  }

  return {
    initializeCountdown,
    pauseCountdown,
    formatTimeMMSS,
  };
}