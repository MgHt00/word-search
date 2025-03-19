export function interactionManager( globals, isStartSquare, getEndSquaresFromGlobal, findSelectedWordInGlobal, getSquareIDsOfSelectedWord, getSurroundingScope, isWithinHoverScope) {
  const { appData, selectors, wordPlacementData } = globals;
  const { squareFrame } = selectors;
  const { placedWordCoordinates } = wordPlacementData;

  const _interactionState = {
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
    _targetEndSquares: [],
      addTargetEndSquares(squares) {
        squares.forEach(square => {
          this._targetEndSquares.push(square);
        });
        console.info("addTargetEndSquares:", this._targetEndSquares);
      },

      hasTargetEndSquares(squareIDs) {
        squareIDs = Array.isArray(squareIDs) ? squareIDs : [squareIDs];
        return squareIDs.some(squareID => this._targetEndSquares.includes(squareID));
      },

      resetTargetEndSquares(){ this._targetEndSquares = []; },

    _remainingWords: null,
      setRemainingWords(value) { this._remainingWords = value; },
      getRemainingWords() { return this._remainingWords; },
      reduceRemainingWords() { this._remainingWords--; },

    _finishedEndSquares: [],
      addFinishedEndSquare(square) { this._finishedEndSquares.push(square); },
      hasFinishedEndSquare(square) { return this._finishedEndSquares.includes(square); },
      resetFinishedEndSquares() { this._finishedEndSquares = []; },
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

  function _handleStartSquareClick(squareID) {
    const _targetEndSquares = getEndSquaresFromGlobal(squareID);
    if (_targetEndSquares) { // if it is not `null`
      _gameState.addTargetEndSquares(_targetEndSquares);

      // Set a timeout to reset _wordMatchTimeout
      const timeoutId = setTimeout(() => {
        _resetAllSquares();
      }, 5000);

      _interactionState.setWordMatchTimeout(timeoutId);
    }
  }

  function _handleOtherSquareClick(squareID) {
    console.info("_handleOtherSquareClick:",squareID);

    // if end square is clicked
      if (_gameState.hasTargetEndSquares(squareID) && !_gameState.hasFinishedEndSquare(squareID)) {
      const selectedWord = findSelectedWordInGlobal(squareID);
      if (selectedWord) {
        console.warn("BINGOOOOO!!!!");
        const squaresToFill = getSquareIDsOfSelectedWord(selectedWord);
        _highlightCompletedWord(squaresToFill);
        _markCompletedWord(selectedWord.toLowerCase());
        _handleGameCompletion();
        _resetAllSquares();
        _gameState.addFinishedEndSquare(squareID);
      }
    }

    _gameState.resetTargetEndSquares();
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
    _gameState.resetTargetEndSquares();
  }

  function _clearAllTimeOuts() {
    clearTimeout(_interactionState.getWordMatchTimeout());
    clearTimeout(_interactionState.getHoverTimeout());
    console.warn("Timeout: Word Match and Hover reset.")
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
    _addSquareListeners();
    _addEscapeListener();
  }

  return {
    initializeInteraction,
  };
}