import { globals } from "./services/globals.js";
const {appData, currentStatus, selectors} = globals;

import { componentsManager } from "./components/componentsManager.js";
const { layoutManager, fillingManager } = componentsManager;

import { utilsManager } from "./utils/utilsManager.js";

const layoutMgr = layoutManager(globals);
const fillingMgr = fillingManager(globals, utilsManager);

(function initialize() {
  layoutMgr.generateSqs();
  fillingMgr.fill([...globals.appData.wordList], appData.noOfWordsToDisplay);
})();