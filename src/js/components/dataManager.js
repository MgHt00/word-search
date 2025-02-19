export function dataManager(globals, utilsManager) {
  const { appData, selectors } =  globals;
  const { noOfSquares } = appData;
  const { sectionWordList } =  selectors;

  const { helpers } = utilsManager;

  let startAndEnd = []; // to store each word's start and end sq no. 
  let startAndEndIndex = 0;
  let startOrEnd = "start";
  //let direction, startingRow, startingCol;
  let maxRow = noOfSquares;
  let maxCol = noOfSquares;
  let tempHolder = [];

  function fill(wordListCopy, noOfWordsToDisplay) {
    console.groupCollapsed("fill()");

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
      setTimeout(() => { // check sn1.MD for studying purpose
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
      let hasEnoughSpace = enoughSq(direction, wordSpread, startingRow, startingCol);
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
  function enoughSq(direction, wordSpread, startingRow, startingCol) {
    
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
    console.groupCollapsed("oneByOneCheck()");

    const currentChar = dataBank.getFilledWords(currentSq)  
    console.info(currentChar);

    if (!currentChar) {
      console.log("No char in the sq. Good to go!");
      tempHolder[index] = char;
      return true;
    }
    else if (currentChar === char) {
      console.log("Existing char in sq is same as incoming. Good to go!");
      tempHolder[index] = char;
      return trues;
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

  function charFill(row, col, fillChar, saveIt) {
    // () to fill the square with incoming character

    let currentSq = `sq-${row}-${col}`;
    let currentDOM = document.querySelector(`#${currentSq}`);
    //console.log("currentSq", currentSq);

    currentDOM.textContent = fillChar; // display on screen
    filledWords[currentSq] = fillChar; // input -> object

    if (saveIt) {
      if (startOrEnd === "start") {
        // Initialize the object if it's the start of a new entry
        startAndEnd[startAndEndIndex] = {};
        startAndEnd[startAndEndIndex]["start"] = currentSq;
        startOrEnd = "end";
      }
      else if (startOrEnd === "end") {
        startAndEnd[startAndEndIndex]["end"] = currentSq;
        startOrEnd = "start";
        startAndEndIndex++;
      }
      //console.log("startAndEndIndex: ", startAndEndIndex);
      //console.log("startAndEnd[]: ", startAndEnd);
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

  function processChar(row, col, char, index) {
    // check starting and ending index, set saveIt, and calls charFill(),

    let saveIt = (index === 0 || index === tempHolder.length - 1); // check sn2.MD ( saveIt = (i === 0 || i === tempHolder.length - 1) ? true : false;)
    charFill(row, col, char, saveIt);
    return saveIt;
  }

  function handleMaxAttempts(attempts, maxAttempts) {
    if (attempts === maxAttempts) {
      console.log("!!! maxAttempt reached !!!");
    }
  }

  let dataBank = {
    filledWords: {}, // to store filled word's in { char: sq no.} format

    getFilledWords( key) {
      return this.filledWords[key];
    },

    setFilledWords( key, value ) {
      return this.filledWords[key] = value;
    },
  }

  return {
    fill,
  }
}