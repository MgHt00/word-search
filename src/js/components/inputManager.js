export function inputManager(globals) {
  const { selectors } = globals;
  const { offcanvasElement, wordCountInput, wordCountDisplay, maxLengthInput, maxLengthDisplay } = selectors;
  let settingForm = null;

  function _addRangeListener() {
    wordCountInput.addEventListener("input", () => {
      wordCountDisplay.textContent = wordCountInput.value;
    });

    maxLengthInput.addEventListener("input", () => {
      maxLengthDisplay.textContent = maxLengthInput.value;
    });
  }

  function _querySettingForm() {
    settingForm = document.querySelector("#setting-form");
    return settingForm;
  }

  function _addOffcanvasListener() {
    //const offcanvasElement = document.getElementById('offcanvasNavbar'); // Replace 'offcanvasScrolling' with the actual ID of your offcanvas element
    if (offcanvasElement) {
      offcanvasElement.addEventListener('show.bs.offcanvas', () => {
        console.log("Offcanvas is about to be shown.");
        _querySettingForm();
        console.info("Setting form:", settingForm);
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
    console.info("Setting form:", settingForm);
    _addRangeListener();
  }

  return {
    initializeInput,
  };

}