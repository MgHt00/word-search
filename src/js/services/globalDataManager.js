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

    setCountdownFlag(flag) {
      if (typeof flag !== 'boolean') {
        console.warn(`setCountdownFlag: Expected a boolean value, received ${typeof flag}. Converting to boolean.`);
        flag = Boolean(flag); 
      }
      settingData.countdownMode = flag;
    },

    setCountdown(time) {
      if (typeof time !== 'number') {
        console.warn(`setCountdown: Expected a number value, received ${typeof time}. Converting to number.`);
        time = Number(time); 
      }

      if (time === 0) {
        settingData.countdownMode = false;
      } else {
        settingData.countdownMode = true;
      }
      
      settingData.countdown = time;
      console.info("setCountdown() called, Countdown: ", { countdownMode: settingData.countdownMode, countdown: settingData.countdown });
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

    getMinAndMaxCounter() {
      return {
        minCountdown: settingData.minCountdown,
        maxCountdown: settingData.maxCountdown,
      };
    },

    getWordCount(){
      return settingData.wordCount;
    },

    getWordsMaxLength(){
      return settingData.wordsMaxLength;
    },

    getCountdownFlag(){
      return settingData.countdownMode;
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

    setMinAndMaxWordLength(min, max) {
      appData.minWordLength = min;
      appData.maxWordLength = max;
    },

    getJsonData(){
      return appData.jsonData;
    },

    getMinAndMaxWordLength() {
      return {
        minWordLength: appData.minWordLength,
        maxWordLength: appData.maxWordLength,
      }
    }
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