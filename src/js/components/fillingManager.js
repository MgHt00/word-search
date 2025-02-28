export function fillingManager(globals, utilsManager) {
  const { appData, selectors, wordPlacementData } =  globals;
  const { gridSize } = appData;
  const { sectionWordList } =  selectors;
  let { startPoints, endPoints, squareIdToChar } = wordPlacementData;
  const { helpers } = utilsManager;

  function fill(words, noOfWordsToDisplay, overallAttempts = 0) { //[le5]
    let wordsArray = [...words];
    let wordsRemaining = noOfWordsToDisplay;
    let maxOverallAttempts = 20; // Limit overall retries to prevent infinite loops
  
    if (overallAttempts >= maxOverallAttempts) {
      console.warn(`Max overallAttempts reached. Unable to place ${wordsRemaining} word(s).`);
      return;
    }
  
    console.info(`Attempt ${overallAttempts + 1}: Remaining word(s) to fill in:`, wordsRemaining);
  
    // wordsArray.sort((a, b) => b.length - a.length); // Prioritize longer words
    
    let { index, selectedWord } = selectRandomWord(wordsArray);
    let singleWordRetries = 0;     
    let maxSingleWordRetries = 30; // If a word fails placement 30 times, move to the next word
  
    while (singleWordRetries < maxSingleWordRetries) {
      singleWordRetries++;
      const coordinates = generateRandomCoordinates(gridSize);
  
      let hasEnoughSpace = hasEnoughSq(coordinates, selectedWord, gridSize);
      let placementData = hasEnoughSpace && compareExistingChar(coordinates, selectedWord, squareIdToChar); //[le3]
  
      if (hasEnoughSpace && placementData) {
        console.info({ PROCEEDING: { selectedWord, hasEnoughSpace, placementData } });
  
        const entries = Object.entries(placementData);
        const firstIndex = 0;
        const lastIndex = entries.length - 1;
  
        entries.forEach(([squareID, char], i) => {
          printCharOnScreen(squareID, char);
          if (i === firstIndex) addStartPoint(squareID, startPoints);
          if (i === lastIndex) addEndPoint(squareID, endPoints);
          addSquareIdToChar(squareID, char, squareIdToChar);
        });
  
        listAWord(selectedWord);
  
        wordsArray.splice(index, 1); // Remove placed word
        wordsRemaining--;
  
        break; // Move to next word
      }
    }
  
    if (wordsRemaining > 0) {
      console.warn(`Retrying fill... Attempt ${overallAttempts + 1}/${maxOverallAttempts}`);
      setTimeout(() => fill(wordsArray, wordsRemaining, overallAttempts + 1), 0); //[le4]
    } else {
      console.info({ startAndEnds: { startPoints, endPoints } });
    }
  
    // Helper functions
    function printCharOnScreen(squareID, char) {
      document.querySelector(`#${squareID}`).textContent = char;
    }
  
    function addSquareIdToChar(squareID, char, charMap) {
      charMap.set(squareID, char);
    }
  
    function addStartPoint(squareID, startCoordinates) {
      startCoordinates.add(squareID);
    }
  
    function addEndPoint(squareID, endCoordinates) {
      endCoordinates.add(squareID);
    }
  }
  

  function selectRandomWord(wordsArray) {
    let index = helpers.random(0, (wordsArray.length - 1));
    let selectedWord = wordsArray[index];
    return { index, selectedWord };
  }

  // Data for generateRandomCoordinates()
  const directionMap = new Map([
    [1 , "north"],
    [2 , "north-east"],
    [3 , "east"],
    [4 , "south-east"],
    [5 , "south"],
    [6 , "south-west"],
    [7 , "west"],
    [8 , "north-west"],
  ]);

  // generate new starting positons and direction
  function generateRandomCoordinates(gridDimension) {
    let direction = getRandomDirection();
    let startingRow = helpers.random(1, gridDimension);
    let startingCol = helpers.random(1, gridDimension);

    return { direction, startingRow, startingCol };

    // helper function
    function getRandomDirection() {
      return directionMap.get(helpers.random(1, 8));
    }
  }

  // To check whether there is enough square in the calcuated direction
  function hasEnoughSq(randomCoordinates, selectedWord, gridDimension) {
    const { direction, startingRow, startingCol } = randomCoordinates;
    let wordSpread = [...selectedWord];
    let maxRow = gridDimension;
    let maxCol = gridDimension;

    const directionChecks = new Map([
      [ "north", () => { return checkTop() } ],
      [ "north-east", () => { return checkTop() && checkRight() }],
      [ "east", () => { return checkRight() }],
      [ "south-east",() => { return checkBelow() && checkRight() } ],
      [ "south", () => { return checkBelow() } ],
      [ "south-west", () => { return checkBelow() && checkLeft()} ],
      [ "west", () => { return checkLeft()} ],
      [ "north-west", () => { return checkTop() && checkLeft()} ],
    ]);

    const checkFunction = directionChecks.get(direction);
    if (checkFunction) {
      return checkFunction();
    } else console.warn(`Direction check failed for direction: ${direction}`);

    // helper functions
    function checkRight() {
      // check le2.MD for the logic behind the adjustments
      if (!isWithinBounds(startingRow, startingCol + (wordSpread.length - 1))) return false;
      return true; 
    }

    function checkLeft() {
      if (!isWithinBounds(startingRow, startingCol - (wordSpread.length - 1))) return false;
      return true;
    }

    function checkTop() {
      if (!(isWithinBounds(startingRow - (wordSpread.length - 1), startingCol))) return false;
      return true;
    }

    function checkBelow() {
      if (!(isWithinBounds(startingRow + wordSpread.length - 1, startingCol))) return false;
      return true;
    }

    // Boundary check function
    function isWithinBounds(startingRow, startingCol) {
      return startingRow > 0 && startingRow <= maxRow && startingCol > 0 && startingCol <= maxCol;
    }
  }

  // Data for compareExistingChar()
  const directionOffsets = new Map([
    [ "north", { row: -1, col: 0 } ],
    [ "north-east", { row: -1, col: 1 } ],
    [ "east", { row: 0, col: 1 } ],
    [ "south-east", { row: 1, col: 1 } ],
    [ "south", { row: 1, col: 0 } ],
    [ "south-west", { row: 1, col: -1 } ],
    [ "west", { row: 0, col: -1 } ],
    [ "north-west", { row: -1, col: -1 } ],
  ]);

  // Check whether existing character which is already filled is compatible with the new word
  function compareExistingChar(randomCoordinates, selectedWord, charMap) {
    console.info("selectedWord:", selectedWord);

    let { direction, startingRow, startingCol } = randomCoordinates;
    let offset = directionOffsets.get(direction);
    let wordSpread = [...selectedWord];
    let placementData = {}; // to store squareID : char

    let currentRow = startingRow;
    let currentCol = startingCol;

    for (let i = 0; i < wordSpread.length; i++) {
      let charCheckOK = charCheck(currentRow, currentCol, wordSpread[i], charMap);
      if (!charCheckOK) return false;
      updateRowAndCol(offset);
    }
    return placementData;

    // helper functions
    function charCheck(row, col, char, charMap) {
      let squareID = createSquareId(row, col);
      let isCheckOK = isCharMatch(squareID, char, charMap);
      if (isCheckOK) {
        addPlacementData(squareID, char);
        return true;
      } else return false;
    }

    function createSquareId(row, col) {
      return `sq-${row}-${col}`;
    }

    // Check whether alredy filled character is compatible with the character-to-be-filled.
    function isCharMatch(currentSq, char, charMap) {
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

    function addPlacementData(squareID, char) {
      placementData[squareID] = char;  // add char to a local variable
    }

    function updateRowAndCol(offset) {
      currentRow += offset.row;
      currentCol += offset.col;
    }
  }

  // To list the words underneath the square frame
  function listAWord(incoming) {
    let ulElement = sectionWordList.querySelector("ul") || document.createElement("ul"); // Cache & reuse the <ul> instead of creating a new one each time.
    let liElement = document.createElement("li");

    liElement.textContent = incoming;
    ulElement.appendChild(liElement);
    sectionWordList.appendChild(ulElement);
  }

  return {
    fill,
  }
}