export function gridHelpers() {
  // Boundary check function
  function isWithinBounds(startingRow, startingCol, gridDimension) {
    let maxRow = gridDimension;
    let maxCol = gridDimension;
    return startingRow > 0 && startingRow <= maxRow && startingCol > 0 && startingCol <= maxCol;
  }

  // check le2.MD for the logic behind the adjustments
  function checkRight(checkParameters) {
    let { startingRow, startingCol, wordSpread, gridDimension } = checkParameters;
    if (!isWithinBounds(startingRow, startingCol + (wordSpread.length - 1), gridDimension)) return false;
    return true;
  }

  function checkLeft(checkParameters) {
    let { startingRow, startingCol, wordSpread, gridDimension } = checkParameters;
    if (!isWithinBounds(startingRow, startingCol - (wordSpread.length - 1), gridDimension)) return false;
    return true;
  }

  function checkTop(checkParameters) {
    let { startingRow, startingCol, wordSpread, gridDimension } = checkParameters;
    if (!isWithinBounds(startingRow - (wordSpread.length - 1), startingCol, gridDimension)) return false;
    return true;
  }

  function checkBelow(checkParameters) {
    let { startingRow, startingCol, wordSpread, gridDimension } = checkParameters;
    if (!isWithinBounds(startingRow + (wordSpread.length - 1), startingCol, gridDimension)) return false;
    return true;
  }

  return {
    checkRight,
    checkLeft,
    checkTop,
    checkBelow,
    isWithinBounds 
  };
}
