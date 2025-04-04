import { ELEMENTIDS } from "../constants/selectors.js";

export function inputManager(globals, appSettings, settingFormState) {
  const { selectors } = globals;
  const { wordCountInput, wordCountDisplay, maxLengthInput, maxLengthDisplay, timerInput, timerDisplay } = selectors;
  const { setWordCount, setWordsMaxLength, setTimer, getWordCount, getWordsMaxLength, getTimer } = appSettings;
  const { isSettingFormOpen, setSettingFormOpen, setSettingFormClosed } = settingFormState;

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
  }

  function _queryOffcanvasElement() {
    const offcanvasElement = document.querySelector(ELEMENTIDS.OFFCANVAS_ELEMENT);
    if (!offcanvasElement) {
      console.error("Offcanvas element not found.");
      return null;
    } 
      return offcanvasElement;
  }

  function _addOffcanvasListener() {
    const offcanvasElement = _queryOffcanvasElement();
    
    if (offcanvasElement) {
      /*offcanvasElement.addEventListener('show.bs.offcanvas', () => {
        console.log("Offcanvas is about to be shown.");
      });*/

      offcanvasElement.addEventListener('shown.bs.offcanvas', () => {
        setSettingFormOpen();
        console.log("Offcanvas is fully shown.", isSettingFormOpen());
      });

      /*offcanvasElement.addEventListener('hide.bs.offcanvas', () => {
        console.log("Offcanvas is about to be hidden.");
      });*/

      offcanvasElement.addEventListener('hidden.bs.offcanvas', () => {
        setSettingFormClosed();
        console.log("Offcanvas is fully hidden.", isSettingFormOpen());
      });
    } else {
      console.error("Offcanvas element not found.");
    }
  }

  function initializeInput() {
    _setWordCount(getWordCount());
    _setMaxLength(getWordsMaxLength());
    _setTimer(getTimer());

    _addOffcanvasListener();
    _addRangeListeners();
  }

  return {
    initializeInput,
  };

}