export function dataManager(globals, utilsManager) {
  const { appData, selectors, wordPlacementData } =  globals;
  const { noOfSquares } = appData;
  const { sectionWordList } =  selectors;

  const { helpers } = utilsManager;

  let filledWords = {}; // to store filled word's { char: sq no.} 
  let maxRow = noOfSquares;
  let maxCol = noOfSquares;
  let tempHolder = [];

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
        let { hasEnoughSpace, isExistingCharOK } = getPlacementData(direction, currentWord, startingRow, startingCol);

        if( hasEnoughSpace && isExistingCharOK ) {
          fillAWord(direction, startingRow, startingCol)
          listAWord(currentWord);

          status = 1;
          wordListCopy.splice(arrayIndex, 1);   // delete filled words from array 
          wordsRemaining--;
          
          break;
        } else {
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
      let isExistingCharOK = existingCharCheck(direction, wordSpread, startingRow, startingCol);

      return { hasEnoughSpace, isExistingCharOK };
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
    tempHolder = []; // resetting the array.
    // 1 = north
    if (direction === 1) {
      let currentRow = startingRow;
      for (let i = 0; i < wordSpread.length; i++) {
        let currentSq = `sq-${currentRow}-${startingCol}`;
        if (oneByOneCheck(currentSq, wordSpread[i], i)) {
          currentRow--;
        }
        else return false;
      }
      return true;
    }
    // 2 = north east
    else if (direction === 2) {
      let currentRow = startingRow;
      let currentCol = startingCol;
      for (let i = 0; i < wordSpread.length; i++) {
        let currentSq = `sq-${currentRow}-${currentCol}`;
        if (oneByOneCheck(currentSq, wordSpread[i], i)) {
          currentRow--;
          currentCol++;
        }
        else return false;
      }
      return true;
    }
    // 3 = east
    else if (direction === 3) {
      let currentCol = startingCol;
      for (let i = 0; i < wordSpread.length; i++) {
        let currentSq = `sq-${startingRow}-${currentCol}`;
        if (oneByOneCheck(currentSq, wordSpread[i], i)) {
          currentCol++;
        }
        else return false;
      }
      return true;
    }
    // 4 = south east
    else if (direction === 4) {
      let currentRow = startingRow;
      let currentCol = startingCol;
      for (let i = 0; i < wordSpread.length; i++) {
        let currentSq = `sq-${currentRow}-${currentCol}`;
        if (oneByOneCheck(currentSq, wordSpread[i], i)) {
          currentRow++;
          currentCol++;
        }
        else return false;
      }
      return true;
    }
    // south
    else if (direction === 5) {
      let currentRow = startingRow;
      for (let i = 0; i < wordSpread.length; i++) {
        let currentSq = `sq-${currentRow}-${startingCol}`;
        if (oneByOneCheck(currentSq, wordSpread[i], i)) {
          currentRow++;
        }
        else return false;
      }
      return true;
    }
    // south west
    else if (direction === 6) {
      let currentRow = startingRow;
      let currentCol = startingCol;
      for (let i = 0; i < wordSpread.length; i++) {
        let currentSq = `sq-${currentRow}-${currentCol}`;
        if (oneByOneCheck(currentSq, wordSpread[i], i)) {
          currentRow++;
          currentCol--;
        }
        else return false;
      }
      return true;
    }
    // west
    else if (direction === 7) {
      let currentCol = startingCol;
      for (let i = 0; i < wordSpread.length; i++) {
        let currentSq = `sq-${startingRow}-${currentCol}`;
        if (oneByOneCheck(currentSq, wordSpread[i], i)) {
          currentCol--;
        }
        else return false;
      }
      return true;
    }
    // north west
    else if (direction === 8) {
      let currentRow = startingRow;
      let currentCol = startingCol;
      for (let i = 0; i < wordSpread.length; i++) {
        let currentSq = `sq-${currentRow}-${currentCol}`;
        if (oneByOneCheck(currentSq, wordSpread[i], i)) {
          currentRow--;
          currentCol--;
        }
        else return false;
      }
      return true;
    }
  }

  // Check whether alredy filled character is compatible with the character-to-be-filled.
  function oneByOneCheck(currentSq, char, index) {
    if (!filledWords[currentSq]) {
      //console.log("No char in the sq. Good to go!");
      tempHolder[index] = char;
      return true;
    }
    else if (filledWords[currentSq] === char) {
      //console.log("Existing char in sq is same as incoming. Good to go!");
      tempHolder[index] = char;
      return true;
    }
    else {
      //console.log("Existing char in sq is NOT same as incoming. FAIL.");
      return false;
    }
  }

  function fillAWord(direction, startingRow, startingCol) {
    // () ရလာတဲ့ direction အတိုင်း tempHolder ထဲက စာလုံးတွေဖြည့်မယ်

    let success = false;
    // north
    if (direction === 1) {
      let currentRow = startingRow;
      for (let i = 0; i < tempHolder.length; i++) {
        processChar(currentRow, startingCol, tempHolder[i], i);
        currentRow--;
      }
      return success = true;
    }
    // north east
    else if (direction === 2) {
      let currentRow = startingRow;
      let currentCol = startingCol;
      for (let i = 0; i < tempHolder.length; i++) {
        processChar(currentRow, currentCol, tempHolder[i], i);
        currentRow--;
        currentCol++;
      }
      return success = true;
    }
    // east
    else if (direction === 3) {
      let currentCol = startingCol;
      for (let i = 0; i < tempHolder.length; i++) {
        processChar(startingRow, currentCol, tempHolder[i], i);
        currentCol++;
      }
      return success = true;
    }
    // south east
    else if (direction === 4) {
      let currentRow = startingRow;
      let currentCol = startingCol;
      for (let i = 0; i < tempHolder.length; i++) {
        processChar(currentRow, currentCol, tempHolder[i], i);
        currentRow++;
        currentCol++;
      }
      return success = true;
    }
    // south
    else if (direction === 5) {
      let currentRow = startingRow;
      for (let i = 0; i < tempHolder.length; i++) {
        processChar(currentRow, startingCol, tempHolder[i], i);
        currentRow++;
      }
      return success = true;
    }
    // south west
    else if (direction === 6) {
      let currentRow = startingRow;
      let currentCol = startingCol;
      for (let i = 0; i < tempHolder.length; i++) {
        processChar(currentRow, currentCol, tempHolder[i], i);
        currentRow++;
        currentCol--;
      }
      return success = true;
    }
    // west
    else if (direction === 7) {
      let currentCol = startingCol;
      for (let i = 0; i < tempHolder.length; i++) {
        processChar(startingRow, currentCol, tempHolder[i], i);
        currentCol--;
      }
      return success = true;
    }
    // north west
    else if (direction === 8) {
      let currentRow = startingRow;
      let currentCol = startingCol;
      for (let i = 0; i < tempHolder.length; i++) {
        processChar(currentRow, currentCol, tempHolder[i], i);
        currentRow--;
        currentCol--;
      }
      return success = true;
    }
    else {
      console.log(`No direction found`);
    }
    return success;
  }

  // check starting and ending index, set isFirstOrLastChar, and proceed
  function processChar(row, col, char, index) {
    let isFirstOrLastChar = (index === 0 || index === tempHolder.length - 1); // [sn2]
    let currentSq = printCharOnScreen(char, row, col);   // display on screen and get currentSq
    if(isFirstOrLastChar) storeCharCoordinates(currentSq);
    return isFirstOrLastChar;
  }


  function printCharOnScreen(char, row, col) {
    let currentSq = `sq-${row}-${col}`;
    let currentDOM = document.querySelector(`#${currentSq}`);
    currentDOM.textContent = char; 
    return currentSq;
  }

  function storeCharCoordinates(currentSq) {
    let { wordCoordinates, isStart } = wordPlacementData; // copy wordCoordinates by reference, isStart is a primitive
    
    let currentIndex = wordCoordinates.length;

    if (isStart) {
      wordCoordinates.push({ start: currentSq });         // Append a new object
      wordPlacementData.wordCoordinates[currentIndex]["start"] = currentSq;
      wordPlacementData.isStart = false;
    }
    else {
      wordPlacementData.wordCoordinates[currentIndex - 1]["end"] = currentSq; // modify the last object
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

  /*function handleMaxAttempts(attempts, maxAttempts) {
    if (attempts === maxAttempts) {
      console.log("!!! maxAttempt reached !!!");
    }
  }*/

  return {
    fill,
  }
}