export function globalDataManager(globals) {
  const { appData, selectors, wordPlacementData } = globals; 
  const { squareIdToChar, startIDAndEndID, placedWordCoordinates } = wordPlacementData; 

  function addPlacedWordCoordinates(word, placementData, coordinates) {
    placedWordCoordinates.set(word, { placementData, direction: coordinates.direction });
  }

  function addSquareIdToChar(squareID, char) {
    squareIdToChar.set(squareID, char);
  }

  function isStartSquare(squareID) {
    return startIDAndEndID.has(squareID);
  }
  
  function getEndSquareFromGlobal(key) {
    return startIDAndEndID.get(key);
  }
  
  function findSelectedWordInGlobal(endSquareID) {
    for (const [word, entry] of placedWordCoordinates) { 
      const storedEndSquareID = entry.placementData[entry.placementData.length - 1];
      if (storedEndSquareID === endSquareID) {
        return word; 
      }
    }
    return undefined; 
  }
  
  function getSquareIDsOfSelectedWord(key) {
    const entry = placedWordCoordinates.get(key);
    return entry.placementData;
  }

  return {
    addPlacedWordCoordinates,
    addSquareIdToChar,
    isStartSquare,
    getEndSquareFromGlobal,
    findSelectedWordInGlobal,
    getSquareIDsOfSelectedWord
  };
}