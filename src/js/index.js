import { globals } from "./services/globals.js";
const {appData, currentStatus, selectors} = globals;

import { componentsManager } from "./components/componentsManager.js";
const { layoutManager, dataManager } = componentsManager;

import { utilsManager } from "./utils/utilsManager.js";

const layoutMgr = layoutManager(globals);
const dataMgr = dataManager(globals, utilsManager);

(function initialize() {
  layoutMgr.generateSqs();
  dataMgr.fillWords([...globals.appData.wordList], appData.noOfWordsToDisplay);
})();