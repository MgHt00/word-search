import { ELEMENTIDS } from "../constants/selectors.js";

export function inputManager(globals, appSettingsFns, settingFormStateFns, initializeCountdown) {
  const { selectors } = globals;
  const { wordCountInput, wordCountDisplay, maxLengthInput, maxLengthDisplay, timerInput, timerDisplay } = selectors;
  const { setWordCount, setWordsMaxLength, setCountdown, getWordCount, getWordsMaxLength, getCountdown } = appSettingsFns;
  const { isSettingFormOpen, setSettingFormOpen, setSettingFormClosed } = settingFormStateFns;

  function _setWordCount(count) {  
    wordCountInput.value = count;
    wordCountDisplay.value = count;
  }

  function _setMaxLength(length) {
    maxLengthInput.value = length;
    maxLengthDisplay.value = length;
  }

  function _setTimer(time) {
    timerInput.value = time;
    timerDisplay.value = time;
  }
  
  function _addRangeListeners() {
    wordCountInput.addEventListener("input", () => {
      console.info(wordCountInput.value);
      wordCountDisplay.value = wordCountInput.value;
    });

    maxLengthInput.addEventListener("input", () => {
      maxLengthDisplay.value = maxLengthInput.value;
    });

    timerInput.addEventListener("input", () => {
      timerDisplay.value = timerInput.value;
    });
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
    const { offcanvasElement, reloadBtn } = _queryOffcanvasElements();
    
    if (offcanvasElement) {
      /*offcanvasElement.addEventListener('show.bs.offcanvas', () => {
        console.log("Offcanvas is about to be shown.");
      });*/

      offcanvasElement.addEventListener('shown.bs.offcanvas', () => {
        setSettingFormOpen();
        reloadBtn.addEventListener("click", _handleSettingFormSubmit);
        console.log("Offcanvas is fully shown.", isSettingFormOpen());
      });

      /*offcanvasElement.addEventListener('hide.bs.offcanvas', () => {
        console.log("Offcanvas is about to be hidden.");
      });*/

      offcanvasElement.addEventListener('hidden.bs.offcanvas', () => {
        setSettingFormClosed();
        reloadBtn.removeEventListener("click", _handleSettingFormSubmit);
        console.log("Offcanvas is fully hidden.", isSettingFormOpen());
      });
    } else {
      console.error("Offcanvas element not found.");
    }
  }

  function _handleSettingFormSubmit(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    console.info("RELOAD BUTTON CLICKED!"); 
  }

  function initializeInput() {
    _setWordCount(getWordCount());
    _setMaxLength(getWordsMaxLength());
    _setTimer(getCountdown());

    _addOffcanvasListener();
    _addRangeListeners();
  }

  return {
    initializeInput,
  };

}