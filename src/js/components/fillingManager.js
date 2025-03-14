export function fillingManager(globals, { random }, { addClickListener }, { hasEnoughSq }, { compareExistingChar }, { createUL }) {
  const { appData, selectors, wordPlacementData } = globals;
  const { gridSize } = appData;
  const { sectionWordList } = selectors;

  const { squareIdToChar, placedWordCoordinates } = wordPlacementData;

  // Data for generateRandomCoordinates()
  const _directionMap = new Map([ //Map<number, string(direction)>.
    [1, "north"],
    [2, "north-east"],
    [3, "east"],
    [4, "south-east"],
    [5, "south"],
    [6, "south-west"],
    [7, "west"],
    [8, "north-west"],
  ]);

  function _printCharOnScreen(squareID, char) {
    document.querySelector(`#${squareID}`).textContent = char;
    document.querySelector(`#${squareID}`).classList.add("temp-identifier"); // remove this when stable
  }

  function _printCharOnScreenDUMMY(squareID, char) { // remove this function when stable
    document.querySelector(`#${squareID}`).textContent = char;
  }

  function _addSquareIdToChar(squareID, char, charMap) {
    charMap.set(squareID, char);
  }

  function _addPlacedWordCoordinates(word, placementData, coordinates) {
    placedWordCoordinates.set(word, { placementData, direction: coordinates.direction });
  }

  function _selectRandomWord(wordsArray) {
    let index = random(0, (wordsArray.length - 1));
    let selectedWord = wordsArray[index];
    return { index, selectedWord };
  }

  function _generateRandomCoordinates(gridDimension) {
    let direction = _getRandomDirection();
    let startingRow = random(1, gridDimension);
    let startingCol = random(1, gridDimension);

    return { direction, startingRow, startingCol };
  }

  function _getRandomDirection() {
    return _directionMap.get(random(1, 8));
  }

  // To list the words underneath the square frame
  function _listAWord(selectedWord, wordList, className) {
    let ulElement = wordList.querySelector("#word-list") || createUL(className); // Cache & reuse the <ul> instead of creating a new one each time.
    let liElement = document.createElement("li");

    liElement.textContent = selectedWord;
    liElement.id = selectedWord;

    ulElement.appendChild(liElement);
    wordList.appendChild(ulElement);
  }

  function _toUpperCases(words) {
    return words.map((word) => word.toUpperCase());
  }

  function _toLowerCases(selectedWord){
    return selectedWord.toLowerCase();
  }

  // Function to fill remaining squares with dummy characters
  function _fillRemainingSquares() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const allSquares = document.querySelectorAll('[class|="sq"]');
    allSquares.forEach((square) => {
      const squareID = square.id;
      if (!squareIdToChar.has(squareID)) {
        const randomChar = alphabet[random(0, alphabet.length - 1)];
        //_printCharOnScreen(squareID, randomChar); // use this when stable
        _printCharOnScreenDUMMY(squareID, randomChar); // remove this when stable
      }
    });
  }

  function _storeStartIDAndEndID(startSquareID, endSquareID) {
    wordPlacementData.startIDAndEndID.set(startSquareID, endSquareID);
  }

  function fillingMgr() {
    async function _placeWords(words, noOfWordsToDisplay, overallAttempts = 0) { //[le5]
      //let wordsArray = [...words.map(word => word.toUpperCase())];
      let wordsArray = [..._toUpperCases(words)];
      let wordsRemaining = noOfWordsToDisplay;
      let maxOverallAttempts = 20; // [Default = 20]Limit overall retries to prevent infinite loops

      if (overallAttempts >= maxOverallAttempts) {
        console.warn(`Max overallAttempts reached. Unable to place ${wordsRemaining} word(s).`);
        return;
      }

      console.info(`Attempt ${overallAttempts + 1}: Remaining word(s) to fill in:`, wordsRemaining);

      let { index, selectedWord } = _selectRandomWord(wordsArray);
      let singleWordRetries = 0;
      let maxSingleWordRetries = 30; // [Default = 30] If a word fails placement 30 times, move to the next word

      while (singleWordRetries < maxSingleWordRetries) {
        singleWordRetries++;
        const coordinates = _generateRandomCoordinates(gridSize);

        let hasEnoughSpace = hasEnoughSq(coordinates, selectedWord, gridSize);
        let placementData = hasEnoughSpace && compareExistingChar(coordinates, selectedWord, squareIdToChar); //[le3]

        if (hasEnoughSpace && placementData) {
          console.info({ PROCEEDING: { selectedWord, hasEnoughSpace, placementData } });

          const entries = Object.entries(placementData);
          const currentWordSquareIDs = entries.map(([squareID]) => squareID);
          const wordData = { selectedWord, currentWordSquareIDs };
          
          _storeStartIDAndEndID(currentWordSquareIDs[0], currentWordSquareIDs[currentWordSquareIDs.length - 1]);
          //addClickListener(wordData);

          entries.forEach(([squareID, char]) => {
            _printCharOnScreen(squareID, char);
            _addSquareIdToChar(squareID, char, squareIdToChar);
          });

          _addPlacedWordCoordinates(selectedWord, currentWordSquareIDs, coordinates);
          _listAWord(_toLowerCases(selectedWord), sectionWordList, "multi-column-list");

          wordsArray.splice(index, 1); // Remove placed word
          wordsRemaining--;

          break; // Move to next word
        }
      }

      if (wordsRemaining > 0) {
        console.warn(`Retrying fill... Attempt ${overallAttempts + 1}/${maxOverallAttempts}`);
        //setTimeout(() => _placeWords(wordsArray, wordsRemaining, overallAttempts + 1), 0); //[le4]
        await new Promise((resolve) => setTimeout(resolve, 0));
        await _placeWords(wordsArray, wordsRemaining, overallAttempts + 1); //[le7]
      } else {
        console.info({
          placedWordCoordinates,
        });
      }
    }
    return {
      fill: async (words, noOfWordsToDisplay) => {
        await _placeWords(words, noOfWordsToDisplay);
        _fillRemainingSquares();
      }
    };
  }
  return fillingMgr();
}
