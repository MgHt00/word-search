export const directionOffsets = new Map([
  ["north", { row: -1, col: 0 }],
  ["north-east", { row: -1, col: 1 }],
  ["east", { row: 0, col: 1 }],
  ["south-east", { row: 1, col: 1 }],
  ["south", { row: 1, col: 0 }],
  ["south-west", { row: 1, col: -1 }],
  ["west", { row: 0, col: -1 }],
  ["north-west", { row: -1, col: -1 }],
]);

export function charCheck(row, col, char, charMap, placementData, { createSquareId, isCharMatch, addPlacementData }) {
  let squareID = createSquareId(row, col);
  let isCheckOK = isCharMatch(squareID, char, charMap);
  if (isCheckOK) {
    addPlacementData(placementData, squareID, char);
    return true;
  } else return false;
}

export function createSquareId(row, col) {
  return `sq-${row}-${col}`;
}

// Checks if a given square is compatible with a character to be placed.
/**
 *
 * A square is considered compatible if:
 *   1. It's currently empty (no character has been placed there yet).
 *   2. It already contains the exact same character as the one to be placed.
 *
 * If a square is not compatible (it contains a different character), the function logs a warning to the console.
 *
 * @param {string} currentSq - The ID of the square to check (e.g., "sq-3-5").
 * @param {string} char - The character that we want to place in the square.
 * @param {Map} charMap - The map containing the characters already placed in squares, where keys are square IDs and values are characters.
 * @returns {boolean} - True if the square is compatible, false otherwise.
 */
export function isCharMatch(currentSq, char, charMap) {
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

export function addPlacementData(placementData, squareID, char) {
  placementData[squareID] = char;  // add char to a local variable
}

export function updateRowAndCol(offset) {
    let currentRow = 0;
    let currentCol = 0;
    currentRow += offset.row;
    currentCol += offset.col;
    return {currentRow, currentCol};
  }

export function compareExistingChar(randomCoordinates, selectedWord, charMap) {
    console.info("selectedWord:", selectedWord);

    let { direction, startingRow, startingCol } = randomCoordinates;
    let offset = directionOffsets.get(direction);
    let wordSpread = [...selectedWord];
    let placementData = {}; // to store squareID : char

    let currentRow = startingRow;
    let currentCol = startingCol;

    for (let i = 0; i < wordSpread.length; i++) {
        let charCheckOK = charCheck(currentRow, currentCol, wordSpread[i], charMap, placementData, {createSquareId, isCharMatch, addPlacementData});
        if (!charCheckOK) return false;
        const newCoordinates = updateRowAndCol(offset);
        currentRow += newCoordinates.currentRow;
        currentCol += newCoordinates.currentCol;
    }
    return placementData;
}
