import { globals } from "./services/globals.js";
const { appData, selectors } = globals;

import { random } from "./utils/mathHelpers.js";
import { hasEnoughSq } from "./utils/gridHelpers.js";
import { compareExistingChar } from "./utils/placementHelpers.js"; 
import { createUL } from "./utils/domHelpers.js";

import { layoutManager } from "./components/layoutManager.js";
const layoutMgr = layoutManager(globals);

import { interactionManager } from "./components/interactionManager.js";
const { addClickListener } = interactionManager(globals);

import { fillingManager } from "./components/fillingManager.js";

const fillingMgr = fillingManager(
  globals,
  { random },
  { addClickListener },
  { hasEnoughSq },
  { compareExistingChar },
  { createUL }
);

(function initialize() {
  layoutMgr.generateSqs();
  fillingMgr.fill([...globals.appData.wordList], appData.noOfWordsToDisplay);
})();