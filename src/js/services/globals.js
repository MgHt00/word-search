const appData = {
  wordCount : 2, // default: 10 
  wordsMaxLength: 4, 
  gridSize: 14,
}

const selectors = {
  overlay : document.getElementById("overlay"),
  loadingDIV : document.querySelector("#loading-div"),
  restartDIV : document.querySelector("#restart-div"),
  squareFrame : document.querySelector("#square-frame"),
  sectionWordList : document.querySelector("#section-word-list"),
  wordCountInput : document.querySelector("#range-word-count"),
  wordCountDisplay : document.querySelector("#label-word-count"),
  maxLengthInput : document.querySelector("#range-max-length"),
  maxLengthDisplay : document.querySelector("#label-max-length"),
  timerInput : document.querySelector("#range-timer"),
  timerDisplay : document.querySelector("#label-timer"),
}

console.log("settingForm in globals.js:", selectors.settingForm);

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