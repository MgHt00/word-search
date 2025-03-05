export function interactionManager(globals) {
  const { selectors, wordPlacementData} =  globals;
  const { squareFrame } = selectors;

  const interactionState = {
    placedWordDetails : new Map(),    
    endPointFlag: null,

    setEndPointFlag(value) {
      this.endPointFlag = value;
    },

    getEndPointFlag() {
      return this.endPointFlag;
    },

    addWordDetails(selectedWord, currentWordSquareIDs) {
      this.placedWordDetails.set(selectedWord, currentWordSquareIDs);
    },

    hasWordDetails(selectedWord) {
      return this.placedWordDetails.has(selectedWord);
    },

    getWordStartPoint(selectedWord) {
      return this.placedWordDetails.get(selectedWord)[0];
    },

    getWordEndPoint(selectedWord) {
      const squareIDs = this.placedWordDetails.get(selectedWord);
      return squareIDs[squareIDs.length - 1];
    },

    getWordSquareIDs(selectedWord) {
      return this.placedWordDetails.get(selectedWord);
    },

    removeWordDetails(selectedWord) {
      this.placedWordDetails.delete(selectedWord);
    },

    getWordDetailsSize() {
      return this.placedWordDetails.size;
    },
  }

  // Adds a click event listener to a specific square.
  function addClickListener(placedWordDetails) {
    console.group("addClickListener()");
    console.info(placedWordDetails);
    const { selectedWord, currentWordSquareIDs, } = placedWordDetails;

    interactionState.addWordDetails(selectedWord, currentWordSquareIDs);
    const startPoint = interactionState.getWordStartPoint(selectedWord);
    const endPoint = interactionState.getWordEndPoint(selectedWord);

    const squareMap = new Map([
      ["start", startPoint],
      ["end", endPoint],
    ]);

    squareMap.forEach((point, type, squareMap) => {
      const square = document.querySelector(`#${point}`);
      if (square) {
        square.addEventListener("click", () => {
          handlesSquareClick(selectedWord, type, point, squareMap);
        });
      } else {
        console.warn(`Square with ID ${point} not found.`);
      }

    });
        
    console.groupEnd();
  }

  function handlesSquareClick(selectedWord, type, point, squareMap) {
    if (type === "start") { 
      interactionState.setEndPointFlag(squareMap.get("end"));
      console.info("Start point Clicked, endPoint:",interactionState.getEndPointFlag());
    }
    if (type === "end") {
      if (point === interactionState.getEndPointFlag()) { 
        console.warn("BINGOOOOO!!!!");
        const squaresToFill = interactionState.getWordSquareIDs(selectedWord);
        highlightCompletedWord(squaresToFill);
        markCompletedWord(selectedWord);
        checkAndHandleGameCompletion(selectedWord, squareFrame);
      }
    }
  }

  function checkAndHandleGameCompletion(selectedWord, squareFrame) {
    interactionState.removeWordDetails(selectedWord);

    if (interactionState.getWordDetailsSize() === 0) {
      squareFrame.classList.add("dim");
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

  // Fill the squares with the marked class.
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