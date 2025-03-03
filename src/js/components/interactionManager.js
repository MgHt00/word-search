export function interactionManager(globals) {
  const { selectors, wordPlacementData} =  globals;
  const { squareFrame } = selectors;
  const { startPoints, endPoints, placedWordCoordinates } = wordPlacementData;

  const interactionState = {
    filledWordCount: 0,
    wordData : new Map(),
    isStartPointClicked: false,
    
    /*endPointFlag: null,*/

    setFilledWordCount(value) {
      this.filledWordCount = value;
    },

    getFilledWordCount() {
      return this.filledWordCount;
    },

    reduceFilledWordCount() {
      this.filledWordCount--;
    },

    /*setEndPointFlag(value) {
      this.endPointFlag = value;
    },

    getEndPointFlag() {
      return this.endPointFlag;
    },*/

    addWordData(selectedWord, currentWordSquareIDs) {
      this.wordData.set(selectedWord, currentWordSquareIDs);
    },

    hasWordData(selectedWord) {
      return this.wordData.has(selectedWord);
    },

    getWordStartPoint(selectedWord) {
      return this.wordData.get(selectedWord)[0];
    },

    getWordEndPoint(selectedWord) {
      const squareIDs = this.wordData.get(selectedWord);
      return squareIDs[squareIDs.length - 1];
    },

    getWordSquareIDs(selectedWord) {
      return this.wordData.get(selectedWord);
    },

    removeWordData(selectedWord) {
      this.wordData.delete(selectedWord);
    }
  }

  // Adds a click event listener to a specific square.
  /**
    * @param {string} squareID - The ID of the square (e.g., "sq-3-5").
    * @param {string} type - The type of the square ("start" or "end").
  */

  function addClickListener(wordData) {
    console.group("addClickListener()")
    console.info(wordData);
    const { selectedWord, currentWordSquareIDs } = wordData;

    interactionState.addWordData(selectedWord, currentWordSquareIDs);
    const startPoint = interactionState.getWordStartPoint(selectedWord);
    const endPoint = interactionState.getWordEndPoint(selectedWord);
    
    addListener(startPoint, "start");
    addListener(endPoint, "end");
    
    console.groupEnd();

    // helper function
    function addListener(point, type) {
      const square = document.querySelector(`#${point}`);
      console.info(square);
      if (square) {
        square.addEventListener("click", () => {
          if (type === "start") { 
            interactionState.isStartPointClicked = true;
          }
          if (type === "end") { 
            if (interactionState.isStartPointClicked &&
              point === interactionState.getWordEndPoint(selectedWord)) {
              console.warn("BINGOOOOO!!!!");
              interactionState.isStartPointClicked = false;
              const squaresToFill = interactionState.getWordSquareIDs(selectedWord);
              console.info(squaresToFill);
              /*const squaresToFill = placedWordCoordinates.get(selectedWord).placementData;
              highlightCompletedWord(squaresToFill);
              markCompletedWord(selectedWord);
              checkAndHandleGameCompletion(squareFrame);*/
            }
          }
        })
      } else {
        console.warn(`Square with ID ${point} not found.`);
      }
    }
    
    function checkAndHandleGameCompletion(frame) {
      interactionState.reduceFilledWordCount(); // Decrement first!

      if (interactionState.getFilledWordCount() === 0) {
        frame.classList.add("dim");
      }
    }
  }

  function removeClickListener(squareID) { 
    // ဒီ logic အလုပ်မလုပ် ၊ selectedWord ကိုသုံးပြီး global ထဲက placeWordCoordinates ထဲက အစ နဲ့ အဆုံးကို ဆွဲထုတ်ပြီး ...
    // ...click ကို ဖြုတ်ရမယ်။
    const square = document.querySelector(squareID);
    console.info(square);
    if (square) {
      square.removeEventListener("click", () => {});
    } else {
      console.warn(`Square with ID ${squareID} not found.`);
    }
  }


  // Fetches the index of a square ID in either the startPoints or endPoints array.
  /**
   *
   * @param {string} squareID - The ID of the square (e.g., "sq-3-5").
   * @param {string} type - The type of the square ("start" or "end").
   * @param {object} placementObject - The object containing startPoints and endPoints arrays.
   * @returns {number} - The index of the square ID in the corresponding array, or -1 if not found.
   */
  function fetchIndex(squareID, type, placementObject) {
    const arrayName = `${type}Points`;
    const index = placementObject[arrayName].indexOf(squareID); // Get the index of squareID in the array
    return index;
  }

  function cleanSquareID(squareID) {
    return squareID.slice(1); // Remove the first character (#)
  }

  // Fill the squares with the marked class.
  /**
   *
   * @param {object} squaresToFill - The object that contains the key value of the squareID.
   */
  function highlightCompletedWord(squares) {
    squares.map(square => {
      const squareID = `#${square}`;
      document.querySelector(squareID).classList.add("highlight");
    })
  }

  function markCompletedWord(id) {
    const foundWordElement = document.querySelector(`#${id}`);
    console.info(`#${id}`);
    foundWordElement.classList.add("dim", "marked");
  }

  return {
    interactionState,
    addClickListener,
  }
}

// bug -> highlight လုပ်ပြီးသား အတွဲကို ထပ်နှိပ်ရင် wordcount ကို နှုတ်နေတာကြောင့် စာလုံးအားလုံး highlight မလုပ်သော်ငြားလဲ complete ဖြစ်နေတယ်။