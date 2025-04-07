export function timerManager( globals, appSettingsFns, enableGameOver ) {
  const { timerContainer, countdown } = globals.selectors;
  const { setCountdown, getCountdown } = appSettingsFns;

  const initialTime = getCountdown();
  let remainingTime;
  let countdownInterval;

  function _showCountdown() {
    timerContainer.classList.remove("invisible");
  }

  function _hideCountdown() {
    timerContainer.classList.add("invisible");
  }

  /*function _convertTimeFormat(time) { // [sn5]
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }*/

  function _updateCountdown(time) { 
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
  
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    countdown.textContent = formattedTime;

    //countdown.textContent = _convertTimeFormat(time);
  }

  function _resetCountdown() {
    setCountdown(initialTime);
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
    if(getCountdown() > 0){
      _startCountdown(getCountdown());
    }
  }

  return {
    initializeCountdown,
    pauseCountdown,
  };
}