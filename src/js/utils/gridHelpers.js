function gridHelpers() {
  // Boundary check function
  function _isWithinBounds(startingRow, startingCol, gridDimension) {
    let maxRow = gridDimension;
    let maxCol = gridDimension;
    return startingRow > 0 && startingRow <= maxRow && startingCol > 0 && startingCol <= maxCol;
  }

  // check le2.MD for the logic behind the adjustments
  function _checkRight(checkParameters) {
    let { startingRow, startingCol, wordSpread, gridDimension } = checkParameters;
    if (!_isWithinBounds(startingRow, startingCol + (wordSpread.length - 1), gridDimension)) return false;
    return true;
  }

  function _checkLeft(checkParameters) {
    let { startingRow, startingCol, wordSpread, gridDimension } = checkParameters;
    if (!_isWithinBounds(startingRow, startingCol - (wordSpread.length - 1), gridDimension)) return false;
    return true;
  }

  function _checkTop(checkParameters) {
    let { startingRow, startingCol, wordSpread, gridDimension } = checkParameters;
    if (!_isWithinBounds(startingRow - (wordSpread.length - 1), startingCol, gridDimension)) return false;
    return true;
  }

  function _checkBelow(checkParameters) {
    let { startingRow, startingCol, wordSpread, gridDimension } = checkParameters;
    if (!_isWithinBounds(startingRow + (wordSpread.length - 1), startingCol, gridDimension)) return false;
    return true;
  }

  // To check whether there is enough square in the calcuated direction
  return {
    hasEnoughSq: function hasEnoughSq(randomCoordinates, selectedWord, gridDimension) {
        const { direction, startingRow, startingCol } = randomCoordinates;
        console.info(randomCoordinates);
        const checkParameters = {
          startingRow,
          startingCol,
          wordSpread: [...selectedWord],
          gridDimension,
        }

        const directionChecks = new Map([
          ["north", () => { return _checkTop(checkParameters) }],
          ["north-east", () => { return _checkTop(checkParameters) && _checkRight(checkParameters) }],
          ["east", () => { return _checkRight(checkParameters) }],
          ["south-east", () => { return _checkBelow(checkParameters) && _checkRight(checkParameters) }],
          ["south", () => { return _checkBelow(checkParameters) }],
          ["south-west", () => { return _checkBelow(checkParameters) && _checkLeft(checkParameters) }],
          ["west", () => { return _checkLeft(checkParameters) }],
          ["north-west", () => { return _checkTop(checkParameters) && _checkLeft(checkParameters) }],
        ]);

        const checkFunction = directionChecks.get(direction);
        if (checkFunction) {
          return checkFunction();
        } else console.warn(`Direction check failed for direction: ${direction}`);
      }
  };
}

export const { hasEnoughSq } = gridHelpers();