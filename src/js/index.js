import { globals } from "./services/globals.js";
const { appData, selectors } = globals;

import { componentsManager } from "./components/componentsManager.js";
const { layoutManager, fillingManager, interactionManager } = componentsManager;

import { utilsManager } from "./utils/utilsManager.js";
const { helpers } = utilsManager;

const layoutMgr = layoutManager(globals);

const interactionMgr = interactionManager(globals);
const { addClickListener } = interactionMgr;

const fillingMgr = fillingManager(
  globals,
  { random: helpers.random },
  { addClickListener },
);

(function initialize() {
  layoutMgr.generateSqs();
  fillingMgr.fill([...globals.appData.wordList], appData.noOfWordsToDisplay);
})();