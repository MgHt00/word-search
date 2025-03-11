export function interactionManager(globals) {
  const { selectors } = globals;
  const { squareFrame } = selectors;

  // Object to manage the placed words data.
  const _placedWordData = { // private
    _placedWordDetails: new Map(), 

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
    _endPointFlag: null, 
    _tracerFlag: null,

    setEndPointFlag(value) {
      this._endPointFlag = value;
    },

    getEndPointFlag() {
      return this._endPointFlag;
    },
  };

  // Object to hold all listeners
  const _listeners = {
    _wordSquareClickListeners : new Map(), // to hold all the listed word's listener functions.
    _dummySquareClickListeners : new Map(), // to hold all the listener functions for dummy clicks.
    //_allSquareHoverListeners: new Map(), // to hold all the listener functions for hover.
  };

  // Adds a click event listener to a specific square.
  function addClickListener(placedWordDetails) { //exposed function
    console.group("addClickListener()");
    const { selectedWord, currentWordSquareIDs } = placedWordDetails;

    _placedWordData.setWordDetails(selectedWord, currentWordSquareIDs);
    const startPoint = _placedWordData.getWordDetails(selectedWord, "start");
    const endPoint = _placedWordData.getWordDetails(selectedWord, "end");

    // create an object for the selectedWord, that is going to include all the listeners in it.
    _listeners._wordSquareClickListeners.set(selectedWord, {});

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
        _listeners._wordSquareClickListeners.get(selectedWord)[squareID] = listener;
      } else {
        console.warn(`Square with ID ${squareID} not found.`);
      }
    });
    console.groupEnd();
  }

  function _handleStartSquareClick(squareID, selectedWord) { 
    const square = document.querySelector(`#${squareID}`);
    square.classList.add("tracer");
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
      _removeDummyClickListener(squaresToFill);
      _markCompletedWord(selectedWord.toLowerCase()); // list is in lowercase, that's why.
      _handleGameCompletion(selectedWord);
      _removeClickListener(selectedWord);
    }
  }

  function _handleSquareClick(selectedWord, type, squareID) { 
    if (type === "start") {
      _handleStartSquareClick(squareID, selectedWord);
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
    const listeners = _listeners._wordSquareClickListeners.get(selectedWord);
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
      _listeners._wordSquareClickListeners.delete(selectedWord);
    }
  }

  // Fill the squares with the highlight class.
  function _highlightCompletedWord(squares) { 
    squares.forEach((square) => {
      const squareID = `#${square}`;
      document.querySelector(squareID).classList.remove("clicked");
      document.querySelector(squareID).classList.add("highlight");
    });
  }

  function _markCompletedWord(id) { 
    const foundWordElement = document.querySelector(`#${id}`);
    foundWordElement.classList.add("dim", "marked");
  }

  function _addDummyClickListener() {
    const allDummySquares = document.querySelectorAll('[class|="sq"]');
    allDummySquares.forEach((squareDOMElement) => {
      const squareID = squareDOMElement.id;
      if(!_isWordSquare(squareID)){
        const listener = () => {
          _handleDummySquareClick(squareID); 
        }
        squareDOMElement.addEventListener("click", listener);
        _listeners._dummySquareClickListeners.set(squareID, listener);
      }
    });
  }

  function _isWordSquare(squareID) {
    const listeners = _listeners._wordSquareClickListeners.values();
    for (const listener of listeners) {
      if (squareID in listener) {
        return true;
      }
    } 
    return false;
  }

  function _handleDummySquareClick(squareID) {
    const squareDOMElement = document.querySelector(`#${squareID}`);
    squareDOMElement.classList.add("tracer");
    _interactionState._tracerFlag = true;

    setTimeout(() => {
      squareDOMElement.classList.remove("tracer");
    }, 2000);

    setTimeout(() => {
      _interactionState._tracerFlag = false;
    }, 5000);
  }

  // This function removes dummy click listeners from the given square elements.
  function _removeDummyClickListener(squares) {
    squares.forEach((squareID) => {
      if (_listeners._dummySquareClickListeners.has(squareID)) {
        const listener = _listeners._dummySquareClickListeners.get(squareID);
        const squareDOMElement = document.querySelector(`#${squareID}`);
        squareDOMElement.removeEventListener("click", listener);
        _listeners._dummySquareClickListeners.delete(squareID);
      }
    });
  }

  function _addHoverListener() {
    // need to check the scope before adding the hover class, otherwise grid is messy all over the place.
    // if only the hovering square is adjacent squres of the clicked squre, they will be hovered. 

    // shall we set the endFlag to null with setTimeOut?

    // Bug, at the initial, when the correct word's start squre is clicked, the tracer class revoke immediately. 

    const allDummySquares = document.querySelectorAll('[class|="sq"]');
    allDummySquares.forEach((squareDOMElement) => {
      squareDOMElement.addEventListener("mouseover", () => { 
        _handleSquareHover(squareDOMElement);
      });
    });
  }

  function _handleSquareHover(squareDOMElement) {
    if (_interactionState._tracerFlag) {
      squareDOMElement.classList.add("tracer");
    }

    setTimeout(() => {
      squareDOMElement.classList.remove("tracer");
    }, 500);
  }

  function addTracerListener() {
    _addDummyClickListener();
    _addHoverListener();
  }


  return {
    addClickListener,  
    addTracerListener,
  };
}