import { globals } from "./services/globals.js";
const {appData, currentStatus, selectors} = globals;

import { layout } from "./components/layoutManager.js";
const layoutMgr = layout(globals);

(function initialize() {
  layoutMgr.generateSqs(appData.noOfSquares);
})();