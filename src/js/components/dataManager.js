export function dataManager(globals, utilsManager) {
  const { appData, selectors, wordPlacementData } =  globals;
  const { gridSize } = appData;
  const { sectionWordList } =  selectors;
  let { startPoints, endPoints, sqCharMap } = wordPlacementData;
  const { helpers } = utilsManager;

  const maxRetries = 50;
  let retries = 0;

  function fill(words, noOfWordsToDisplay) {
    let wordsArray = [...words];
    if (retries >= maxRetries) { // preventing possible infinite retries.
      console.warn("Max retries reached. Stopping recursion.");
      return;
    }

    let wordsRemaining = noOfWordsToDisplay;
    console.info("Remaining word(s) to fill in:", noOfWordsToDisplay);

    for (let i = 0; i < noOfWordsToDisplay; i++) {
      let { index, selectedWord } = selectRandomWord(wordsArray);       
      let attempts = 0;
      let maxAttempts = 30;

      while ( attempts < maxAttempts ) {
        attempts++;
        const coordinates =  generateRandomCoordinates(gridSize);

        let hasEnoughSpace = hasEnoughSq(coordinates, selectedWord, gridSize);
        let placementResult = (hasEnoughSpace)
          ? compareExistingChar(coordinates, selectedWord, sqCharMap) // If hasEnoughSpace is true
          : false; 

        if( hasEnoughSpace && placementResult ) {
          console.info({ PROCCEDING: {selectedWord, hasEnoughSpace, placementResult} });

          const entries = Object.entries(placementResult);
          const firstIndex = 0;
          const lastIndex = entries.length - 1;

          entries.forEach(([squareID, char], index) => {
            printCharOnScreen(squareID, char);
            if (index === firstIndex) storeStartPoint(squareID, startPoints);
            if (index === lastIndex) storeEndPoint(squareID, endPoints);
            updateSqCharMap(squareID, char, sqCharMap) // Map squre no. to character
          });
          
          listAWord(selectedWord);

          wordsArray.splice(index, 1);   // delete filled words from array 
          wordsRemaining--;
          
          break;
        } 
      }
    }

    // if there are still words left to be displayed, recall the root function. 
    if (wordsRemaining > 0) {
      retries++;
      setTimeout(() => { //[sn1]
        fill(wordsArray, wordsRemaining);
      }, 0);
    }
    console.info({ startAndEnds : { startPoints, endPoints }});

    // helper functions of fill()
    function printCharOnScreen(currentSquareID, char) {
      let currentDOM = document.querySelector(`#${currentSquareID}`);
      currentDOM.textContent = char; // display on screen
    }

    // Map squre no. to character
    function updateSqCharMap(squareID, char, charMap) {
      charMap.set(squareID, char);
    }

    function storeStartPoint(squareID, startCoordinates) {
      startCoordinates.add(squareID);
    }
  
    function storeEndPoint(squareID, endCoordinates) {
      endCoordinates.add(squareID)
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
      //return helpers.random(1, 8);
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
    } else console.warn("direction check failed!");

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
    let placementData = {};

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
      let currentSquareID = createSquareId(row, col);
      let isCheckOK = oneByOneCheck(currentSquareID, char, charMap);
      if (isCheckOK) {
        addToPlacementData(currentSquareID, char);
        return true;
      } else return false;
    }

    function createSquareId(row, col) {
      return `sq-${row}-${col}`;
    }

    function addToPlacementData(currentSquareID, char) {
      placementData[currentSquareID] = char;  // add char to a local variable
    }

    function updateRowAndCol(offset) {
      currentRow += offset.row;
      currentCol += offset.col;
    }

    // Check whether alredy filled character is compatible with the character-to-be-filled.
    function oneByOneCheck(currentSq, char, charMap) {
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
  }

  function listAWord(incoming) {
    // function to list the words underneath the square frame

    let ulElement = document.createElement("ul");
    let liElement = document.createElement("li");

    liElement.textContent = incoming;
    ulElement.appendChild(liElement);
    sectionWordList.appendChild(ulElement);
  }

  return {
    fill,
  }
}