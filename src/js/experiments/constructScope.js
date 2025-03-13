const _interactionState = {
  _hoverScope : new Set(),
}

function extractNumbers(squareIdString) {
  const regex = /^sq-(\d+)-(\d+)$/; // [le7]Regular expression to match the pattern 
  const match = squareIdString.match(regex);

  if (match) {
    const rowNumber = parseInt(match[1], 10); // Extract and parse the first number
    const columnNumber = parseInt(match[2], 10); // Extract and parse the second number
    return { rowNumber, columnNumber };
  } else {
    return null; // Return null if the string doesn't match the pattern
  }
}

function _isWithinGrid(number, gridSize) {
  return number > 0 && number <= gridSize;
}

function _reduceNumber(number, gridSize) {
  if (_isWithinGrid(number-1, gridSize)) {
    return number - 1;
  }
  return number;
}

function _increaseNumber(number, gridSize) {
  if (_isWithinGrid(number+1, gridSize)) {
    return number + 1;
  }
  return number;
}

function _constructScope(gridData) {
  const { rowNumber, columnNumber, gridSize } = gridData; 
  _interactionState._hoverScope.clear();

  // checking left and right
    _interactionState._hoverScope.add(`sq-${rowNumber}-${_reduceNumber(columnNumber, gridSize)}`);
    _interactionState._hoverScope.add(`sq-${rowNumber}-${_increaseNumber(columnNumber, gridSize)}`);

  // checking top left, bottom left
    _interactionState._hoverScope.add(`sq-${_reduceNumber(rowNumber, gridSize)}-${_reduceNumber(columnNumber, gridSize)}`);
    _interactionState._hoverScope.add(`sq-${_increaseNumber(rowNumber, gridSize)}-${_reduceNumber(columnNumber, gridSize)}`);

  // checking top, bottom
    _interactionState._hoverScope.add(`sq-${_reduceNumber(rowNumber, gridSize)}-${columnNumber}`);
    _interactionState._hoverScope.add(`sq-${_increaseNumber(rowNumber, gridSize)}-${columnNumber}`);

  // checking top right, bottom right
    _interactionState._hoverScope.add(`sq-${_reduceNumber(rowNumber, gridSize)}-${_increaseNumber(columnNumber, gridSize)}`);
    _interactionState._hoverScope.add(`sq-${_increaseNumber(rowNumber, gridSize)}-${_increaseNumber(columnNumber, gridSize)}`);
}

function _getSurroundingScrope(squareID) {
  const gridSize = appData.gridSize;
  const { rowNumber, columnNumber } = extractNumbers(squareID);
  _constructScope({ rowNumber, columnNumber, gridSize });
} 

function _isWithinHoverScope(squareID) {
  return _interactionState._hoverScope.has(squareID);
}
