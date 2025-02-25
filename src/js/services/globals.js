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
  //wordCoordinates: [],  // Stores the start and end square numbers for each word. (array of objects)
  startPoints: [],
  endPoints: [],
  //isStart: true,        // Flag indicating whether the current square is the start of a word.
  sqCharMap: {},        // Maps square numbers to characters.
};

export const globals =  {
  appData,
  selectors,
  wordPlacementData,
}