const appData = {
  wordList : ["delete", "suppress", "untracked", "nothing", "present", "branch", "background", "fetched", "comments", "console", "insertion", "deletion"],
  noOfWordsToDisplay : 2,
  gridSize: 14,
}

const selectors = {
  overlay : document.getElementById("overlay"),
  loadingText : document.getElementById("loading-text"),
  squareFrame : document.querySelector("#square-frame"),
  sectionWordList : document.querySelector("#section-word-list"),
}

const wordPlacementData = {
  squareIdToChar: new Map(), 
  // Map<string(squareID), string(char)> // Maps square numbers to characters.
  
  placedWordCoordinates: new Map(), 
  // Map<string(word), object{string[](placementData), string(direction)}>
  
  startIDAndEndID: new Map(), 
  // Map<string(squareID), string(squareID)>
};

export const globals =  {
  appData,
  selectors,
  wordPlacementData,
}