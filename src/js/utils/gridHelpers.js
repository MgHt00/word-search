// Boundary check function
export function isWithinBounds(startingRow, startingCol, gridDimension) {
  let maxRow = gridDimension;
  let maxCol = gridDimension;
  return startingRow > 0 && startingRow <= maxRow && startingCol > 0 && startingCol <= maxCol;
}

// check le2.MD for the logic behind the adjustments
export function checkRight(checkParameters) {
  let { startingRow, startingCol, wordSpread, gridDimension } = checkParameters;
  if (!isWithinBounds(startingRow, startingCol + (wordSpread.length - 1), gridDimension)) return false;
  return true;
}

export function checkLeft(checkParameters) {
  let { startingRow, startingCol, wordSpread, gridDimension } = checkParameters;
  if (!isWithinBounds(startingRow, startingCol - (wordSpread.length - 1), gridDimension)) return false;
  return true;
}

export function checkTop(checkParameters) {
  let { startingRow, startingCol, wordSpread, gridDimension } = checkParameters;
  if (!isWithinBounds(startingRow - (wordSpread.length - 1), startingCol, gridDimension)) return false;
  return true;
}

export function checkBelow(checkParameters) {
  let { startingRow, startingCol, wordSpread, gridDimension } = checkParameters;
  if (!isWithinBounds(startingRow + (wordSpread.length - 1), startingCol, gridDimension)) return false;
  return true;
}

// To check whether there is enough square in the calcuated direction
export function hasEnoughSq(randomCoordinates, selectedWord, gridDimension) {
  const { direction, startingRow, startingCol } = randomCoordinates;
  const checkParameters = {
    startingRow, 
    startingCol, 
    wordSpread: [...selectedWord], 
    gridDimension, 
  }

  const directionChecks = new Map([
    [ "north", () => { return checkTop(checkParameters) } ],
    [ "north-east", () => { return checkTop(checkParameters) && checkRight(checkParameters) }],
    [ "east", () => { return checkRight(checkParameters) }],
    [ "south-east",() => { return checkBelow(checkParameters) && checkRight(checkParameters) } ],
    [ "south", () => { return checkBelow(checkParameters) } ],
    [ "south-west", () => { return checkBelow(checkParameters) && checkLeft(checkParameters)} ],
    [ "west", () => { return checkLeft(checkParameters)} ],
    [ "north-west", () => { return checkTop(checkParameters) && checkLeft(checkParameters)} ],
  ]);

  const checkFunction = directionChecks.get(direction);
  if (checkFunction) {
    return checkFunction();
  } else console.warn(`Direction check failed for direction: ${direction}`);
}