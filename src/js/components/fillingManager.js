export function fillingManager(globals, { random }, { addClickListener }, { checkLeft, checkRight, checkTop, checkBelow, isWithinBounds, hasEnoughSq }, { charCheck, createSquareId, isCharMatch, addPlacementData, updateRowAndCol, compareExistingChar }, { createUL }) {
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

  // To list the words underneath the square frame
  function listAWord(selectedWord, wordList) {
    let ulElement = wordList.querySelector("#word-list") || createUL(); // Cache & reuse the <ul> instead of creating a new one each time.
    let liElement = document.createElement("li");

    liElement.textContent = selectedWord;
    liElement.id = selectedWord;

    ulElement.appendChild(liElement);
    wordList.appendChild(ulElement);
  }

  return {
    fill,
  }
}