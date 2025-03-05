export function interactionManager(globals) {
  const { selectors } =  globals;
  const { squareFrame } = selectors;

  // Object to manage the placed words data.
  const placedWordData = {
    placedWordDetails : new Map(),

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

  // Object to manage the endPoint state
  const interactionState = {
    endPointFlag: null,

    setEndPointFlag(value) {
      this.endPointFlag = value;
    },

    getEndPointFlag() {
      return this.endPointFlag;
    },
  }
  
  // Store a map to hold all the listener functions.
  const squareClickListeners = new Map();

  // Adds a click event listener to a specific square.
  function addClickListener(placedWordDetails) {
    console.group("addClickListener()");
    const { selectedWord, currentWordSquareIDs, } = placedWordDetails;

    placedWordData.addWordDetails(selectedWord, currentWordSquareIDs);
    const startPoint = placedWordData.getWordStartPoint(selectedWord);
    const endPoint = placedWordData.getWordEndPoint(selectedWord);

    const squareMap = new Map([
      ["start", startPoint],
      ["end", endPoint],
    ]);

    // create an object for the selectedWord, that is going to include all the listeners in it.
    squareClickListeners.set(selectedWord, {});

    squareMap.forEach((squareID, type, squareMap) => {
      const square = document.querySelector(`#${squareID}`);
      if (square) {
        const listener = () => { // later to be used with the removeEventListener
          handleSquareClick(selectedWord, type, squareID, squareMap);
        };
        square.addEventListener("click", listener);
        squareClickListeners.get(selectedWord)[squareID] = listener;
        } else {
        console.warn(`Square with ID ${squareID} not found.`);
      }
    });
    console.groupEnd();
  }

  function handleStartSquareClick(interactionState, squareMap) {
    interactionState.setEndPointFlag(squareMap.get("end"));
    console.info("Start squareID Clicked, endPoint:",interactionState.getEndPointFlag());
  }

  function handleEndSquareClick(placedWordData, interactionState, squareID, selectedWord, squareFrame) {
    if (squareID === interactionState.getEndPointFlag()) { 
      console.warn("BINGOOOOO!!!!");
      const squaresToFill = placedWordData.getWordSquareIDs(selectedWord);
      highlightCompletedWord(squaresToFill);
      markCompletedWord(selectedWord);
      handleGameCompletion(placedWordData, selectedWord, squareFrame);
      removeClickListener(selectedWord);
    }
  }

  function handleSquareClick(selectedWord, type, squareID, squareMap) {
    if (type === "start") { 
      handleStartSquareClick(interactionState, squareMap);
    }
    if (type === "end") {
      handleEndSquareClick(placedWordData, interactionState, squareID, selectedWord, squareFrame);
    }
  }

  function handleGameCompletion(placedWordData, selectedWord, squareFrame) {
    placedWordData.removeWordDetails(selectedWord);
    if (placedWordData.getWordDetailsSize() === 0) {
      squareFrame.classList.add("dim");
    }
  }

  function removeClickListener(selectedWord) {
    const listeners = squareClickListeners.get(selectedWord);
    if (listeners) {
      Object.keys(listeners).forEach(squareID => {
        const square = document.querySelector(`#${squareID}`);
        if (square) {
          square.removeEventListener("click", listeners[squareID]);
        } else {
          console.warn(`Square with ID ${squareID} not found.`);
          listeners[squareID] = null; // good practice to remove the listener reference.
        }
      });
      squareClickListeners.delete(selectedWord);
    }
  }

  // Fill the squares with the highlight class.
  function highlightCompletedWord(squares) {
    squares.forEach(square => {
      const squareID = `#${square}`;
      document.querySelector(squareID).classList.add("highlight");
    });
  }

  function markCompletedWord(id) {
    const foundWordElement = document.querySelector(`#${id}`);
    console.info(`#${id}`);
    foundWordElement.classList.add("dim", "marked");
  }

  return {
    addClickListener,
  }
}