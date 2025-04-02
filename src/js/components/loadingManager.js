export function loadingManager(globals, generateSqs, getWordsUpToLength, fill, reset_wordPlacementData, initializeCallbackObj) { 
  const { selectors, appData } = globals;
  const { overlay, loadingDIV, restartDIV, squareFrame, sectionWordList } = selectors;
  const { wordCount, wordsMaxLength } = appData;
  //const { reset_wordPlacementData } = wordPlacementQuery;

  let {_initializeGameWords, _initializeInteraction} = initializeCallbackObj;
  
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

  function _emptySquareFrame() {
    squareFrame.innerHTML = "";
  }

  function _emptySectionWordList() {
    sectionWordList.innerHTML = "";
  }
  
  function setInitializeCallback({ initializeGameWords, initializeInteraction }) {
    _initializeGameWords = initializeGameWords;
    _initializeInteraction = initializeInteraction;
  }

  function enableRestart() {
    _dim();
    _showRestartButton();
  }

  function _disableRestart() {
    _unDim();
    _hideRestartButton();
  }

  // To prevent infinite loop when fill
  function _capWordsToDisplay(wordsArray, wordCount) {
    return (wordsArray.length < wordCount) ? wordsArray.length : wordCount;
  }


  async function _getWordsAndFill() {
    const wordsArray = await getWordsUpToLength(wordsMaxLength);
    if (!wordsArray) {
      console.error("Failed to load words. Cannot proceed.");
      return;
    }
    const validatedWordCount = _capWordsToDisplay(wordsArray, wordCount);
    await fill(wordsArray, validatedWordCount); // uncomment for normal situation
    //await fill([...testWordList], validatedWordCount); // comment this after testing.
  }

  async function start() {
    _dim();
    _showspinner();
    generateSqs();
    await _getWordsAndFill();
    _unDim();
    _hidespinner();
    _initializeGameWords();
    _initializeInteraction();
  }

  async function restart() {
    console.info("RESTART");
    _dim();
    reset_wordPlacementData();
    _showspinner();
    _emptySquareFrame();
    _emptySectionWordList();
    generateSqs();
    await _getWordsAndFill();
    _hidespinner();
    _disableRestart(); 
    _initializeGameWords();
  }

  return {
    start,
    enableRestart,
    restart,
    setInitializeCallback,
  };
}
