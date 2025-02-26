const appData = {
  wordList : ["delete", "suppress", "untracked", "nothing", "present", "branch", "background", "fetched", "comments", "console", "insertion", "deletion"],
  noOfWordsToDisplay : 10,
  gridSize: 14,
}

const selectors = {
  squareFrame : document.querySelector("#square-frame"),
  sectionWordList : document.querySelector("#section-word-list"),
}

const wordPlacementData = {
  startPoints: new Set(),
  endPoints: new Set(),
  sqCharMap: new Map(),   // Maps square numbers to characters.
};

export const globals =  {
  appData,
  selectors,
  wordPlacementData,
}