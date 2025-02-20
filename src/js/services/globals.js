const appData = {
  wordList : ["delete", "suppress", "untracked", "nothing", "present", "branch", "background", "fetched", "comments", "console", "insertion", "deletion"],
  noOfWordsToDisplay : 10,
  noOfSquares: 14,
}

const selectors = {
  squareFrame : document.querySelector("#square-frame"),
  sectionWordList : document.querySelector("#section-word-list"),
}

const wordPlacementData = {
  wordCoordinates: [],
  isStart: true,
}

export const globals =  {
  appData,
  selectors,
  wordPlacementData,
}