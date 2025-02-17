export function dataManager(globals, utilsManager) {
  const { appData, selectors } =  globals;
  const { noOfSquares } = appData;
  const { sectionWordList } =  selectors;

  const { helpers } = utilsManager;

  let filledWords = {}; // to store filled word's { char: sq no.} 
  let startAndEnd = []; // to store each word's start and end sq no. 
  let startAndEndIndex = 0;
  let startOrEnd = "start";
  let startingRow, startingCol;
  let maxRow = noOfSquares;
  let maxCol = noOfSquares;
  let tempHolder = [];

  function fillWords(wordListCopy, noOfWordsToDisplay) {
    console.groupCollapsed("fillWords()");

    let wordsRemaining = noOfWordsToDisplay;
    console.info("No of times to loop in total: ", noOfWordsToDisplay);

    for (let i = 0; i < noOfWordsToDisplay; i++) {
      let { arrayIndex, currentWord } = getRandomWord(); // fetch a random word
      
      let attempts = 0;
      let maxAttempts = 30;
      let status = 0; // 0 = fail, 1 = success

      while ( attempts < maxAttempts ) {
        attempts++;
        let { direction, isEnoughSq, isExistingCharOK } = generateFillData(currentWord);

        if( direction && isEnoughSq && isExistingCharOK ) {
          fillAWord(direction)
          listAWord(currentWord);
          status = 1;
          wordListCopy.splice(arrayIndex, 1);   // delete filled words from array 
          wordsRemaining--;
          break;
        } else {
          generateNewRowAndCol();
        }
      }
    }

    // if there are still words left to be displayed, recall the root function. 
    if (wordsRemaining > 0) {
      setTimeout(() => { // check sn1.MD for studying purpose
        fillWords(wordListCopy, wordsRemaining);
      }, 0);
    }

    console.groupEnd();

    // helper functions
    function getRandomWord() {
      console.groupCollapsed("getRandomWord()"); 
      
      let arrayIndex = helpers.random(0, (wordListCopy.length - 1));
      let currentWord = wordListCopy[arrayIndex];

      console.info("getRandomWord:", { arrayIndex, currentWord });
      console.groupEnd();

      return { arrayIndex, currentWord };
    }

    function generateFillData(currentWord) {
      console.groupCollapsed("generateFillData()");

      let wordSpread = [...currentWord];
      let direction = getRandomDirection();
      let isEnoughSq = enoughSq(direction, wordSpread);
      let isExistingCharOK = existingCharCheck(direction, wordSpread);

      console.info("generateFillData",{ direction, isEnoughSq, isExistingCharOK });
      console.groupEnd();

      return { direction, isEnoughSq, isExistingCharOK };
    }

    // get starting positons
    function generateNewRowAndCol() {
      startingRow = helpers.random(1, noOfSquares);
      startingCol = helpers.random(1, noOfSquares);
    }
  }

  // To check whether there is enough squares, and find a place until it is found.
  function findAndFill(currentWord) {
    // () direction ကို random ထုတ် ၊ sq လောက်သလား စစ်ပြီး ၊ နေရာ မတွေ့မချင်း ရှာဖြည့်မယ်

    let wordSpread = [...currentWord];
    let attempts = 0;
    let maxAttempts = 30;
    let status = 0; // 0 = fail, 1 = success

    while (attempts < maxAttempts) {
      attempts++;
      let direction = getRandomDirection();

      if (attemptPlacement(direction, wordSpread)) {
        listAWord(currentWord);
        status = 1;
        break;
      } else {
        // existingCharCheck() စစ်လို့ ရှိပြီးသား char နဲ့ မတူရင် row, col အသစ်ပြန်ထုတ်ပြီး ပြန် loop (If not, re-randomize the starting row and column, and try again)
        chooseNewPosition()
      }
    }
    handleMaxAttempts(attempts, maxAttempts);
    return status;
  }

  function attemptPlacement(direction, wordSpread) {
    //  are there enough square to fill && Check if the characters in the squares are compatible with the word
    if (enoughSq(direction, wordSpread) && existingCharCheck(direction, wordSpread)) {
      fillAWord(direction, tempHolder);
      return true; // Placement successful
    }
    return false;
  }

  // To check whether there is enough square in the calcuated direction
  function enoughSq(direction, wordSpread) {
    
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
  function existingCharCheck(direction, wordSpread) {
    tempHolder = [];
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

  function fillAWord(direction) {
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

  function getRandomDirection() {
    return helpers.random(1, 8);
  }


  function chooseNewPosition() {
    startingRow = helpers.random(1, noOfSquares);
    startingCol = helpers.random(1, noOfSquares);
  }

  function handleMaxAttempts(attempts, maxAttempts) {
    if (attempts === maxAttempts) {
      console.log("!!! maxAttempt reached !!!");
    }
  }

  return {
    fillWords,
  }
}