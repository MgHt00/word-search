export function loadingManager(selectors) {
  const { overlay, loadingDIV, restartDIV, squareFrame, sectionWordList } = selectors;

  function _dim() {
    squareFrame.classList.add("dim");
    sectionWordList.classList.add("dim");
    overlay.classList.remove("invisible"); // bootstrap class
    overlay.classList.add("visible");
  }

  function _unDim() {
    squareFrame.classList.remove("dim");
    sectionWordList.classList.remove("dim");
    overlay.classList.remove("visible");
    overlay.classList.add("invisible");
  }

  function _showLoader() {
    loadingDIV.classList.remove("invisible");
  }

  function _hideLoader() {
    loadingDIV.classList.add("invisible");
  }

  function _showRestart() {
    restartDIV.classList.remove("invisible");
  }

  function freeze() {
    _dim();
    _showLoader();
  }

  function unfreeze() {
    _unDim();
    _hideLoader();
  }

  function enableRestart() {
    _dim();
    _showRestart();
  }

  return {
    freeze,
    unfreeze,
    enableRestart,
  };
}