export function globalDataManager(globals) {
  const { appData, appState, selectors, wordPlacementData } = globals;
  const { squareIdToChar, startIDAndEndID, placedWordCoordinates } = wordPlacementData;

  // --- Word Placement Data Management ---
  const wordPlacement = {
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
  const wordPlacementQuery = {
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
  const settingFormState = {
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
    wordPlacement,
    wordPlacementQuery,
    settingFormState,
  };
}