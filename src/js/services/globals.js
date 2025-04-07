import { ELEMENTIDS } from "../constants/selectors.js";

const appData = {
  wordCount : 2, // default: 10 
  wordsMaxLength: 4,
  timer: 75,
  gridSize: 14,
}

const appState = {
  isSettingFormOpen: false,
}

const selectors = {
  overlay: document.querySelector(ELEMENTIDS.OVERLAY),
  loadingDIV: document.querySelector(ELEMENTIDS.LOADING_DIV),
  restartDIV: document.querySelector(ELEMENTIDS.RESTART_DIV),
  squareFrame: document.querySelector(ELEMENTIDS.SQUARE_FRAME),
  sectionWordList: document.querySelector(ELEMENTIDS.SECTION_WORD_LIST),
  wordCountInput: document.querySelector(ELEMENTIDS.WORD_COUNT_INPUT),
  wordCountDisplay: document.querySelector(ELEMENTIDS.WORD_COUNT_DISPLAY),
  maxLengthInput: document.querySelector(ELEMENTIDS.MAX_LENGTH_INPUT),
  maxLengthDisplay: document.querySelector(ELEMENTIDS.MAX_LENGTH_DISPLAY),
  timerInput: document.querySelector(ELEMENTIDS.TIMER_INPUT),
  timerDisplay: document.querySelector(ELEMENTIDS.TIMER_DISPLAY),
  timerContainer: document.querySelector(ELEMENTIDS.TIMER_CONTAINER),
  countdown: document.querySelector(ELEMENTIDS.COUNTDOWN),
  restartMessage: document.querySelector(ELEMENTIDS.RESTART_MSG),
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
  appState,
  selectors,
  wordPlacementData,
}