//import { globals } from "../services/globals";

export function interactionManager(globals) {
  const { appData } = globals; 
  const { selectors } = globals;
  const { squareFrame } = selectors;

  // Object to manage the placed words data.
  const _placedWordData = {
    _placedWordDetails: new Map(), // Map<string(selectedWord), string[](currentWordSquareIDs)>

    setWordDetails(selectedWord, currentWordSquareIDs) {
      this._placedWordDetails.set(selectedWord, currentWordSquareIDs);
    },

    hasWordDetails(selectedWord) {
      return this._placedWordDetails.has(selectedWord);
    },

    getWordDetails(selectedWord, type) {
      const squareIDs = this._placedWordDetails.get(selectedWord);
      if (!squareIDs) return null;
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

  // Object to manage the interaction state
  const _interactionState = {
    _endPointFlag: null,
    _tracerFlag: false,
    _endPointTimeout: null, // Add a timeout reference
    _hoverTimeout: null,

    setEndPointFlag(value) {
      this._endPointFlag = value;
    },

    getEndPointFlag() {
      return this._endPointFlag;
    },

    setTracerFlag(value) {
      this._tracerFlag = value;
    },

    getTracerFlag() {
      return this._tracerFlag;
    },

    setEndPointTimeout(timeout){
      this._endPointTimeout = timeout;
    },

    getEndPointTimeout(){
        return this._endPointTimeout;
    },

    setHoverTimeout(timeout) {
      this._hoverTimeout = timeout;
    },

    getHoverTimeout() {
      return this._hoverTimeout;
    },
  };

  // Object to hold all listeners
  const _listeners = {
    _wordSquareClickListeners: new Map(), // Map<string(selectedWord), object{string(squareID) : function}>.
    _dummySquareClickListeners: new Map(), // Map<string(squareID), function>.
  };

  // Adds a click event listener to a specific square.
  function addClickListener(placedWordDetails) {
    console.group("addClickListener()");
    const { selectedWord, currentWordSquareIDs } = placedWordDetails;

    _placedWordData.setWordDetails(selectedWord, currentWordSquareIDs);
    const startPoint = _placedWordData.getWordDetails(selectedWord, "start");
    const endPoint = _placedWordData.getWordDetails(selectedWord, "end");

    _listeners._wordSquareClickListeners.set(selectedWord, {});

    const squareMap = new Map([ 
      //Map<string(type), string(squareID)>, where type can be 'start' or 'end'.
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
    _interactionState.setEndPointFlag(_placedWordData.getWordDetails(selectedWord, "end"));
    _interactionState.setTracerFlag(true);

    // Clear any existing timeout before setting a new one
    clearTimeout(_interactionState.getEndPointTimeout());

    const squareDOMElement = document.querySelector(`#${squareID}`);
    squareDOMElement.classList.add("tracer"); 

    // Set a timeout to reset _endPointFlag
    const timeoutId = setTimeout(() => {
      _interactionState.setEndPointFlag(null);
      squareDOMElement.classList.remove("tracer");
      _interactionState.setTracerFlag(false);
      console.warn("Timeout: End point flag reset.");
    }, 10000); // 10 seconds (adjust as needed)

    _interactionState.setEndPointTimeout(timeoutId);

    console.info("Start squareID Clicked, endPoint:", _interactionState.getEndPointFlag());
  }

  function _handleEndSquareClick(squareID, selectedWord) {
    if (squareID === _interactionState.getEndPointFlag()) {
      console.warn("BINGOOOOO!!!!");
       // Clear timeout when the correct end square is clicked
       clearTimeout(_interactionState.getEndPointTimeout());
      const squaresToFill = _placedWordData.getWordDetails(selectedWord, "squareIDs");
      _highlightCompletedWord(squaresToFill);
      _removeDummyClickListener(squaresToFill);
      _markCompletedWord(selectedWord.toLowerCase()); // frontend list is in lowercase, that's why.
      _handleGameCompletion(selectedWord);
      _removeClickListener(selectedWord);
        _interactionState.setTracerFlag(false);
        _interactionState.setEndPointFlag(null);
    }
  }

  function _handleSquareClick(selectedWord, type, squareID) {
    const squareDOMElement = document.querySelector(`#${squareID}`);
    squareDOMElement.classList.add("tracer");
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
          listeners[squareID] = null;
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
      if (!_isWordSquare(squareID)) {
        const listener = () => {
          _handleDummySquareClick(squareID);
        };
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
    clearTimeout(_interactionState.getEndPointTimeout()); 
    clearTimeout(_interactionState._hoverTimeout); 

    const squareDOMElement = document.querySelector(`#${squareID}`);
    squareDOMElement.classList.add("tracer");
    _interactionState.setTracerFlag(true);
    _scopeMgr._getSurroundingScrope(squareDOMElement.id, appData.gridSize);
    
    _interactionState.setHoverTimeout(setTimeout(() => {
      _resetAllSquares();
    }, 5000)); // default 5000

    /*setTimeout(() => {
      //_interactionState.setTracerFlag(false);
      _resetAllSquares();
    }, 5000); // default 2000*/
    
  }

  function _resetAllSquares() {
    clearTimeout(_interactionState.getEndPointTimeout()); 
    clearTimeout(_interactionState.getHoverTimeout());

    const allSquares = document.querySelectorAll('[class|="sq"]');
    allSquares.forEach((squareDOMElement) => {
      squareDOMElement.classList.remove("tracer");
    });

    _interactionState.setTracerFlag(false);
    _interactionState.setEndPointFlag(null);
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
    const allSquares = document.querySelectorAll('[class|="sq"]');
    allSquares.forEach((squareDOMElement) => {
      squareDOMElement.addEventListener("mouseover", () => {
        _handleSquareHover(squareDOMElement);
      });
    });
  }

  function _handleSquareHover(squareDOMElement) {
    clearTimeout(_interactionState.getHoverTimeout()); // Clear any existing hover timeout

    if (_interactionState.getTracerFlag() && _scopeMgr._isWithinHoverScope(squareDOMElement.id)) {
      squareDOMElement.classList.add("tracer");
      _scopeMgr._getSurroundingScrope(squareDOMElement.id, appData.gridSize);
    }
    setTimeout(() => {
      _resetAllSquares();
    }, 5000); // default 2000
  }

  function _addEscapeListener(){
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" || event.key === "Esc") {
        _resetAllSquares();
      }
    });
  }

  function addTracerListener() {
    _addDummyClickListener();
    _addHoverListener();
    _addEscapeListener();
  }

  return {
    addClickListener,
    addTracerListener,
  };
}

const _scopeMgr = _scopeFinder();

function _scopeFinder() {
  const _hoverScope = new Set();

  function extractNumbers(squareIdString) {
    const regex = /^sq-(\d+)-(\d+)$/; // [le7]Regular expression to match the pattern 
    const match = squareIdString.match(regex);
  
    if (match) {
      const rowNumber = parseInt(match[1], 10); // Extract and parse the first number
      const columnNumber = parseInt(match[2], 10); // Extract and parse the second number
      return { rowNumber, columnNumber };
    } else {
      return null; // Return null if the string doesn't match the pattern
    }
  }
  
  function _isWithinGrid(number, gridSize) {
    return number > 0 && number <= gridSize;
  }
  
  function _reduceNumber(number, gridSize) {
    if (_isWithinGrid(number-1, gridSize)) {
      return number - 1;
    }
    return number;
  }
  
  function _increaseNumber(number, gridSize) {
    if (_isWithinGrid(number+1, gridSize)) {
      return number + 1;
    }
    return number;
  }
  
  function _constructScope(gridData) {
    const { rowNumber, columnNumber, gridSize } = gridData; 
    _hoverScope.clear();
  
    // checking left and right
      _hoverScope.add(`sq-${rowNumber}-${_reduceNumber(columnNumber, gridSize)}`);
      _hoverScope.add(`sq-${rowNumber}-${_increaseNumber(columnNumber, gridSize)}`);
  
    // checking top left, bottom left
      _hoverScope.add(`sq-${_reduceNumber(rowNumber, gridSize)}-${_reduceNumber(columnNumber, gridSize)}`);
      _hoverScope.add(`sq-${_increaseNumber(rowNumber, gridSize)}-${_reduceNumber(columnNumber, gridSize)}`);
  
    // checking top, bottom
      _hoverScope.add(`sq-${_reduceNumber(rowNumber, gridSize)}-${columnNumber}`);
      _hoverScope.add(`sq-${_increaseNumber(rowNumber, gridSize)}-${columnNumber}`);
  
    // checking top right, bottom right
      _hoverScope.add(`sq-${_reduceNumber(rowNumber, gridSize)}-${_increaseNumber(columnNumber, gridSize)}`);
      _hoverScope.add(`sq-${_increaseNumber(rowNumber, gridSize)}-${_increaseNumber(columnNumber, gridSize)}`);

    //console.info("_constructScope");
    //console.info(_hoverScope);
  }
  
  function _getSurroundingScrope(squareID, gridSize) {
    const { rowNumber, columnNumber } = extractNumbers(squareID);
    _constructScope({ rowNumber, columnNumber, gridSize });
  } 
  
  function _isWithinHoverScope(squareID) {
    return _hoverScope.has(squareID);
  }

  return {
    _getSurroundingScrope,
    _isWithinHoverScope,
  }
}