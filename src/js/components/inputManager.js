import { ELEMENTIDS } from "../constants/selectors.js";

export function inputManager(globals, appSettingsFns, appDataFns, settingFormStateFns, countdownUtils) {
  const { selectors } = globals;
  const { wordCountInput, wordCountDisplay, maxLengthInput, maxLengthDisplay, countdownInput, countdownDisplay } = selectors;
  const { setWordCount, setWordsMaxLength, setCountdownTime, getMinAndMaxWordCount, getWordCount, getMinAndMaxCounter, getWordsMaxLength, getCountdownTime } = appSettingsFns;
  const { getMinAndMaxWordLength } = appDataFns;
  const { isSettingFormOpen, setSettingFormOpen, setSettingFormClosed } = settingFormStateFns;
  const { formatTimeMMSS, convertMinutesToSeconds, convertSecondsToMinutes } = countdownUtils;

  let _restart;  
  function setInputManagerCallbacks(restart) {
    _restart = restart;
  }

  function _setWordCountRange(count) {  
    wordCountInput.value = count;
    wordCountDisplay.value = count;
  }

  function _setMaxLengthRange(length) {
    maxLengthInput.value = length;
    maxLengthDisplay.value = length;
  }

  function _setCountdownRange(seconds) {
    const minutes = convertSecondsToMinutes(seconds);
    countdownInput.value = minutes;
    if (minutes !== 0 ) countdownDisplay.value = formatTimeMMSS((seconds));
    else countdownDisplay.value = "Off";    
  }

  // --- functions to set HTML attributes of setting form dynamically ---
  function _setHTMLWordCountAttributes() {
    const { minWordCount, maxWordCount } = getMinAndMaxWordCount();
    wordCountInput.setAttribute("min", minWordCount);
    wordCountInput.setAttribute("max", maxWordCount);
  }

  function _setHTMLMaxLengthAttributes() {
    const { minWordLength, maxWordLength } = getMinAndMaxWordLength();
    maxLengthInput.setAttribute("min", minWordLength);
    maxLengthInput.setAttribute("max", maxWordLength);
  }

  function _setHTMLCountdownAttributes() {
    const { minCountdown, maxCountdown } = getMinAndMaxCounter();
    countdownInput.setAttribute("min", convertSecondsToMinutes(minCountdown));
    countdownInput.setAttribute("max", convertSecondsToMinutes(maxCountdown));
  }

  function _syncOffcanvasWithGlobal() {
    _setHTMLWordCountAttributes();
    _setHTMLMaxLengthAttributes();
    _setHTMLCountdownAttributes();
    _setWordCountRange(getWordCount());
    _setMaxLengthRange(getWordsMaxLength()); 
    _setCountdownRange(getCountdownTime());
  }
  
  function _addRangeListeners() {
    wordCountInput.addEventListener("input", () => {
      _setWordCountRange(wordCountInput.value);
    });

    maxLengthInput.addEventListener("input", () => {
      _setMaxLengthRange(maxLengthInput.value);
    });

    countdownInput.addEventListener("input", () => {
      _setCountdownRange(convertMinutesToSeconds(countdownInput.value));
    });
  }

  function _addReloadListener(_reloadBtn) {
    _reloadBtn.addEventListener("click", _handleSettingFormSubmit);
  }

  function _removeReloadListener(_reloadBtn) {
    _reloadBtn.removeEventListener("click", _handleSettingFormSubmit);
  }

  function _queryOffcanvasElements() {
    const _offcanvasElement = document.querySelector(ELEMENTIDS.OFFCANVAS_ELEMENT);
    const _reloadBtn = document.querySelector(ELEMENTIDS.RELOAD_BTN);

    if (!_offcanvasElement || !_reloadBtn) {
      console.error("Offcanvas elements not found.");
      return null;
    }

    return { _offcanvasElement, _reloadBtn };
  }

  function _addOffcanvasListener() {
    const { _offcanvasElement, _reloadBtn } = _queryOffcanvasElements();
    if (!_offcanvasElement || !_reloadBtn) return;

    _offcanvasElement.addEventListener('shown.bs.offcanvas', () => {
      setSettingFormOpen();
      _syncOffcanvasWithGlobal();
      _addRangeListeners();
      _addReloadListener(_reloadBtn);
      console.log("Offcanvas is fully shown. Flag:", isSettingFormOpen());
    });

    _offcanvasElement.addEventListener('hidden.bs.offcanvas', () => {
      setSettingFormClosed();
      _removeReloadListener(_reloadBtn);
      console.log("Offcanvas is fully hidden. Flag:", isSettingFormOpen());
    });

    // REF: Other offcanvas event types: show.bs.offcanvas, hide.bs.offcanvas
  }

  function _closeOffcanvas() {
    const { _offcanvasElement } = _queryOffcanvasElements();
    if (!_offcanvasElement) return;

    bootstrap.Offcanvas.getInstance(_offcanvasElement).hide();
  }

  function _handleSettingFormSubmit(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    setWordCount(parseInt(wordCountInput.value, 10));
    setWordsMaxLength(parseInt(maxLengthInput.value, 10));
    setCountdownTime(convertMinutesToSeconds(countdownInput.value));
    setSettingFormClosed();

    console.info("RELOAD. User's Global Data:", { wordCount: globals.settingData.wordCount, wordsMaxLength: globals.settingData.wordsMaxLength, countdownMode: globals.settingData.countdownMode, countdown: globals.settingData.countdown });
    _closeOffcanvas();
    _restart();
  }

  function initializeInput() {
    _addOffcanvasListener();
  }

  return {
    initializeInput,
    setInputManagerCallbacks,
  };

}