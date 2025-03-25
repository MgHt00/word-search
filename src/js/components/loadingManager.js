export function loadingManager(selectors) {
  const { overlay, loadingDIV, reloadDIV, squareFrame, sectionWordList } = selectors;

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

  function freeze() {
    _dim();
    loadingDIV.classList.remove("invisible");
  }

  function unfreeze() {
    _unDim();
    loadingDIV.classList.add("invisible");
  }

  function reload() {
    _dim();
    reloadDIV.classList.remove("invisible");
  }

  return {
    freeze,
    unfreeze,
    reload,
  };
}