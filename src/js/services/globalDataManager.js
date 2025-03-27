export function globalDataManager(globals) {
  const { appData, selectors, wordPlacementData } = globals; 
  const { squareIdToChar, startIDAndEndID, placedWordCoordinates } = wordPlacementData; 

  function addPlacedWordCoordinates(word, placementData, coordinates) {
    placedWordCoordinates.set(word, { placementData, direction: coordinates.direction });
  }

  function addSquareIdToChar(squareID, char) {
    squareIdToChar.set(squareID, char);
  }

  // Check if the squareID exists as a key in any of the objects
  function isStartSquare(squareID) {
    return startIDAndEndID.some((obj) => obj.hasOwnProperty(squareID));
  }

  // Find all end squares associated with the given start square
  function getEndSquaresFromGlobal(squareID) {
    const endSquares = startIDAndEndID
      .filter((obj) => obj.hasOwnProperty(squareID))
      .map((obj) => obj[squareID]); //extract the end square.
    return endSquares.length > 0 ? endSquares : null;
  }

  function getAllEndSquares() {
    const allEndSquares = startIDAndEndID
      .map(obj => Object.values(obj))
      .flat();
    return allEndSquares;
  }

  function getAllPlacedWords() {
    return Array.from(placedWordCoordinates.keys());
  }
  

  function storeStartIDAndEndID(startSquareID, endSquareID) {
    wordPlacementData.startIDAndEndID.push({ [startSquareID]: endSquareID }); // [] is for Computed Property Names: 
  }

  function findSelectedWordInGlobal(startSquareID, endSquareID) {
    for (const [word, entry] of placedWordCoordinates) {
      const storedStartSquareID = entry.placementData[0];
      const storedEndSquareID = entry.placementData[entry.placementData.length - 1];
      if (storedStartSquareID === startSquareID && storedEndSquareID === endSquareID) {
        return word; 
      }
    }
    return undefined; 
  }
  
  function getSquareIDsOfSelectedWord(key) {
    const entry = placedWordCoordinates.get(key);
    return entry.placementData;
  }

  function reset_wordPlacementData() {
    squareIdToChar.clear();
    placedWordCoordinates.clear();
    startIDAndEndID.length = 0;
  }
  

  return {
    addPlacedWordCoordinates,
    addSquareIdToChar,
    isStartSquare,
    getEndSquaresFromGlobal,
    getAllEndSquares,
    getAllPlacedWords,
    storeStartIDAndEndID,
    findSelectedWordInGlobal,
    getSquareIDsOfSelectedWord,
    reset_wordPlacementData,
  };
}