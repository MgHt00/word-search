import { globals } from "./services/globals.js";
const { appData, selectors } = globals;

import { globalDataManager } from "./services/globalDataManager.js";
const { addPlacedWordCoordinates, addSquareIdToChar, isStartSquare, getEndSquareFromGlobal, findSelectedWordInGlobal, getSquareIDsOfSelectedWord } = globalDataManager(globals);

import { random } from "./utils/mathHelpers.js";
import { hasEnoughSq } from "./utils/gridHelpers.js";
import { compareExistingChar } from "./utils/placementHelpers.js";
import { createUL } from "./utils/domHelpers.js";

import { layoutManager } from "./components/layoutManager.js";
const { generateSqs } = layoutManager(globals);

import { loadingManager } from "./components/loadingManager.js";
const { freeze, unfreeze } = loadingManager(selectors);

import { scopeFinder } from "./components/scopeFinder.js";
const { getSurroundingScope, isWithinHoverScope } = scopeFinder(appData.gridSize);

import { interactionManager } from "./components/interactionByDelegation.js";
const { initializeInteraction } = interactionManager(
  globals, 
  isStartSquare, getEndSquareFromGlobal, findSelectedWordInGlobal, getSquareIDsOfSelectedWord,
  getSurroundingScope, isWithinHoverScope,
);

import { fillingManager } from "./components/fillingManager.js";
const { fill } = fillingManager(
  globals,
  addPlacedWordCoordinates, addSquareIdToChar,
  random,
  hasEnoughSq,
  compareExistingChar,
  createUL,
);

(async function initialize() {
  freeze(); // Freeze before loading the squares.
  generateSqs();
  await fill([...globals.appData.wordList], appData.noOfWordsToDisplay); // await for fill function to complete.
  unfreeze(); // unfreeze when the fill is complete.
  initializeInteraction();
})();
