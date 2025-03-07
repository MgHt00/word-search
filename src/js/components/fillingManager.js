export function fillingManager(globals, { random }, { addClickListener }, { checkLeft, checkRight, checkTop, checkBelow, isWithinBounds }) {
  const { appData, selectors, wordPlacementData } =  globals;
  const { gridSize } = appData;
  const { sectionWordList } =  selectors;

  const { squareIdToChar, placedWordCoordinates } = wordPlacementData;

  function fill(words, noOfWordsToDisplay, overallAttempts = 0) { //[le5]
    let wordsArray = [...words];
    let wordsRemaining = noOfWordsToDisplay;
    let maxOverallAttempts = 20; // [Default = 20]Limit overall retries to prevent infinite loops
  
    if (overallAttempts >= maxOverallAttempts) {
      console.warn(`Max overallAttempts reached. Unable to place ${wordsRemaining} word(s).`);
      return;
    }
  
    console.info(`Attempt ${overallAttempts + 1}: Remaining word(s) to fill in:`, wordsRemaining);
  
    let { index, selectedWord } = selectRandomWord(wordsArray);
    let singleWordRetries = 0;     
    let maxSingleWordRetries = 30; // [Default = 30] If a word fails placement 30 times, move to the next word
  
    while (singleWordRetries < maxSingleWordRetries) {
      singleWordRetries++;
      const coordinates = generateRandomCoordinates(gridSize);
  
      let hasEnoughSpace = hasEnoughSq(coordinates, selectedWord, gridSize);
      let placementData = hasEnoughSpace && compareExistingChar(coordinates, selectedWord, squareIdToChar); //[le3]
  
      if (hasEnoughSpace && placementData) {
        console.info({ PROCEEDING: { selectedWord, hasEnoughSpace, placementData } });
  
        const entries = Object.entries(placementData);
        const currentWordSquareIDs = entries.map(([squareID]) => squareID);
        const wordData = { selectedWord, currentWordSquareIDs };
        
        addClickListener(wordData);

        entries.forEach(([squareID, char]) => {
          printCharOnScreen(squareID, char);
          addSquareIdToChar(squareID, char, squareIdToChar);
        });
  
        addPlacedWordCoordinates(selectedWord, currentWordSquareIDs, coordinates);
        listAWord(selectedWord, sectionWordList);
  
        wordsArray.splice(index, 1); // Remove placed word
        wordsRemaining--;
  
        break; // Move to next word
      }
    }
  
    if (wordsRemaining > 0) {
      console.warn(`Retrying fill... Attempt ${overallAttempts + 1}/${maxOverallAttempts}`);
      setTimeout(() => fill(wordsArray, wordsRemaining, overallAttempts + 1), 0); //[le4]
    } else {
      console.info({ 
        placedWordCoordinates,
      });
    }
  }

  function printCharOnScreen(squareID, char) {
    document.querySelector(`#${squareID}`).textContent = char;
  }

  function addSquareIdToChar(squareID, char, charMap) {
    charMap.set(squareID, char);
  }

  function addPlacedWordCoordinates(word, placementData, coordinates) {
    placedWordCoordinates.set(word, { placementData, direction: coordinates.direction });
  }
  
  function selectRandomWord(wordsArray) {
    let index = random(0, (wordsArray.length - 1));
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
    let startingRow = random(1, gridDimension);
    let startingCol = random(1, gridDimension);

    return { direction, startingRow, startingCol };
  }

  function getRandomDirection() {
    return directionMap.get(random(1, 8));
  }

  // To check whether there is enough square in the calcuated direction
  function hasEnoughSq(randomCoordinates, selectedWord, gridDimension) {
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
  /**
   * Checks if a word can be placed at the given coordinates and direction, considering
   * any existing characters already placed in the grid.
   *
   * It iterates through each character of the word and checks if the corresponding
   * square in the grid is either empty or contains the same character.
   *
   * @param {object} randomCoordinates - An object containing the starting coordinates and direction.
   * @param {string} randomCoordinates.direction - The direction in which the word will be placed (e.g., "north", "east").
   * @param {number} randomCoordinates.startingRow - The starting row for the word.
   * @param {number} randomCoordinates.startingCol - The starting column for the word.
   * @param {string} selectedWord - The word to be placed.
   * @param {Map} charMap - The map of square IDs to characters, representing the current state of the grid.
   * @returns {object|boolean} - Returns an object containing `squareID: char` key-value pairs representing the placement data if the word can be placed successfully.
   *                             Returns `false` if any square is incompatible with the word or the word cannot be placed in the given direction.
   */
  function compareExistingChar(randomCoordinates, selectedWord, charMap) {
    console.info("selectedWord:", selectedWord);

    let { direction, startingRow, startingCol } = randomCoordinates;
    let offset = directionOffsets.get(direction);
    let wordSpread = [...selectedWord];
    let placementData = {}; // to store squareID : char

    let currentRow = startingRow;
    let currentCol = startingCol;

    for (let i = 0; i < wordSpread.length; i++) {
      let charCheckOK = charCheck(currentRow, currentCol, wordSpread[i], charMap, placementData);
      if (!charCheckOK) return false;
      updateRowAndCol(offset);
    }
    return placementData;

    // helper function
    function updateRowAndCol(offset) {
      currentRow += offset.row;
      currentCol += offset.col;
    }
  }

  function charCheck(row, col, char, charMap, placementData) {
    let squareID = createSquareId(row, col);
    let isCheckOK = isCharMatch(squareID, char, charMap, placementData);
    if (isCheckOK) {
      addPlacementData(placementData, squareID, char);
      return true;
    } else return false;
  }

  function createSquareId(row, col) {
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

  function addPlacementData(placementData, squareID, char) {
    placementData[squareID] = char;  // add char to a local variable
  }

  // To list the words underneath the square frame
  function listAWord(selectedWord, wordList) {
    let ulElement = wordList.querySelector("#word-list") || createUL(); // Cache & reuse the <ul> instead of creating a new one each time.
    let liElement = document.createElement("li");

    liElement.textContent = selectedWord;
    liElement.id = selectedWord;

    ulElement.appendChild(liElement);
    wordList.appendChild(ulElement);

    // helper function
    function createUL() {
      let ulElement = document.createElement("ul");
      ulElement.id = "word-list";
      return ulElement;
    }
  }

  return {
    fill,
  }
}