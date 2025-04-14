export function loadingManager(selectors, appSettingsFns, appDataFns,  gameInitializers, generateSqs, getWordsUpToLength, fill, reset_wordPlacementData, stopCountdown) { 
  const { getJsonData } = appDataFns;
  const { getWordCount, getWordsMaxLength } = appSettingsFns;
  const { initializeGameWords, initializeInteraction, initializeInput, initializeCountdown, resetAndHideCountdown } = gameInitializers;
  const { overlay, loadingDIV, restartDIV, squareFrame, sectionWordList, restartMessage } = selectors;

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

  function _showspinner() { loadingDIV.classList.remove("invisible"); }
  function _hidespinner() { loadingDIV.classList.add("invisible"); }
  function _showRestartButton() { restartDIV.classList.remove("invisible"); }
  function _hideRestartButton() { restartDIV.classList.add("invisible"); }
  function _emptySquareFrame() { squareFrame.innerHTML = ""; }
  function _emptySectionWordList() { sectionWordList.innerHTML = ""; }
  function _updateRestartMessage(message) { restartMessage.textContent = message; }
  function _clearRestartMessage() { restartMessage.textContent = ""; }

  function enableRestart() {
    _dim();
    _updateRestartMessage("Well done! Restart?");
    _showRestartButton();
    stopCountdown();
  }

  function _disableRestart() {
    _clearRestartMessage();
    _unDim();
    _hideRestartButton();
  }

  function enableGameOver() {
    _dim();
    _updateRestartMessage("Game Over!");
    _showRestartButton();
  }

  // To prevent infinite loop when fill
  function _capWordsToDisplay(wordsArray, wordCount) {
    return (wordsArray.length < wordCount) ? wordsArray.length : wordCount;
  }


  async function _getWordsAndFill(wordsArray, wordCount) {
    if (!wordsArray) {
      console.error("Failed to load words. Cannot proceed.");
      return;
    }
    const validatedWordCount = _capWordsToDisplay(wordsArray, wordCount);
    await fill(wordsArray, validatedWordCount); // uncomment for normal situation
    //await fill([...testWordList], validatedWordCount); // comment this after testing.
  }

  async function _loadJSONandFill() {
    //await prepareWordData();
    
    const jsonData = getJsonData();
    const wordsMaxLength = getWordsMaxLength();

    const wordsArray = getWordsUpToLength(jsonData, wordsMaxLength);
    const wordCount = getWordCount();
    await _getWordsAndFill(wordsArray, wordCount);
  }

  async function start() {
    _dim();
    _showspinner();
    generateSqs();
    await _loadJSONandFill();
    initializeCountdown();
    _unDim();
    _hidespinner();
    initializeGameWords();
    initializeInteraction();
    initializeInput();
  }

  async function restart() {
    console.info("RESTART");
    _dim();
    reset_wordPlacementData();
    _showspinner();
    _emptySquareFrame();
    _emptySectionWordList();
    generateSqs();
    await _loadJSONandFill();
    resetAndHideCountdown();
    initializeCountdown();
    _hidespinner();
    initializeInput();
    initializeGameWords();
    _disableRestart(); 
  }

  return {
    start,
    enableRestart,
    enableGameOver,
    restart,
  };
}
