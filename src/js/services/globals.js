import { SELECTORS } from "../constants/selectors.js";

const appData = {
  wordCount : 2, // default: 10 
  wordsMaxLength: 4, 
  gridSize: 14,
}

const selectors = {
  overlay: document.querySelector(SELECTORS.OVERLAY),
  loadingDIV: document.querySelector(SELECTORS.LOADING_DIV),
  restartDIV: document.querySelector(SELECTORS.RESTART_DIV),
  squareFrame: document.querySelector(SELECTORS.SQUARE_FRAME),
  sectionWordList: document.querySelector(SELECTORS.SECTION_WORD_LIST),
  wordCountInput: document.querySelector(SELECTORS.WORD_COUNT_INPUT),
  wordCountDisplay: document.querySelector(SELECTORS.WORD_COUNT_DISPLAY),
  maxLengthInput: document.querySelector(SELECTORS.MAX_LENGTH_INPUT),
  maxLengthDisplay: document.querySelector(SELECTORS.MAX_LENGTH_DISPLAY),
  timerInput: document.querySelector(SELECTORS.TIMER_INPUT),
  timerDisplay: document.querySelector(SELECTORS.TIMER_DISPLAY),
  offcanvasElement: document.querySelector(SELECTORS.OFFCANVAS_ELEMENT),
}

const wordPlacementData = {
  squareIdToChar: new Map(), 
  // Map<string(squareID), string(char)> // Maps square numbers to characters.
  
  placedWordCoordinates: new Map(), 
  // Map<string(word), object{string[](placementData), string(direction)}>
  
  startIDAndEndID: [], 
  // startIDAndEndID: [{"sq-1-1" : "sq-1-2"}, {"sq-1-1" : "sq-1-5"}];
  // key: startID, value: endID
};

export const globals =  {
  appData,
  selectors,
  wordPlacementData,
}