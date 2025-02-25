export function dataManager(globals, utilsManager) {
  const { appData, selectors, wordPlacementData } =  globals;
  const { gridSize } = appData;
  const { sectionWordList } =  selectors;
  let { startPoints, endPoints, sqCharMap } = wordPlacementData;
  const { helpers } = utilsManager;

  const maxRetries = 50;
  let retries = 0;

  function fill(words, noOfWordsToDisplay) {
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
        const coordinates =  generateRandomCoordinates(gridSize);
        let hasEnoughSpace =  false; 
        let charCheckData = false;

        hasEnoughSpace = hasEnoughSq(coordinates, selectedWord, gridSize);

        if (hasEnoughSpace) { 
          charCheckData = existingCharCheck(coordinates, selectedWord, sqCharMap);  
        }

        if( hasEnoughSpace && charCheckData ) {
          console.info({PROCCEDING: {selectedWord, hasEnoughSpace, charCheckData}});
          const entries = Object.entries(charCheckData);
          const firstIndex = 0;
          const lastIndex = entries.length - 1;

          entries.forEach(([squareID, char], index) => {
            printCharOnScreen(squareID, char);
            //if (index === firstIndex || index === lastIndex) setStartOrEnd(squareID, wordCoordinates, isStart);
            if (index === firstIndex) storeStartPoint(squareID, startPoints);
            if (index === lastIndex) storeEndPoint(squareID, endPoints);
            updateSqCharMap(squareID, char, sqCharMap) // Map squre no. to character
          });
          
          listAWord(selectedWord);

          words.splice(index, 1);   // delete filled words from array 
          wordsRemaining--;
          
          break;
        } 
      }
    }

    // if there are still words left to be displayed, recall the root function. 
    if (wordsRemaining > 0) {
      retries++;
      setTimeout(() => { //[sn1]
        fill(words, wordsRemaining);
      }, 0);
    }
    console.info({ startAndEnds : { startPoints, endPoints }});

    // helper functions
    function selectRandomWord() {
      let index = helpers.random(0, (words.length - 1));
      let selectedWord = words[index];

      return { index, selectedWord };
    }
  }

  // generate new starting positons
  function generateRandomCoordinates(gridDimension) {
    let direction = getRandomDirection();
    let startingRow = helpers.random(1, gridDimension);
    let startingCol = helpers.random(1, gridDimension);

    return { direction, startingRow, startingCol } ;
    
    // helper function
    function getRandomDirection() {
      return helpers.random(1, 8);
    }
  }

  // Map squre no. to character
  function updateSqCharMap(key, value, charMap) {
      charMap[key] = value;
  }

  // To check whether there is enough square in the calcuated direction
  function hasEnoughSq(randomCoordinates, selectedWord, gridDimension) {
    let { direction, startingRow, startingCol } = randomCoordinates;
    let wordSpread = [...selectedWord];
    let maxRow = gridDimension; 
    let maxCol = gridDimension; 
    
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
 
  function createSquareId(row, col) {
    return `sq-${row}-${col}`;
  }

  function printCharOnScreen(currentSquareID, char) {
    let currentDOM = document.querySelector(`#${currentSquareID}`);
    currentDOM.textContent = char; // display on screen
  }

  /*function setStartOrEnd(startOrEndID, allCoordinatesData) {
    let currentIndex = allCoordinatesData.length;

    if (isStart) {
      allCoordinatesData.push({ start: startOrEndID });         // Append a new object
      allCoordinatesData[currentIndex]["start"] = startOrEndID;
      isStart = false;
    }
    else {
      allCoordinatesData[currentIndex - 1]["end"] = startOrEndID; // modify the last object
      isStart = true;
    }
  }*/

  function storeStartPoint(squareID, startCoordinates) {
    startCoordinates.push(squareID);
  }

  function storeEndPoint(squareID, endCoordinates) {
    endCoordinates.push(squareID);
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