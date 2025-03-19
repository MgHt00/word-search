export function interactionManager( globals, isStartSquare, getEndSquaresFromGlobal, findSelectedWordInGlobal, getSquareIDsOfSelectedWord, getSurroundingScope, isWithinHoverScope) {
  const { appData, selectors, wordPlacementData } = globals;
  const { squareFrame } = selectors;
  const { placedWordCoordinates } = wordPlacementData;

  const _interactionState = {
    _targetEndSquare: null,
      setTargetEndSquare(value) { this._targetEndSquare = value; },
      getTargetEndSquare() { return this._targetEndSquare; },

    _targetEndSquares: [],
      addTargetEndSquares(squares) {
        squares.forEach(square => {
          this._targetEndSquares.push(square);
        });
      },
      getTargetEndSquares() { return this._targetEndSquares; },
      hasTargetEndSquare(squareID) {
        return this._targetEndSquares.includes(squareID);
      },
      removeTargetEndSquare(squareID) {
        const index = this._targetEndSquares.indexOf(squareID);
        if (index !== -1) {
          this._targetEndSquares.splice(index, 1);
        }
      },

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
      if (event.target.matches('[id|="sq"]') && !event.target.classList.contains("disabled")) {
        _handleClick(event.target);
      }
    });

    squareFrame.addEventListener("mouseover", (event) => {
      if (event.target.matches('[id|="sq"]') && !event.target.classList.contains("disabled")) {
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
    _interactionState.addTargetEndSquares(_targetEndSquares);
    
    // Set a timeout to reset _wordMatchTimeout
    const timeoutId = setTimeout(() => {
      _resetAllSquares();
    }, 5000);

    _interactionState.setWordMatchTimeout(timeoutId);
  }

  function _handleOtherSquareClick(squareID) {
    console.info("_handleOtherSquareClick:",squareID);

    // if end square is clicked
      if (_interactionState.hasTargetEndSquare(squareID)) {
      console.warn("BINGOOOOO!!!!");
      const selectedWord = findSelectedWordInGlobal(squareID);
      if (selectedWord) {
        const squaresToFill = getSquareIDsOfSelectedWord(selectedWord);
        _highlightCompletedWord(squaresToFill);
        _markCompletedWord(selectedWord.toLowerCase());
        _handleGameCompletion();
      }

      _interactionState.removeTargetEndSquare(squareID);
      _resetAllSquares();
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

  function _addDisabledClass(squares) {
    squares.forEach(squareID => {
      const squareDOMElement = document.querySelector(`#${squareID}`);
  
      if (squareDOMElement && squareDOMElement.classList.contains("highlight")) {
        squareDOMElement.classList.add("disabled");
      }
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

  function _removeSquareIdentifiers(squares) {
    squares.forEach(square => {
      const squareDOMElement = document.querySelector(`#${square}`);
      if(squareDOMElement.id.startsWith("sq-")) {
        squareDOMElement.removeAttribute("id");
      }
      
      /*const classesToRemove = Array // [le8]
      .from(squareDOMElement.classList) 
      .filter(className => className.startsWith("sq"));
      squareDOMElement.classList.remove(...classesToRemove);*/
    });
  }

  function _cloneAndRemoveListeners(squares) {
    squares.forEach(squareID => { // squareID is more accurate here
      const squareDOMElement = document.querySelector(`#${squareID}`);
  
      if (squareDOMElement && squareDOMElement.classList.contains("highlight")) {
        // Clone the DOM element.
        const newSquareDOMElement = squareDOMElement.cloneNode(true);
  
        // Replace the original element with the cloned one.
        // By replacing, all the event listeners are cleared.
        squareDOMElement.parentNode.replaceChild(newSquareDOMElement, squareDOMElement);
      }
    });
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