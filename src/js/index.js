import '../lib/bootstrap.bundle.js';

import { globals } from "./services/globals.js";
const { appData, selectors } = globals;

import { globalDataManager } from "./services/globalDataManager.js";
const { 
  addPlacedWordCoordinates, 
  addSquareIdToChar, 
  isStartSquare, 
  storeStartIDAndEndID, 
  getEndSquaresFromGlobal, 
  getAllPlacedWords, 
  findSelectedWordInGlobal, 
  getSquareIDsOfSelectedWord } = globalDataManager(globals);

import { random } from "./utils/mathHelpers.js";

import { hasEnoughSq } from "./utils/gridHelpers.js";
import { compareExistingChar } from "./utils/placementHelpers.js";
import { createUL } from "./utils/domHelpers.js";

import { layoutManager } from "./components/layoutManager.js";
const { generateSqs } = layoutManager(globals);

import { scopeFinder } from "./components/scopeFinder.js";
const { getSurroundingScope, isWithinHoverScope } = scopeFinder(appData.gridSize);

// Testing concerns
import { testWordList, noOfWordsToDisplay, testRandom } from "../../tests/testHelpers.js";

import { fillingManager } from "./components/fillingManager.js";

const { fill } = fillingManager(
  globals,

  addPlacedWordCoordinates, 
  addSquareIdToChar, 
  storeStartIDAndEndID, // globalDataManager's

  //testRandom(), // comment this after testing.
  random, // uncomment for normal situation
  hasEnoughSq,
  compareExistingChar,
  createUL,
);

let initializeCallback = null;
import { loadingManager } from "./components/loadingManager.js";
const { start, 
  enableRestart, 
  restart, 
  setInitializeCallback} = loadingManager(globals, generateSqs, fill, initializeCallback);

import { interactionManager } from "./components/interactionManager.js";
const { initializeInteraction } = interactionManager(
  globals, 
  isStartSquare, 

  getEndSquaresFromGlobal, 
  getAllPlacedWords, 
  findSelectedWordInGlobal, 
  getSquareIDsOfSelectedWord,

  getSurroundingScope, 
  isWithinHoverScope,

  enableRestart,
  restart,
);

setInitializeCallback(initializeInteraction);

(async function initialize() {
  start();
})()