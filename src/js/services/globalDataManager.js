export function globalDataManager(globals) {
  const { settingData, appData, appState, selectors, wordPlacementData } = globals;
  const { squareIdToChar, startIDAndEndID, placedWordCoordinates } = wordPlacementData;

  // --- App Settings Management ---
  const appSettingsFns = {
    setWordCount(count) { 
      settingData.wordCount = count; 
    },

    setWordsMaxLength(length) {
      settingData.wordsMaxLength = length;
    },

    setCountdown(time) {
      settingData.countdown = time;
      console.info("setCountdown() called, Countdown: ", settingData.countdown, "seconds");
    },

    setGridSize(size) {
      settingData.gridSize = size;
    },
    
    getMinAndMaxWordCount() {
      return {
        minWordCount: settingData.minWordCount,
        maxWordCount: settingData.maxWordCount,
      };
    },

    getWordCount(){
      return settingData.wordCount;
    },

    getWordsMaxLength(){
      return settingData.wordsMaxLength;
    },

    getCountdown(){
      return settingData.countdown;
    },

    getGridSize(){
      return settingData.gridSize;
    },
  };

  // --- App Data Management ---
  const appDataFns = {
    setJsonData(data) {
      appData.jsonData = data;
    },

    setMinWordLength(length) {
      appData.minWordLength = length;
    },

    setMaxWordLength(length) {
      appData.maxWordLength = length;
    },

    getJsonData(){
      return appData.jsonData;
    },

    getMinWordLength() {
      return appData.minWordLength;
    },

    getMaxWordLength() {
      return appData.maxWordLength;
    },
  };

  // --- Word Placement Data Management ---
  const wordPlacementFns = {
    addPlacedWordCoordinates(word, placementData, coordinates) {
      placedWordCoordinates.set(word, { placementData, direction: coordinates.direction });
    },

    addSquareIdToChar(squareID, char) {
      squareIdToChar.set(squareID, char);
    },

    storeStartIDAndEndID(startSquareID, endSquareID) {
      startIDAndEndID.push({ [startSquareID]: endSquareID });
    },

    reset_wordPlacementData() {
      squareIdToChar.clear();
      placedWordCoordinates.clear();
      startIDAndEndID.length = 0;
    },
  };

  // --- Word Placement Data Querying ---
  const wordPlacementQueryFns = {
    isStartSquare(squareID) {
      return startIDAndEndID.some((obj) => obj.hasOwnProperty(squareID));
    },

    getEndSquaresFromGlobal(squareID) {
      const endSquares = startIDAndEndID
        .filter((obj) => obj.hasOwnProperty(squareID))
        .map((obj) => obj[squareID]);
      return endSquares.length > 0 ? endSquares : null;
    },

    getAllEndSquares() {
      const allEndSquares = startIDAndEndID.map((obj) => Object.values(obj)).flat();
      return allEndSquares;
    },

    getAllPlacedWords() {
      return Array.from(placedWordCoordinates.keys());
    },

    findSelectedWordInGlobal(startSquareID, endSquareID) {
      for (const [word, entry] of placedWordCoordinates) {
        const storedStartSquareID = entry.placementData[0];
        const storedEndSquareID = entry.placementData[entry.placementData.length - 1];
        if (storedStartSquareID === startSquareID && storedEndSquareID === endSquareID) {
          return word;
        }
      }
      return undefined;
    },

    getSquareIDsOfSelectedWord(key) {
      const entry = placedWordCoordinates.get(key);
      return entry.placementData;
    },
  };

  // --- Setting Form State Management ---
  const settingFormStateFns = {
    isSettingFormOpen() {
      return appState.isSettingFormOpen;
    },

    setSettingFormOpen() {
      appState.isSettingFormOpen = true;
    },

    setSettingFormClosed() {
      appState.isSettingFormOpen = false;
    },
  };

  return {
    appSettingsFns,
    appDataFns,
    wordPlacementFns,
    wordPlacementQueryFns,
    settingFormStateFns,
  };
}