export function timerManager( globals, appSettingsFns, enableGameOver ) {
  const { timerContainer, countdown } = globals.selectors;
  const { setTimer, getTimer } = appSettingsFns;

  const initialTime = getTimer();
  let remainingTime;
  let countdownInterval;

  function _showCountdown() {
    timerContainer.classList.remove("invisible");
  }

  function _hideCountdown() {
    timerContainer.classList.add("invisible");
  }

  function _updateCountdown(time) { // [sn5]
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
  
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    countdown.textContent = formattedTime;
  }

  function _resetCountdown() {
    setTimer(initialTime);
  }

  function _startCountdown(time) {
    remainingTime = time;
    _showCountdown();
    _updateCountdown(remainingTime);
    countdownInterval = setInterval(() => {
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

  function pauseCountdown() {
    clearInterval(countdownInterval);
  }

  function initializeCountdown() {
    if(getTimer() > 0){
      _startCountdown(getTimer());
    }
  }

  return {
    initializeCountdown,
    pauseCountdown,
  };
}