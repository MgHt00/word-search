import { ELEMENTIDS } from "../constants/selectors.js";

export function inputManager(globals, appSettingsFns, settingFormStateFns, countdownUtils) {
  const { selectors } = globals;
  const { wordCountInput, wordCountDisplay, maxLengthInput, maxLengthDisplay, countdownInput, countdownDisplay } = selectors;
  const { setWordCount, setWordsMaxLength, setCountdown, getWordCount, getWordsMaxLength, getCountdown } = appSettingsFns;
  const { isSettingFormOpen, setSettingFormOpen, setSettingFormClosed } = settingFormStateFns;
  const { formatTimeMMSS, convertMinutesToSeconds, convertSecondsToMinutes } = countdownUtils;

  function _setWordCountRange(count) {  
    wordCountInput.value = count;
    wordCountDisplay.value = count;
  }

  function _setMaxLengthRange(length, { min, max } = {}) {
    if (min !== null || max !== null) {
      maxLengthInput.min = min;
      maxLengthInput.max = max;
    }   
    maxLengthInput.value = length;
    maxLengthDisplay.value = length;
  }

  function _setCountdownRange(seconds) {
    const minutes = convertSecondsToMinutes(seconds);
    countdownInput.value = minutes;
    countdownDisplay.value = formatTimeMMSS((seconds));
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
    _setWordCountRange(getWordCount());
    _setMaxLengthRange(getWordsMaxLength()); 
    // ဒီမှာ min max ရှာတဲ့  getMinandMaxWordLength() ကိုသုံးရမယ်၊ 
    // သို့သော် အဲ့ဒီ​() က wordArray ကို expect လုပ်နေတယ်။ 
    // wordArray ကို ထုတ်ပြီးတာနဲ့ global ထဲ သိမ်းရင်ကောင်းမလား ၊ wordManager module ထဲမှာပဲ const နဲ့ သိမ်းရင်ကောင်းမလား ၊ တခြားနည်း ကောင်းမလား ရှာရမယ်။
    _setCountdownRange(getCountdown());

    _addOffcanvasListener();
    _addRangeListeners();
  }

  return {
    initializeInput,
  };

}