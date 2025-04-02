import { ELEMENTIDS } from "../constants/selectors.js";

export function inputManager(globals) {
  const { selectors } = globals;
  const { wordCountInput, wordCountDisplay, maxLengthInput, maxLengthDisplay } = selectors;

  function _addRangeListener() {
    wordCountInput.addEventListener("input", () => {
      wordCountDisplay.textContent = wordCountInput.value;
    });

    maxLengthInput.addEventListener("input", () => {
      maxLengthDisplay.textContent = maxLengthInput.value;
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
      offcanvasElement.addEventListener('show.bs.offcanvas', () => {
        console.log("Offcanvas is about to be shown.");
      });

      offcanvasElement.addEventListener('shown.bs.offcanvas', () => {
        console.log("Offcanvas is fully shown.");
      });

      offcanvasElement.addEventListener('hide.bs.offcanvas', () => {
        console.log("Offcanvas is about to be hidden.");
      });

      offcanvasElement.addEventListener('hidden.bs.offcanvas', () => {
        console.log("Offcanvas is fully hidden.");
      });
    } else {
      console.error("Offcanvas element not found.");
    }
  }

  function initializeInput() {
    _addOffcanvasListener();
    _addRangeListener();
  }

  return {
    initializeInput,
  };

}