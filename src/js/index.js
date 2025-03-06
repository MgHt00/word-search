import { globals } from "./services/globals.js";
const {appData, currentStatus, selectors} = globals;

import { componentsManager } from "./components/componentsManager.js";
const { layoutManager, fillingManager, interactionManager } = componentsManager;

import { utilsManager } from "./utils/utilsManager.js";
const { helpers } = utilsManager;

const layoutMgr = layoutManager(globals);

const interactionMgr = interactionManager(globals);
const fillingMgr = fillingManager(globals, helpers, interactionMgr);

(function initialize() {
  layoutMgr.generateSqs();
  fillingMgr.fill([...globals.appData.wordList], appData.noOfWordsToDisplay);
})();