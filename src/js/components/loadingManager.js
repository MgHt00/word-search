export function loadingManager(globals, generateSqs, fill, initializeCallback) { 
  const { selectors, appData } = globals;
  const { overlay, loadingDIV, restartDIV, squareFrame, sectionWordList } = selectors;

  let _initializeInteraction = initializeCallback;
  
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

  function _freeze() {
    _dim();
    _showLoader();
  }

  function _unfreeze() {
    _unDim();
    _hideLoader();
  }

  function setInitializeCallback(callback) {
    _initializeInteraction = callback;
  }

  function enableRestart() {
    _dim();
    _showRestart();
  }

  async function start() {
    _freeze();
    generateSqs();
    await fill([...globals.appData.wordList], appData.noOfWordsToDisplay); // uncomment for normal situation
    //await fill([...testWordList], noOfWordsToDisplay); // comment this after testing.
    _unfreeze();
    _initializeInteraction();
  }

  async function restart() {
    console.info("RESTART");
  }

  return {
    start,
    enableRestart,
    restart,
    setInitializeCallback,
  };
}
