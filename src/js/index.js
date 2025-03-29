import '../lib/bootstrap.bundle.js';

import { globals } from "./services/globals.js";
import { globalDataManager } from "./services/globalDataManager.js";
import { wordManager } from "./services/wordManager.js";
import { random } from "./utils/mathHelpers.js";
import { hasEnoughSq } from "./utils/gridHelpers.js";
import { compareExistingChar } from "./utils/placementHelpers.js";
import { createUL } from "./utils/domHelpers.js";
import { layoutManager } from "./components/layoutManager.js";
import { scopeFinder } from "./components/scopeFinder.js";
import { fillingManager } from "./components/fillingManager.js";
import { loadingManager } from "./components/loadingManager.js";
import { interactionManager } from "./components/interactionManager.js";

// Testing concerns
import { testWordList, noOfWordsToDisplay, testRandom } from "../../tests/testHelpers.js";

// Global Data Manager
const dataManager = globalDataManager(globals);
const { 
  addPlacedWordCoordinates, 
  addSquareIdToChar, 
  isStartSquare, 
  storeStartIDAndEndID, 
  getEndSquaresFromGlobal, 
  getAllPlacedWords, 
  findSelectedWordInGlobal, 
  getSquareIDsOfSelectedWord,
  reset_wordPlacementData } = dataManager;

// Word Manager
const words = wordManager();
const { loadWords, getWordsByLength } = words;

// Layout Manager
const layout = layoutManager(globals);
const { generateSqs } = layout;

// Scope Finder
const scope = scopeFinder(globals.appData.gridSize);
const { 
  getSurroundingScope, 
  isWithinHoverScope } = scope;

// Filling Manager
const filling = fillingManager(
  globals,
  addPlacedWordCoordinates,
  addSquareIdToChar,
  storeStartIDAndEndID,
  //testRandom(), // comment this after testing.
  random, // uncomment for normal situation
  hasEnoughSq,
  compareExistingChar,
  createUL,
); 
const { fill } = filling;

// Loading Manager
let initializeCallbackObj = {};
const loading = loadingManager(
  globals,
  generateSqs,
  fill,
  reset_wordPlacementData,
  initializeCallbackObj,
);
const { start, enableRestart, restart, setInitializeCallback } = loading;

// Interaction Manager
const dataDependencies = {
  isStartSquare,
  getEndSquaresFromGlobal,
  getAllPlacedWords,
  findSelectedWordInGlobal,
  getSquareIDsOfSelectedWord,
};

const scopeDependencies = {
  getSurroundingScope,
  isWithinHoverScope,
};

const controlDependencies = {
  enableRestart,
  restart,
};

const interaction = interactionManager(
  globals,
  dataDependencies,
  scopeDependencies,
  controlDependencies,
);

const { initializeGameWords, initializeInteraction } = interaction;

setInitializeCallback({ initializeGameWords, initializeInteraction });

(async function initialize() {
  const words = await loadWords();
  console.log(words);
  /*const wordsByLength = await getWordsByLength(3);
  console.log(wordsByLength);*/
  start();
})()