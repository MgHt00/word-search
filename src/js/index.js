import { globals } from "./services/globals.js";
const {appData, currentStatus, selectors} = globals;

import { componentsManager } from "./components/componentsManager.js";
const { layoutManager, fillingManager, listenerManager } = componentsManager;

import { utilsManager } from "./utils/utilsManager.js";

const layoutMgr = layoutManager(globals);
const listenerMgr = listenerManager();
const fillingMgr = fillingManager(globals, utilsManager, listenerMgr);

(function initialize() {
  layoutMgr.generateSqs();
  fillingMgr.fill([...globals.appData.wordList], appData.noOfWordsToDisplay);
})();