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

  function addClickListener() {
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

  function _isStartSquare(squareID) {
    return startIDAndEndID.has(squareID);
  }

  function _getEndSquareFromMap(key) {
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

  function _handleStartSquareClick(squareID) {
    const _targetEndSquare = _getEndSquareFromMap(squareID);
    _interactionState.setTargetEndSquare(_targetEndSquare);
    console.info("_targetEndSquare", _interactionState.getTargetEndSquare());
    
    console.info("placedWordCoordinates:", placedWordCoordinates);

    // Set a timeout to reset _wordMatchTimeout
    const timeoutId = setTimeout(() => {
      _resetAllSquares();
      console.warn("Timeout: Word Match reset.");
    }, 10000);

    _interactionState.setWordMatchTimeout(timeoutId);
  }

  function _handleOtherSquareClick(squareID) {
    console.info("Other square clicked:",squareID);

    // if end square is clicked
    if (squareID === _interactionState.getTargetEndSquare()) {
      console.warn("BINGOOOOO!!!!");
      const selectedWord = _findSelectedWordInGlobal(squareID);
      if (selectedWord) {
        const squaresToFill = _getSquareIDsOfSelectedWord(selectedWord);
        _highlightCompletedWord(squaresToFill);
      }

      _resetAllSquares();
    }
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

  // Fill the squares with the highlight class.
  function _highlightCompletedWord(squares) {
    squares.forEach((square) => {
      const squareID = `#${square}`;
      document.querySelector(squareID).classList.remove("clicked");
      document.querySelector(squareID).classList.add("highlight");
    });
  }

  return {
    addClickListener,
  };
}