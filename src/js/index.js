import { globals } from "./services/globals.js";
const { appData, selectors } = globals;

import { helpers } from "./utils/helpers.js";

import { gridHelpers } from "./utils/gridHelpers.js";
const { checkTop, checkBelow, checkRight, checkLeft, isWithinBounds } = gridHelpers();

import { layoutManager } from "./components/layoutManager.js";
const layoutMgr = layoutManager(globals);

import { interactionManager } from "./components/interactionManager.js";
const { addClickListener } = interactionManager(globals);

import { fillingManager } from "./components/fillingManager.js";
/*const fillingMgr = fillingManager(
  globals,
  { random: helpers.random },
  { addClickListener },
  {
    checkTop,
    checkBelow,
    checkRight,
    checkLeft,
    isWithinBounds
  },
  {
    charCheck,
    createSquareId,
    isCharMatch,
    addPlacementData,
    updateRowAndCol
  },
  { createUL }
);*/

const fillingMgr = fillingManager(
  globals,
  { random: helpers.random },
  { addClickListener },
  { 
    checkLeft,
    checkRight,
    checkTop,
    checkBelow,
    isWithinBounds,
  },
);

(function initialize() {
  layoutMgr.generateSqs();
  fillingMgr.fill([...globals.appData.wordList], appData.noOfWordsToDisplay);
})();