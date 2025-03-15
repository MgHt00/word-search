export function interactionManager( globals, isStartSquare, getEndSquareFromGlobal, findSelectedWordInGlobal, getSquareIDsOfSelectedWord, getSurroundingScope, isWithinHoverScope) {
  const { selectors, wordPlacementData } = globals;
  const { squareFrame } = selectors;
  const { placedWordCoordinates } = wordPlacementData;

  const _interactionState = {
    _targetEndSquare: null,
      setTargetEndSquare(value) { this._targetEndSquare = value; },
      getTargetEndSquare() { return this._targetEndSquare; },

    _wordMatchTimeout: null,
      setWordMatchTimeout(timeout) { this._endPointTimeout = timeout; },
      getWordMatchTimeout() { return this._endPointTimeout; },
    
    _hoverTimeout: null,
      setHoverTimeout(timeout) { this._hoverTimeout = timeout; },
      getHoverTimeout() { return this._hoverTimeout; },

    _tracerFlag: false,
      setTracerFlag(value) { this._tracerFlag = value; },
      getTracerFlag() { return this._tracerFlag; },
  }

  const _gameState = {
    _remainingWords: null,
      setRemainingWords(value) { this._remainingWords = value; },
      getRemainingWords() { return this._remainingWords; },
      reduceRemainingWords() { this._remainingWords--; },
  }

  function _addSquareListeners() {
    squareFrame.addEventListener("click", (event) => {
      if (event.target.matches('[id|="sq"]')) {
        _handleClick(event.target);
      }
    });

    squareFrame.addEventListener("mouseover", (event) => {
      if (event.target.matches('[id|="sq"]')) {
        _handleHover(event.target);
      }
    });
  }

  function _handleClick(target) {
    _interactionState.setTracerFlag(true);
    target.classList.add("tracer");
    getSurroundingScope(target.id);

    const clickedSquare = target.id;
    if (isStartSquare(clickedSquare)) {
      _handleStartSquareClick(clickedSquare);
    }
    else {
      _handleOtherSquareClick(clickedSquare);
    }
  }

  function _handleHover(target) {
    clearTimeout(_interactionState.getWordMatchTimeout());
    clearTimeout(_interactionState.getHoverTimeout());

    if (_interactionState.getTracerFlag() && isWithinHoverScope(target.id)) {
      target.classList.add("tracer");
      getSurroundingScope(target.id);
    }

    _interactionState.setHoverTimeout(
      setTimeout(() => {
        _resetAllSquares();
      }, 5000));
  }

  function _handleStartSquareClick(squareID) {
    const _targetEndSquare = getEndSquareFromGlobal(squareID);
    _interactionState.setTargetEndSquare(_targetEndSquare);
    console.info("_handleStartSquareClick():_targetEndSquare", _interactionState.getTargetEndSquare());
    
    // Set a timeout to reset _wordMatchTimeout
    const timeoutId = setTimeout(() => {
      _resetAllSquares();
    }, 5000);

    _interactionState.setWordMatchTimeout(timeoutId);
  }

  function _handleOtherSquareClick(squareID) {
    console.info("_handleOtherSquareClick:",squareID);

    // if end square is clicked
    if (squareID === _interactionState.getTargetEndSquare()) {
      console.warn("BINGOOOOO!!!!");
      const selectedWord = findSelectedWordInGlobal(squareID);
      if (selectedWord) {
        const squaresToFill = getSquareIDsOfSelectedWord(selectedWord);
        _highlightCompletedWord(squaresToFill);
        _removeSquareIdentifiers(squaresToFill); // to remove the click listeners on the completed words
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

  function _resetAllSquares() {
    _clearAllTimeOuts();
    
    const allSquares = document.querySelectorAll('[class|="sq"]');
    allSquares.forEach((squareDOMElement) => {
      squareDOMElement.classList.remove("tracer");
    });

    _interactionState.setTracerFlag(false);
    _interactionState.setTargetEndSquare(null);
  }

  function _clearAllTimeOuts() {
    clearTimeout(_interactionState.getWordMatchTimeout());
    console.warn("Timeout: Word Match reset.");
    clearTimeout(_interactionState.getHoverTimeout());
    console.warn("Timeout: Hover reset.");
  }

  function _highlightCompletedWord(squares) {
    squares.forEach((square) => {
      const squareID = `#${square}`;
      document.querySelector(squareID).classList.remove("clicked");
      document.querySelector(squareID).classList.add("highlight");
    });
  }

  function _removeSquareIdentifiers(squares) {
    squares.forEach(square => {
      const squareDOMElement = document.querySelector(`#${square}`);
      if(squareDOMElement.id.startsWith("sq-")) {
        squareDOMElement.removeAttribute("id");
      }
      /*
      const classesToRemove = Array // [le8]
      .from(squareDOMElement.classList) 
      .filter(className => className.startsWith("sq"));
      squareDOMElement.classList.remove(...classesToRemove);
      */
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
    _addSquareListeners();
    _addEscapeListener();
  }

  return {
    initializeInteraction,
  };
}