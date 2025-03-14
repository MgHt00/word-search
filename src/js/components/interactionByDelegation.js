export function interactionManager(globals) {
  const { selectors, wordPlacementData } = globals;
  const { squareFrame } = selectors;
  const { placedWordCoordinates, startIDAndEndID } = wordPlacementData;

  const _interactionState = {
    _targetEndSquare: null,
    _wordMatchTimeout: null,

    setTargetEndSquare(value) {
      this._targetEndSquare = value;
    },

    getTargetEndSquare() {
      return this._targetEndSquare;
    },

    setWordMatchTimeout(timeout) {
      this._endPointTimeout = timeout;
    },

    getWordMatchTimeout() {
      return this._endPointTimeout;
    },
  }

  const _gameState = {
    _remainingWords: null,

    setRemainingWords(value) {
      this._remainingWords = value;
    },

    getRemainingWords() {
      return this._remainingWords;
    },

    reduceRemainingWords() {
      this._remainingWords--;
    }
  }

  function _addClickListener() {
    squareFrame.addEventListener("click", (event) => {
      if (event.target.matches('[class|="sq"]')) {
        const clickedSquare = event.target.id;

        if (_isStartSquare(clickedSquare)) {
          _handleStartSquareClick(clickedSquare);
        } 
                
        else {
          _handleOtherSquareClick(clickedSquare);
        }        

      }
    });
  }

  function _handleStartSquareClick(squareID) {
    const _targetEndSquare = _getEndSquareFromGlobal(squareID);
    _interactionState.setTargetEndSquare(_targetEndSquare);
    console.info("_handleStartSquareClick():_targetEndSquare", _interactionState.getTargetEndSquare());
    
    // Set a timeout to reset _wordMatchTimeout
    const timeoutId = setTimeout(() => {
      _resetAllSquares();
      console.warn("Timeout: Word Match reset.");
    }, 10000);

    _interactionState.setWordMatchTimeout(timeoutId);
  }

  function _handleOtherSquareClick(squareID) {
    console.info("_handleOtherSquareClick:",squareID);

    // if end square is clicked
    if (squareID === _interactionState.getTargetEndSquare()) {
      console.warn("BINGOOOOO!!!!");
      const selectedWord = _findSelectedWordInGlobal(squareID);
      if (selectedWord) {
        const squaresToFill = _getSquareIDsOfSelectedWord(selectedWord);
        _highlightCompletedWord(squaresToFill);
        _markCompletedWord(selectedWord.toLowerCase());
        _handleGameCompletion();
      }

      _resetAllSquares();
    }
  }

  function _addEscapeListener() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" || event.key === "Esc") {
        _resetAllSquares();
      }
    });
  }

  function _isStartSquare(squareID) {
    return startIDAndEndID.has(squareID);
  }

  function _getEndSquareFromGlobal(key) {
    return startIDAndEndID.get(key);
  }

  function _findSelectedWordInGlobal(endSquareID) {
    for (const [word, entry] of placedWordCoordinates) { 
      const storedEndSquareID = entry.placementData[entry.placementData.length - 1];
      if (storedEndSquareID === endSquareID) {
        return word; 
      }
    }
    return undefined; 
  }

  function _getSquareIDsOfSelectedWord(key) {
    const entry = placedWordCoordinates.get(key);
    return entry.placementData;
  }

  function _resetAllSquares() {
    clearTimeout(_interactionState.getWordMatchTimeout());
    //clearTimeout(_interactionState.getHoverTimeout());

    const allSquares = document.querySelectorAll('[class|="sq"]');
    allSquares.forEach((squareDOMElement) => {
      squareDOMElement.classList.remove("tracer");
    });

    //_interactionState.setTracerFlag(false);
    _interactionState.setTargetEndSquare(null);
  }

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

  function _handleGameCompletion() {
    _gameState.reduceRemainingWords();
    if (_gameState.getRemainingWords() === 0) {
      squareFrame.classList.add("dim");
    }
  }

  function initializeInteraction() {
    _gameState.setRemainingWords(placedWordCoordinates.size);
    _addClickListener();
    _addEscapeListener();
  }

  return {
    initializeInteraction,
  };
}