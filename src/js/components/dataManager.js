export function dataManager(globals, utilsManager) {
  const { appData, selectors, wordPlacementData } =  globals;
  const { noOfSquares } = appData;
  const { sectionWordList } =  selectors;

  const { helpers } = utilsManager;

  //let filledWords = {}; // to store filled word's { char: sq no.} 
  let maxRow = noOfSquares;
  let maxCol = noOfSquares;
  //let tempHolder = [];

  let maxRetries = 10;
  let retries = 0;

  function fill(wordListCopy, noOfWordsToDisplay) {
    console.groupCollapsed("fill()");

    if (retries >= maxRetries) { // preventing possible infinite retries.
      console.warn("Max retries reached. Stopping recursion.");
      return;
    }

    let wordsRemaining = noOfWordsToDisplay;
    console.info("Remaining word(s) to fill in:", noOfWordsToDisplay);

    for (let i = 0; i < noOfWordsToDisplay; i++) {
      let { arrayIndex, currentWord } = selectRandomWord(); 
      let { direction, startingRow, startingCol } = generateRandomCoordinates();
      
      let attempts = 0;
      let maxAttempts = 30;
      let status = 0; // 0 = fail, 1 = success

      while ( attempts < maxAttempts ) {
        attempts++;
        let { hasEnoughSpace, isExistingCharCheckOK } = getPlacementData(direction, currentWord, startingRow, startingCol);

        if( hasEnoughSpace && isExistingCharCheckOK ) {
          fillAWord(direction, startingRow, startingCol, currentWord)
          listAWord(currentWord);
          //console.info("filled and listed:", {startingRow, startingCol, currentWord});

          status = 1;
          wordListCopy.splice(arrayIndex, 1);   // delete filled words from array 
          wordsRemaining--;
          
          break;
        } else {
          //console.info("maxAttempts reach.",maxAttempts);
          generateRandomCoordinates();
        }
      }
    }

    // if there are still words left to be displayed, recall the root function. 
    if (wordsRemaining > 0) {
      retries++;
      setTimeout(() => { //[sn1]
        fill(wordListCopy, wordsRemaining);
      }, 0);
    }

    console.groupEnd();

    // helper functions
    function selectRandomWord() {
      let arrayIndex = helpers.random(0, (wordListCopy.length - 1));
      let currentWord = wordListCopy[arrayIndex];

      return { arrayIndex, currentWord };
    }

    function getPlacementData(direction, currentWord, startingRow, startingCol) {
      let wordSpread = [...currentWord];
      let hasEnoughSpace = hasEnoughSq(direction, wordSpread, startingRow, startingCol);
      let isExistingCharCheckOK = existingCharCheck(direction, wordSpread, startingRow, startingCol);

      return { hasEnoughSpace, isExistingCharCheckOK };
    }

    function getRandomDirection() {
      return helpers.random(1, 8);
    }

    // generate new starting positons
    function generateRandomCoordinates() {
      let direction = getRandomDirection();
      let startingRow = helpers.random(1, noOfSquares);
      let startingCol = helpers.random(1, noOfSquares);

      return { direction, startingRow, startingCol } ;
    }
  }


  // To check whether there is enough square in the calcuated direction
  function hasEnoughSq(direction, wordSpread, startingRow, startingCol) {
    
    let rightStatus = checkRight(wordSpread, startingRow, startingCol);
    let leftStatus = checkLeft(wordSpread, startingRow, startingCol);
    let topStatus = checkTop(wordSpread, startingRow, startingCol);
    let belowStatus = checkBelow(wordSpread, startingRow, startingCol);

    if (direction === 1) return topStatus;                          // 1 = north, check the max top no. 
    else if (direction === 2) return (topStatus && rightStatus);    //2 = north east
    else if (direction === 3) return rightStatus;                   // 3 = east
    else if (direction === 4) return (belowStatus && rightStatus);  // 4 = south east
    else if (direction === 5) return belowStatus;                   // 5 = south
    else if (direction === 6) return (belowStatus && leftStatus);   // 6 = south west
    else if (direction === 7) return leftStatus;                    // 7 = west
    else if (direction === 8) return (topStatus && leftStatus);     //8 = north west

    // helper functions
    function checkRight(word, row, col) {
      // check le2.MD for the logic behind the adjustments
      if (!isWithinBounds(row, col + (word.length - 1))) return false;
      return true;  // Explicitly return true if the word fits within the boundary
    }
  
    function checkLeft(word, row, col) {
      if (!isWithinBounds(row, col - (word.length - 1))) return false;
      return true;
    }
  
    function checkTop(word, row, col) {
      if (!(isWithinBounds(row - (word.length - 1), col))) return false;
      return true;
    }
  
    function checkBelow(word, row, col) {
      if (!(isWithinBounds(row + word.length - 1, col))) return false;
      return true;
    }
  
    // Boundary check function
    function isWithinBounds(row, col) {
      return row > 0 && row <= maxRow && col > 0 && col <= maxCol;
    }
  }

  // Check whether existing character which is already filled is compatible with the new word
  function existingCharCheck(direction, wordSpread, startingRow, startingCol) {
    let currentRow = startingRow;
    let currentCol = startingCol;

    if (direction === 1) {
      currentRow = startingRow;
      for (let i = 0; i < wordSpread.length; i++) {
        let isCheckOK = checkSquarePlacement(currentRow, currentCol, wordSpread[i]);
        if (isCheckOK) {
          checkAnotherSquare({ row: -1 });
        }
        else return false;
      }
      return true;
    }
    // 2 = north east
    else if (direction === 2) {
      currentRow = startingRow;
      currentCol = startingCol;
      for (let i = 0; i < wordSpread.length; i++) {
        let isCheckOK = checkSquarePlacement(currentRow, currentCol, wordSpread[i]);
        if (isCheckOK) {
          checkAnotherSquare({ row: -1, col: 1 });
        }
        else return false;
      }
      return true;
    }
    // 3 = east
    else if (direction === 3) {
      currentCol = startingCol;
      for (let i = 0; i < wordSpread.length; i++) {
        let isCheckOK = checkSquarePlacement(currentRow, currentCol, wordSpread[i]);
        if (isCheckOK) {
          checkAnotherSquare({ col: 1 });
        }
        else return false;
      }
      return true;
    }
    // 4 = south east
    else if (direction === 4) {
      currentRow = startingRow;
      currentCol = startingCol;
      for (let i = 0; i < wordSpread.length; i++) {
        let isCheckOK = checkSquarePlacement(currentRow, currentCol, wordSpread[i]);
        if (isCheckOK) {
          checkAnotherSquare({ row: 1, col: 1 });
        }
        else return false;
      }
      return true;
    }
    // south
    else if (direction === 5) {
      currentRow = startingRow;
      for (let i = 0; i < wordSpread.length; i++) {
        let isCheckOK = checkSquarePlacement(currentRow, currentCol, wordSpread[i]);
        if (isCheckOK) {
          checkAnotherSquare({ row: 1 });
        }
        else return false;
      }
      return true;
    }
    // south west
    else if (direction === 6) {
      currentRow = startingRow;
      currentCol = startingCol;
      for (let i = 0; i < wordSpread.length; i++) {
        let isCheckOK = checkSquarePlacement(currentRow, currentCol, wordSpread[i]);
        if (isCheckOK) {
          checkAnotherSquare({ row: 1, col: -1 });
        }
        else return false;
      }
      return true;
    }
    // west
    else if (direction === 7) {
      currentCol = startingCol;
      for (let i = 0; i < wordSpread.length; i++) {
        let isCheckOK = checkSquarePlacement(currentRow, currentCol, wordSpread[i]);
        if (isCheckOK) {
          checkAnotherSquare({ col: -1 });
        }
        else return false;
      }
      return true;
    }
    // north west
    else if (direction === 8) {
      currentRow = startingRow;
      currentCol = startingCol;
      for (let i = 0; i < wordSpread.length; i++) {
        let isCheckOK = checkSquarePlacement(currentRow, currentCol, wordSpread[i]);
        if (isCheckOK) {
          checkAnotherSquare({ row: -1, col: -1 });
        }
        else return false;
      }
      return true;
    }

    // helper functions
    function checkSquarePlacement(row, col, char) {
      let currentSquareID = createSquareId(row, col);
      let isCheckOK = oneByOneCheck(currentSquareID, char);
      return isCheckOK;
    }

    function checkAnotherSquare({ row = 0, col = 0 }) {
      currentRow += row;
      currentCol += col;
      //tempChars.push(char);
    }
  }

  // Check whether alredy filled character is compatible with the character-to-be-filled.
  function oneByOneCheck(currentSq, char) {
    let { sqCharMap } = wordPlacementData;  // fetching global data

    if (!sqCharMap[currentSq]) {
      //console.log("No char in the sq. Good to go!");
      return true;
    }
    else if (sqCharMap[currentSq] === char) {
      //console.log("Existing char in sq is same as incoming. Good to go!");
      return true;
    }
    else {
      //console.log("Existing char in sq is NOT same as incoming. FAIL.");
      return false;
    }
  }

  function fillAWord(direction, startingRow, startingCol, wordToFill) {
    // () ရလာတဲ့ direction အတိုင်း tempHolder ထဲက စာလုံးတွေဖြည့်မယ်
    let tempChars = [...wordToFill];
    let success = false;
    // north
    if (direction === 1) {
      let currentRow = startingRow;
      for (let i = 0; i < tempChars.length; i++) {
        addCharacterToGrid(currentRow, startingCol, i, tempChars);
        currentRow--;
      }
      return success = true;
    }
    // north east
    else if (direction === 2) {
      let currentRow = startingRow;
      let currentCol = startingCol;
      for (let i = 0; i < tempChars.length; i++) {
        addCharacterToGrid(currentRow, currentCol, i, tempChars);
        currentRow--;
        currentCol++;
      }
      return success = true;
    }
    // east
    else if (direction === 3) {
      let currentCol = startingCol;
      for (let i = 0; i < tempChars.length; i++) {
        addCharacterToGrid(startingRow, currentCol, i, tempChars);
        currentCol++;
      }
      return success = true;
    }
    // south east
    else if (direction === 4) {
      let currentRow = startingRow;
      let currentCol = startingCol;
      for (let i = 0; i < tempChars.length; i++) {
        addCharacterToGrid(currentRow, currentCol, i, tempChars);
        currentRow++;
        currentCol++;
      }
      return success = true;
    }
    // south
    else if (direction === 5) {
      let currentRow = startingRow;
      for (let i = 0; i < tempChars.length; i++) {
        addCharacterToGrid(currentRow, startingCol, i, tempChars);
        currentRow++;
      }
      return success = true;
    }
    // south west
    else if (direction === 6) {
      let currentRow = startingRow;
      let currentCol = startingCol;
      for (let i = 0; i < tempChars.length; i++) {
        addCharacterToGrid(currentRow, currentCol, i, tempChars);
        currentRow++;
        currentCol--;
      }
      return success = true;
    }
    // west
    else if (direction === 7) {
      let currentCol = startingCol;
      for (let i = 0; i < tempChars.length; i++) {
        addCharacterToGrid(startingRow, currentCol, i, tempChars);
        currentCol--;
      }
      return success = true;
    }
    // north west
    else if (direction === 8) {
      let currentRow = startingRow;
      let currentCol = startingCol;
      for (let i = 0; i < tempChars.length; i++) {
        addCharacterToGrid(currentRow, currentRow, i, tempChars);
        currentRow--;
        currentCol--;
      }
      return success = true;
    }
    else {
      console.log(`No direction found`);
    }
    return success;

    // helper functions
    function addCharacterToGrid(row, col, index, tempChars) {
      let currentSquareID = createSquareId(row, col);
      let isFirstOrLastChar = isStartOrEndIndex(index, tempChars);
      processChar(currentSquareID, tempChars[index], isFirstOrLastChar);
    }
  }

  function createSquareId(row, col) {
    return `sq-${row}-${col}`;
  }

  function isStartOrEndIndex(index, tempChars) {
    return (index === 0 || index === tempChars.length - 1); // [sn2]
  }

  // check starting and ending index, set isFirstOrLastChar, and proceed
  function processChar(currentSquareID, char, isFirstOrLastChar) {
    printCharOnScreen(currentSquareID, char);   
    storeCharMap(currentSquareID, char);        // Map squre no. to character
    if(isFirstOrLastChar) storeCharCoordinates(currentSquareID);
  }


  function printCharOnScreen(currentSquareID, char) {
    let currentDOM = document.querySelector(`#${currentSquareID}`);
    currentDOM.textContent = char; // display on screen
  }

  // Map squre no. to character
  function storeCharMap(currentSquareID, char) {
    let { sqCharMap } = wordPlacementData;
    sqCharMap[currentSquareID] = char;
    //console.info(sqCharMap);
  }

  function storeCharCoordinates(currentSquareID) {
    let { wordCoordinates, isStart } = wordPlacementData; // copy wordCoordinates by reference, isStart is a primitive
    
    let currentIndex = wordCoordinates.length;

    if (isStart) {
      wordCoordinates.push({ start: currentSquareID });         // Append a new object
      wordPlacementData.wordCoordinates[currentIndex]["start"] = currentSquareID;
      wordPlacementData.isStart = false;
    }
    else {
      wordPlacementData.wordCoordinates[currentIndex - 1]["end"] = currentSquareID; // modify the last object
      wordPlacementData.isStart = true;
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