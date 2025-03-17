import { globals } from "./services/globals.js";
const { appData, selectors } = globals;

import { globalDataManager } from "./services/globalDataManager.js";
const { addPlacedWordCoordinates, addSquareIdToChar, isStartSquare, storeStartIDAndEndID, getEndSquareFromGlobal, findSelectedWordInGlobal, getSquareIDsOfSelectedWord } = globalDataManager(globals);

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

// Testing concerns
import { testWordList, testRandom } from "../../tests/testHelpers.js";

import { interactionManager } from "./components/interactionByDelegation.js";
const { initializeInteraction } = interactionManager(
  globals, 
  isStartSquare, getEndSquareFromGlobal, findSelectedWordInGlobal, getSquareIDsOfSelectedWord,
  getSurroundingScope, isWithinHoverScope,
);

import { fillingManager } from "./components/fillingManager.js";

const { fill } = fillingManager(
  globals,
  addPlacedWordCoordinates, addSquareIdToChar, storeStartIDAndEndID, // globalDataManager's
  testRandom(), // comment this after testing.
  //random, // uncomment for normal situation
  hasEnoughSq,
  compareExistingChar,
  createUL,
);

(async function initialize() {
  freeze(); 
  generateSqs();
  //await fill([...globals.appData.wordList], appData.noOfWordsToDisplay); // uncomment for normal situation
  await fill([...testWordList], appData.noOfWordsToDisplay); // comment this after testing.
  unfreeze(); 
  initializeInteraction();
})();
