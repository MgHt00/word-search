export function loadingManager(globals, generateSqs, fill, reset_wordPlacementData, initializeCallback) { 
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

  function _showspinner() {
    loadingDIV.classList.remove("invisible");
  }

  function _hidespinner() {
    loadingDIV.classList.add("invisible");
  }

  function _showRestartButton() {
    restartDIV.classList.remove("invisible");
  }

  function _hideRestartButton() {
    restartDIV.classList.add("invisible");
  }

  function _emptySqaureFrame() {
    squareFrame.innerHTML = "";
  }

  function _emptySectionWordList() {
    sectionWordList.innerHTML = "";
  }
  
  function setInitializeCallback(callback) {
    _initializeInteraction = callback;
  }

  function enableRestart() {
    _dim();
    _showRestartButton();
  }

  function _disableRestart() {
    _unDim();
    _hideRestartButton();
  }

  async function start() {
    _dim();
    _showspinner();
    generateSqs();
    await fill([...globals.appData.wordList], appData.noOfWordsToDisplay); // uncomment for normal situation
    //await fill([...testWordList], noOfWordsToDisplay); // comment this after testing.
    _unDim();
    _hidespinner();
    _initializeInteraction();
  }

  async function restart() {
    console.info("RESTART");
    _dim();
    reset_wordPlacementData();
    _showspinner();
    _emptySqaureFrame();
    _emptySectionWordList();
    generateSqs();
    await fill([...globals.appData.wordList], appData.noOfWordsToDisplay);
    _hidespinner();
    _disableRestart(); 
    _initializeInteraction();
  }

  return {
    start,
    enableRestart,
    restart,
    setInitializeCallback,
  };
}
