import { ELEMENTIDS } from "../constants/selectors.js";

const settingData = {
  // --- no. of words to search ---
  minWordCount: 2,
  maxWordCount: 10,
  wordCount: 2, // default: 10 

  // --- max length of each words ---
  wordsMaxLength: 4,

  // --- counter data in seconds ---
  countdown: 60, 
  minCountdown: 0,
  maxCountdown: 600,

  // --- other setting data ---
  gridSize: 14,
  debugMode: true, // default: false
}

const appData = {
  jsonData: [],
  minWordLength: null,
  maxWordLength: null,
}

const appState = {
  isCountdownPaused: false,
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
  countdownInput: document.querySelector(ELEMENTIDS.COUNTDOWN_INPUT),
  countdownDisplay: document.querySelector(ELEMENTIDS.COUNTDOWN_DISPLAY),
  countdownContainer: document.querySelector(ELEMENTIDS.COUNTDOWN_CONTAINER),
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
  settingData,
  appData,
  appState,
  selectors,
  wordPlacementData,
}