import { ELEMENTIDS } from "../constants/selectors.js";

export function inputManager(globals, appSettingsFns, appDataFns, settingFormStateFns, countdownUtils) {
  const { selectors } = globals;
  const { wordCountInput, wordCountDisplay, maxLengthInput, maxLengthDisplay, countdownInput, countdownDisplay } = selectors;
  const { setWordCount, setWordsMaxLength, setCountdown, getMinAndMaxWordCount, getWordCount, getMinAndMaxCounter, getWordsMaxLength, getCountdown } = appSettingsFns;
  const { getMinAndMaxWordLength } = appDataFns;
  const { isSettingFormOpen, setSettingFormOpen, setSettingFormClosed } = settingFormStateFns;
  const { formatTimeMMSS, convertMinutesToSeconds, convertSecondsToMinutes } = countdownUtils;

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
    countdownDisplay.value = formatTimeMMSS((seconds));
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
    _setCountdownRange(getCountdown());
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

  function _addReloadListener(reloadBtn) {
    reloadBtn.addEventListener("click", _handleSettingFormSubmit);
  }

  function _removeReloadListener(reloadBtn) {
    reloadBtn.removeEventListener("click", _handleSettingFormSubmit);
  }

  function _queryOffcanvasElements() {
    const offcanvasElement = document.querySelector(ELEMENTIDS.OFFCANVAS_ELEMENT);
    const reloadBtn = document.querySelector(ELEMENTIDS.RELOAD_BTN);

    if (!offcanvasElement) {
      console.error("Offcanvas elements not found.");
      return null;
    } else if (!reloadBtn) {
      console.error("Reload Button not found");
      return null;
    }
      return { offcanvasElement, reloadBtn };
  }

  function _addOffcanvasListener() {
    const offcanvasElements = _queryOffcanvasElements();
    if (!offcanvasElements) return;

    const { offcanvasElement, reloadBtn } = offcanvasElements;

    offcanvasElement.addEventListener('shown.bs.offcanvas', () => {
      setSettingFormOpen();
      _syncOffcanvasWithGlobal();
      _addRangeListeners();
      _addReloadListener(reloadBtn);
      console.log("Offcanvas is fully shown.", isSettingFormOpen());
    });

    offcanvasElement.addEventListener('hidden.bs.offcanvas', () => {
      setSettingFormClosed();
      _removeReloadListener(reloadBtn);
      console.log("Offcanvas is fully hidden.", isSettingFormOpen());
    });

    // REF: Other offcanvas event types: show.bs.offcanvas, hide.bs.offcanvas
  }

  function _handleSettingFormSubmit(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    console.info("RELOAD BUTTON CLICKED!"); 
  }

  function initializeInput() {
    _addOffcanvasListener();
  }

  return {
    initializeInput,
  };

}