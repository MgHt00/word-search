// No more export here!
const directionOffsets = new Map([
  ["north", { row: -1, col: 0 }],
  ["north-east", { row: -1, col: 1 }],
  ["east", { row: 0, col: 1 }],
  ["south-east", { row: 1, col: 1 }],
  ["south", { row: 1, col: 0 }],
  ["south-west", { row: 1, col: -1 }],
  ["west", { row: 0, col: -1 }],
  ["north-west", { row: -1, col: -1 }],
]);

function placementHelpers() {
  function _charCheck(row, col, char, charMap, placementData, { _createSquareId, _isCharMatch, _addPlacementData }) {
    let squareID = _createSquareId(row, col);
    let isCheckOK = _isCharMatch(squareID, char, charMap);
    if (isCheckOK) {
      _addPlacementData(placementData, squareID, char);
      return true;
    } else return false;
  }

  function _createSquareId(row, col) {
    return `sq-${row}-${col}`;
  }

  // Checks if a given square is compatible with a character to be placed.
  function _isCharMatch(currentSq, char, charMap) {
    if (!charMap.get(currentSq)) {
      //console.log("No char in the sq. Good to go!");
      return true;
    }
    else if (charMap.get(currentSq) === char) {
      //console.log("Existing char in sq is same as incoming. Good to go!");
      return true;
    }
    else {
      console.warn({
        oneByOneCheckFail: {
          char,
          currentSq,
          storedChar: charMap.get(currentSq),
        }
      });
      //console.warn("Existing char in sq is NOT same as incoming. FAIL.");
      return false;
    }
  }

  function _addPlacementData(placementData, squareID, char) {
    placementData[squareID] = char;  // add char to a local variable
  }

  function _updateRowAndCol(offset) {
    let currentRow = 0;
    let currentCol = 0;
    currentRow += offset.row;
    currentCol += offset.col;
    return { currentRow, currentCol };
  }
  
  return {
    compareExistingChar: function compareExistingChar(randomCoordinates, selectedWord, charMap) {
      console.info("selectedWord:", selectedWord);

      let { direction, startingRow, startingCol } = randomCoordinates;
      let offset = directionOffsets.get(direction);
      let wordSpread = [...selectedWord];
      let placementData = {}; // to store squareID : char

      let currentRow = startingRow;
      let currentCol = startingCol;

      for (let i = 0; i < wordSpread.length; i++) {
        let charCheckOK = _charCheck(currentRow, currentCol, wordSpread[i], charMap, placementData, { _createSquareId, _isCharMatch, _addPlacementData });
        if (!charCheckOK) return false;
        const newCoordinates = _updateRowAndCol(offset);
        currentRow += newCoordinates.currentRow;
        currentCol += newCoordinates.currentCol;
      }
      return placementData;
    }
  };
}

export const { compareExistingChar } = placementHelpers();