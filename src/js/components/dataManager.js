export function dataManager(globals, utilsManager) {
  const { appData, selectors, wordPlacementData } =  globals;
  const { noOfSquares } = appData;
  const { sectionWordList } =  selectors;
  let { wordCoordinates, isStart, sqCharMap } = wordPlacementData;
  const { helpers } = utilsManager;

  const maxRetries = 50;
  let retries = 0;

  function fill(wordListCopy, noOfWordsToDisplay) {
    if (retries >= maxRetries) { // preventing possible infinite retries.
      console.warn("Max retries reached. Stopping recursion.");
      return;
    }

    let wordsRemaining = noOfWordsToDisplay;
    console.info("Remaining word(s) to fill in:", noOfWordsToDisplay);

    for (let i = 0; i < noOfWordsToDisplay; i++) {
      let { index, selectedWord } = selectRandomWord();       
      let attempts = 0;
      let maxAttempts = 30;

      while ( attempts < maxAttempts ) {
        attempts++;
        const coordinates =  generateRandomCoordinates();
        let hasEnoughSpace =  false; 
        let charCheckData = false;

        hasEnoughSpace = hasEnoughSq(coordinates, selectedWord);

        if (hasEnoughSpace) { 
          charCheckData = existingCharCheck(coordinates, selectedWord, sqCharMap);  
        }

        if( hasEnoughSpace && charCheckData ) {
          console.info({PROCCEDING: {selectedWord, hasEnoughSpace, charCheckData}});
          //fillAWord(coordinates, selectedWord);
          const entries = Object.entries(charCheckData);
          const firstIndex = 0;
          const lastIndex = entries.length - 1;

          entries.forEach(([squareID, char], index) => {
            printCharOnScreen(squareID, char);
            if (index === firstIndex || index === lastIndex) setStartOrEnd(squareID);
            updateSqCharMap(squareID, char, sqCharMap)
          });
          
          listAWord(selectedWord);

          wordListCopy.splice(index, 1);   // delete filled words from array 
          wordsRemaining--;
          
          break;
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
    console.info(wordCoordinates);

    // helper functions
    function selectRandomWord() {
      let index = helpers.random(0, (wordListCopy.length - 1));
      let selectedWord = wordListCopy[index];

      return { index, selectedWord };
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

  /*function fillWordToGrid(entries) {
    const firstIndex = 0;
    const lastIndex = entries.length - 1;

    entries.forEach(([key, value], index) => { // [sn3]
      printCharOnScreen(key, value);
      //storeCharMap(key, value);        // Map squre no. to character
      if (index === firstIndex || index === lastIndex) storeCharCoordinates(key);
    });
    //let currentSquareID = createSquareId(row, col);
    //  let isFirstOrLastChar = isStartOrEndIndex(index, tempChars);
    //  printCharOnScreen(currentSquareID, tempChars[index]);   
    //  storeCharMap(currentSquareID, tempChars[index]);        // Map squre no. to character
    //  if(isFirstOrLastChar) storeCharCoordinates(currentSquareID);
    
  }*/

  function updateSqCharMap(key, value, charMap) {
      charMap[key] = value;
  }

  function storeCharCoordinates(currentSquareID) {
    let currentIndex = wordCoordinates.length;

    if (isStart) {
      wordCoordinates.push({ start: currentSquareID });         // Append a new object
      wordCoordinates[currentIndex]["start"] = currentSquareID;
      isStart = false;
    }
    else {
      wordCoordinates[currentIndex - 1]["end"] = currentSquareID; // modify the last object
      isStart = true;
    }
  }

  function setStartOrEnd(startOrEndID) {
    let currentIndex = wordCoordinates.length;

    if (isStart) {
      wordCoordinates.push({ start: startOrEndID });         // Append a new object
      wordCoordinates[currentIndex]["start"] = startOrEndID;
      isStart = false;
    }
    else {
      wordCoordinates[currentIndex - 1]["end"] = startOrEndID; // modify the last object
      isStart = true;
    }
  }


  // To check whether there is enough square in the calcuated direction
  function hasEnoughSq(randomCoordinates, selectedWord) {
    let { direction, startingRow, startingCol } = randomCoordinates;
    let wordSpread = [...selectedWord];
    let maxRow = noOfSquares; // fetching global property
    let maxCol = noOfSquares; // fetching global property
    
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

  const directionOffsets = new Map([
    [1, { row: -1, col: 0 }],
    [2, { row: -1, col: 1 }],
    [3, { row: 0, col: 1 }],
    [4, { row: 1, col: 1 }],
    [5, { row: 1, col: 0 }],
    [6, { row: 1, col: -1 }],
    [7, { row: 0, col: -1 }],
    [8, { row: -1, col: -1 }]
  ]);

  // Check whether existing character which is already filled is compatible with the new word
  function existingCharCheck(randomCoordinates, selectedWord, charMap) {
    console.info("selectedWord:",selectedWord);

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

    /*if (direction === 1) {
      currentRow = startingRow;
      for (let i = 0; i < wordSpread.length; i++) {
        let charCheckOK = charCheck(currentRow, currentCol, wordSpread[i], charMap);
        if (!charCheckOK) return false;
        updateRowAndCol(offset);
      }
      return placementData;
    }
    // 2 = north east
    else if (direction === 2) {
      currentRow = startingRow;
      currentCol = startingCol;
      for (let i = 0; i < wordSpread.length; i++) {
        let charCheckOK = charCheck(currentRow, currentCol, wordSpread[i], charMap);
        if (!charCheckOK) return false;
        updateRowAndCol(offset);
      }
      return placementData;
    }
    // 3 = east
    else if (direction === 3) {
      currentCol = startingCol;
      for (let i = 0; i < wordSpread.length; i++) {
        let charCheckOK = charCheck(currentRow, currentCol, wordSpread[i], charMap);
        if (!charCheckOK) return false;
        updateRowAndCol(offset);
      }
      return placementData;
    }
    // 4 = south east
    else if (direction === 4) {
      currentRow = startingRow;
      currentCol = startingCol;
      for (let i = 0; i < wordSpread.length; i++) {
        let charCheckOK = charCheck(currentRow, currentCol, wordSpread[i], charMap);
        if (!charCheckOK) return false;
        updateRowAndCol(offset);
      }
      return placementData;
    }
    // south
    else if (direction === 5) {
      currentRow = startingRow;
      for (let i = 0; i < wordSpread.length; i++) {
        let charCheckOK = charCheck(currentRow, currentCol, wordSpread[i], charMap);
        if (!charCheckOK) return false;
        updateRowAndCol(offset);
      }
      return placementData;
    }
    // south west
    else if (direction === 6) {
      currentRow = startingRow;
      currentCol = startingCol;
      for (let i = 0; i < wordSpread.length; i++) {
        let charCheckOK = charCheck(currentRow, currentCol, wordSpread[i], charMap);
        if (!charCheckOK) return false;
        updateRowAndCol(offset);
      }
      return placementData;
    }
    // west
    else if (direction === 7) {
      currentCol = startingCol;
      for (let i = 0; i < wordSpread.length; i++) {
        let charCheckOK = charCheck(currentRow, currentCol, wordSpread[i], charMap);
        if (!charCheckOK) return false;
        updateRowAndCol(offset);
      }
      return placementData;
    }
    // north west
    else if (direction === 8) {
      currentRow = startingRow;
      currentCol = startingCol;      

      for (let i = 0; i < wordSpread.length; i++) {
        let charCheckOK = charCheck(currentRow, currentCol, wordSpread[i], charMap);
        if (!charCheckOK) return false;
        updateRowAndCol(offset);
      }
      return placementData;
    }*/

    // helper functions
    function charCheck(row, col, char, charMap) {
      let currentSquareID = createSquareId(row, col);
      let isCheckOK = oneByOneCheck(currentSquareID, char, charMap);
      if (isCheckOK) {
        addToPlacementData(currentSquareID, char);
        return true;
      } else return false;
    }

    function addToPlacementData(currentSquareID, char) {
      placementData[currentSquareID] = char;  // add char to a local variable
    }

    function updateRowAndCol(offset) {
      currentRow += offset.row;
      currentCol += offset.col;
    }
  }

  // Check whether alredy filled character is compatible with the character-to-be-filled.
  function oneByOneCheck(currentSq, char, charMap) {
    if (!charMap[currentSq]) {
      //console.log("No char in the sq. Good to go!");
      return true;
    }
    else if (charMap[currentSq] === char) {
      //console.log("Existing char in sq is same as incoming. Good to go!");
      return true;
    }
    else {
      console.warn({
        oneByOneCheckFail: { 
          char, 
          currentSq, 
          storedChar: charMap[currentSq],
        }
      });
      //console.warn("Existing char in sq is NOT same as incoming. FAIL.");
      return false;
    }
  }
/*
  function fillAWord(randomCoordinates, wordToFill) {
    let { direction, startingRow, startingCol } = randomCoordinates;
    // () ရလာတဲ့ direction အတိုင်း tempHolder ထဲက စာလုံးတွေဖြည့်မယ်
    let tempChars = [...wordToFill];
    let success = false;
    // north
    if (direction === 1) {
      let currentRow = startingRow;
      for (let i = 0; i < tempChars.length; i++) {
        addCharacterToGrid(currentRow, startingCol, i, tempChars, wordPlacementData);
        currentRow--;
      }
      return success = true;
    }
    // north east
    else if (direction === 2) {
      let currentRow = startingRow;
      let currentCol = startingCol;
      for (let i = 0; i < tempChars.length; i++) {
        addCharacterToGrid(currentRow, currentCol, i, tempChars, wordPlacementData);
        currentRow--;
        currentCol++;
      }
      return success = true;
    }
    // east
    else if (direction === 3) {
      let currentCol = startingCol;
      for (let i = 0; i < tempChars.length; i++) {
        addCharacterToGrid(startingRow, currentCol, i, tempChars, wordPlacementData);
        currentCol++;
      }
      return success = true;
    }
    // south east
    else if (direction === 4) {
      let currentRow = startingRow;
      let currentCol = startingCol;
      for (let i = 0; i < tempChars.length; i++) {
        addCharacterToGrid(currentRow, currentCol, i, tempChars, wordPlacementData);
        currentRow++;
        currentCol++;
      }
      return success = true;
    }
    // south
    else if (direction === 5) {
      let currentRow = startingRow;
      for (let i = 0; i < tempChars.length; i++) {
        addCharacterToGrid(currentRow, startingCol, i, tempChars, wordPlacementData);
        currentRow++;
      }
      return success = true;
    }
    // south west
    else if (direction === 6) {
      let currentRow = startingRow;
      let currentCol = startingCol;
      for (let i = 0; i < tempChars.length; i++) {
        addCharacterToGrid(currentRow, currentCol, i, tempChars, wordPlacementData);
        currentRow++;
        currentCol--;
      }
      return success = true;
    }
    // west
    else if (direction === 7) {
      let currentCol = startingCol;
      for (let i = 0; i < tempChars.length; i++) {
        addCharacterToGrid(startingRow, currentCol, i, tempChars, wordPlacementData);
        currentCol--;
      }
      return success = true;
    }
    // north west
    else if (direction === 8) {
      let currentRow = startingRow;
      let currentCol = startingCol;
      for (let i = 0; i < tempChars.length; i++) {
        addCharacterToGrid(currentRow, currentRow, i, tempChars, wordPlacementData);
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
      printCharOnScreen(currentSquareID, tempChars[index]);   
      storeCharMap(currentSquareID, tempChars[index]);        // Map squre no. to character
      if(isFirstOrLastChar) storeCharCoordinates(currentSquareID);
    }
  }
*/ 
 
  function createSquareId(row, col) {
    return `sq-${row}-${col}`;
  }
/*
  function isStartOrEndIndex(index, tempChars) {
    return (index === 0 || index === tempChars.length - 1); // [sn2]
  }
*/
  function printCharOnScreen(currentSquareID, char) {
    let currentDOM = document.querySelector(`#${currentSquareID}`);
    currentDOM.textContent = char; // display on screen
  }

  // Map squre no. to character
/*  function storeCharMap(currentSquareID, char) {
    sqCharMap[currentSquareID] = char;
    //console.info(sqCharMap);
  }
*/
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