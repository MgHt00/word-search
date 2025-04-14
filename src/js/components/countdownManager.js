export function countdownManager( globals, appSettingsFns ) {
  let _enableGameOver;
  function setCoundownManagerCallbacks(enableGameOver) {
    _enableGameOver = enableGameOver;
  }
  
  const { countdownContainer, countdown } = globals.selectors;
  const { setCountdown, getCountdown } = appSettingsFns;

  const initialTime = getCountdown();
  let remainingTime;
  let countdownInterval;

  const countdownUtils = {
    formatTimeMMSS(seconds) { // [sn5]
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },

    formatTimeToSeconds(timeString) {
      const parts = timeString.split(':');
      const mins = parseInt(parts[0], 10);
      const secs = parseInt(parts[1], 10);
      return mins * 60 + secs;
    },

    convertMinutesToSeconds(minutes) {
      const parsedMinutes = parseInt(minutes, 10);
      if (isNaN(parsedMinutes)) {
        console.error("Invalid minutes value:", minutes);
        return 0; 
      }
      return parsedMinutes * 60;
    },

    convertSecondsToMinutes(seconds) {
      const parsedSeconds = parseInt(seconds, 10);
      if (isNaN(parsedSeconds)) {
        console.error("Invalid seconds value:", seconds);
        return 0; 
      }
      return parsedSeconds / 60;
    },
  }

  function _showCountdown() { countdownContainer.classList.remove("invisible"); }
  function _hideCountdown() { countdownContainer.classList.add("invisible"); }
  function _updateCountdownDisplay(time) { countdown.textContent = countdownUtils.formatTimeMMSS(time); }
  
  function _resetCountdown() {
    setCountdown(initialTime);
  }

  function _startCountdown(time) {
    remainingTime = time;
    _updateCountdownDisplay(remainingTime);
    countdownInterval = setInterval(() => {
      _updateCountdownDisplay(remainingTime);
      if (remainingTime === 0) {
        _hideCountdown();
        _enableGameOver();
        _resetCountdown();
        clearInterval(countdownInterval);
      }
      remainingTime--;
    }, 1000); 
  }

  function stopCountdown() {
    clearInterval(countdownInterval);
  }

  function resetAndHideCountdown() {
    stopCountdown();
    _hideCountdown();
  }

  function initializeCountdown() {
    if(getCountdown() !== 0){
      _showCountdown();
      _startCountdown(getCountdown());
    } 
  }

  return {
    setCoundownManagerCallbacks,
    initializeCountdown,
    stopCountdown,
    resetAndHideCountdown,
    countdownUtils,
  };
}