export function globalDataManager(globals) {
  const { appData, selectors, wordPlacementData } = globals; 
  const { squareIdToChar, startIDAndEndID, placedWordCoordinates } = wordPlacementData; 

  function addPlacedWordCoordinates(word, placementData, coordinates) {
    placedWordCoordinates.set(word, { placementData, direction: coordinates.direction });
  }

  function addSquareIdToChar(squareID, char) {
    squareIdToChar.set(squareID, char);
  }

  /*function isStartSquare(squareID) {
    return startIDAndEndID.has(squareID);
  }
  
  function getEndSquareFromGlobal(key) {
    return startIDAndEndID.get(key);
  }

  function storeStartIDAndEndID(startSquareID, endSquareID) {
    wordPlacementData.startIDAndEndID.set(startSquareID, endSquareID);
  }*/

  // Check if the squareID exists as a key in any of the objects
  function isStartSquare(squareID) {
    return startIDAndEndID.some((obj) => obj.hasOwnProperty(squareID));
  }

  // Find all end squares associated with the given start square
  function getEndSquareFromGlobal(squareID) {
    const endSquares = startIDAndEndID
      .filter((obj) => obj.hasOwnProperty(squareID))
      .map((obj) => obj[squareID]); //extract the end square.
    return endSquares.length > 0 ? endSquares : null;
  }

  function storeStartIDAndEndID(startSquareID, endSquareID) {
    wordPlacementData.startIDAndEndID.push({ [startSquareID]: endSquareID }); // [] is for Computed Property Names: 
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
    storeStartIDAndEndID,
    findSelectedWordInGlobal,
    getSquareIDsOfSelectedWord
  };
}