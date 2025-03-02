const appData = {
  wordList : ["delete", "suppress", "untracked", "nothing", "present", "branch", "background", "fetched", "comments", "console", "insertion", "deletion"],
  noOfWordsToDisplay : 3,
  gridSize: 14,
}

const selectors = {
  squareFrame : document.querySelector("#square-frame"),
  sectionWordList : document.querySelector("#section-word-list"),
}

const wordPlacementData = {
  //startPoints: new Set(),
  //endPoints: new Set(),
  startPoints: [],
  endPoints: [],
  squareIdToChar: new Map(), // Maps square numbers to characters.
  placedWordCoordinates: new Map(),
};

export const globals =  {
  appData,
  selectors,
  wordPlacementData,
}