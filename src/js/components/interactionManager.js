export function interactionManager(globals) {
  const { selectors } = globals;
  const { squareFrame } = selectors;

  // Object to manage the placed words data.
  const _placedWordData = { // private
    _placedWordDetails: new Map(), //private

    setWordDetails(selectedWord, currentWordSquareIDs) {
      this._placedWordDetails.set(selectedWord, currentWordSquareIDs);
    },

    hasWordDetails(selectedWord) {
      return this._placedWordDetails.has(selectedWord);
    },

    getWordDetails(selectedWord, type) {
      const squareIDs = this._placedWordDetails.get(selectedWord);
      if (!squareIDs) return null; // return null instead of undefined.
      if (type === "start") return squareIDs[0];
      if (type === "end") return squareIDs[squareIDs.length - 1];
      if (type === "squareIDs") return squareIDs;
      return null;
    },

    removeWordDetails(selectedWord) {
      this._placedWordDetails.delete(selectedWord);
    },

    getWordDetailsSize() {
      return this._placedWordDetails.size;
    },
  };

  // Object to manage the endPoint state
  const _interactionState = { //private
    _endPointFlag: null, //private

    setEndPointFlag(value) {
      this._endPointFlag = value;
    },

    getEndPointFlag() {
      return this._endPointFlag;
    },
  };

  // Store a map to hold all the listener functions.
  const _squareClickListeners = new Map(); // private

  // Adds a click event listener to a specific square.
  function addClickListener(placedWordDetails) { //exposed function
    console.group("addClickListener()");
    const { selectedWord, currentWordSquareIDs } = placedWordDetails;

    _placedWordData.setWordDetails(selectedWord, currentWordSquareIDs);
    const startPoint = _placedWordData.getWordDetails(selectedWord, "start");
    const endPoint = _placedWordData.getWordDetails(selectedWord, "end");

    // create an object for the selectedWord, that is going to include all the listeners in it.
    _squareClickListeners.set(selectedWord, {});

    const squareMap = new Map([
      ["start", startPoint],
      ["end", endPoint],
    ]);
    squareMap.forEach((squareID, type) => {
      const square = document.querySelector(`#${squareID}`);
      if (square) {
        const listener = () => {
          _handleSquareClick(selectedWord, type, squareID);
        };
        square.addEventListener("click", listener);
        _squareClickListeners.get(selectedWord)[squareID] = listener;
      } else {
        console.warn(`Square with ID ${squareID} not found.`);
      }
    });
    console.groupEnd();
  }

  function _handleStartSquareClick(selectedWord) { 
    _interactionState.setEndPointFlag(_placedWordData.getWordDetails(selectedWord,"end"));
    console.info(
      "Start squareID Clicked, endPoint:",
      _interactionState.getEndPointFlag()
    );
  }

  function _handleEndSquareClick(squareID, selectedWord) { 
    if (squareID === _interactionState.getEndPointFlag()) {
      console.warn("BINGOOOOO!!!!");
      const squaresToFill = _placedWordData.getWordDetails(selectedWord, "squareIDs");
      _highlightCompletedWord(squaresToFill);
      _markCompletedWord(selectedWord.toLowerCase()); // list is in lowercase, that's why.
      _handleGameCompletion(selectedWord);
      _removeClickListener(selectedWord);
    }
  }

  function _handleSquareClick(selectedWord, type, squareID) { 
    if (type === "start") {
      _handleStartSquareClick(selectedWord);
    }
    if (type === "end") {
      _handleEndSquareClick(squareID, selectedWord);
    }
  }

  function _handleGameCompletion(selectedWord) { 
    _placedWordData.removeWordDetails(selectedWord);
    if (_placedWordData.getWordDetailsSize() === 0) {
      squareFrame.classList.add("dim");
    }
  }

  function _removeClickListener(selectedWord) { 
    const listeners = _squareClickListeners.get(selectedWord);
    if (listeners) {
      Object.keys(listeners).forEach((squareID) => {
        const square = document.querySelector(`#${squareID}`);
        if (square) {
          square.removeEventListener("click", listeners[squareID]);
        } else {
          console.warn(`Square with ID ${squareID} not found.`);
          listeners[squareID] = null; // good practice to remove the listener reference.
        }
      });
      _squareClickListeners.delete(selectedWord);
    }
  }

  // Fill the squares with the highlight class.
  function _highlightCompletedWord(squares) { 
    squares.forEach((square) => {
      const squareID = `#${square}`;
      document.querySelector(squareID).classList.add("highlight");
    });
  }

  function _markCompletedWord(id) { 
    const foundWordElement = document.querySelector(`#${id}`);
    foundWordElement.classList.add("dim", "marked");
  }

  return {
    addClickListener,
  };
}