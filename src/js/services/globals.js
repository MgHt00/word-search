import { ELEMENTIDS } from "../constants/selectors.js";

const settingData = {
  // --- Number of words to search for in the grid ---
  wordCount: 6, // The default number of words to be placed in the grid.
  minWordCount: 2,  // The minimum allowed number of words. (Used for input validation/range)
  maxWordCount: 10, // The maximum allowed number of words. (Used for input validation/range)

  // --- Maximum length of each word ---
  wordsMaxLength: 6, // The maximum number of characters a word can have.

  // --- Countdown timer settings (in seconds) ---
  countdown: 0, // The initial countdown time in seconds (0 means no countdown).
  minCountdown: 0, // The minimum allowed countdown time in seconds.
  maxCountdown: 600, // The maximum allowed countdown time in seconds.

  // --- Other game settings ---
  gridSize: 14, // The size of the grid (e.g., 14x14).
  debugMode: false, // Enables debug mode (e.g., showing word placement details). (default: false)
};

const appData = {
  // --- Raw JSON data loaded from the words data file ---
  jsonData: [], // Stores the loaded word data (e.g., an array of words).
  minWordLength: null, // The minimum word length found in the JSON data.
  maxWordLength: null, // The maximum word length found in the JSON data.
};

const appState = {
  // --- Flags to track the state of the countdown timer ---
  isCountdownPaused: false, // Indicates whether the countdown timer is currently paused.
  // --- Flag to track the state of the settings form ---
  isSettingFormOpen: false, // Indicates whether the settings form is currently open.
};

const wordPlacementData = {
  squareIdToChar: new Map(), 
  // Map<string(squareID), string(char)> // Maps square numbers to characters.
  
  placedWordCoordinates: new Map(), 
  // Map<string(word), object{string[](placementData), string(direction)}>
  
  startIDAndEndID: [], 
  // startIDAndEndID: [{"sq-1-1" : "sq-1-2"}, {"sq-1-1" : "sq-1-5"}];
  // key: startID, value: endID
};

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
};

export const globals =  {
  settingData,
  appData,
  appState,
  selectors,
  wordPlacementData,
}