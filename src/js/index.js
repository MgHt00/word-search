import { globals } from "./services/globals.js";
const { appData, selectors } = globals;

import { random } from "./utils/mathHelpers.js";
import { hasEnoughSq } from "./utils/gridHelpers.js";
import { compareExistingChar } from "./utils/placementHelpers.js"; 
import { createUL } from "./utils/domHelpers.js";

import { layoutManager } from "./components/layoutManager.js";
const layoutMgr = layoutManager(globals);

import { scopeFinder } from "./components/scopeFinder.js";
const { getSurroundingScope, isWithinHoverScope } = scopeFinder(appData.gridSize);

import { interactionManager } from "./components/interactionManager.js";
const { addClickListener, addTracerListener } = interactionManager(
  globals,
  { getSurroundingScope },
  { isWithinHoverScope }
);

import { fillingManager } from "./components/fillingManager.js";
const { fill } = fillingManager(
  globals,
  { random },
  { addClickListener },
  { hasEnoughSq },
  { compareExistingChar },
  { createUL }
);

(async function initialize() {
  layoutMgr.generateSqs();
  fill([...globals.appData.wordList], appData.noOfWordsToDisplay);
  addTracerListener();
})();