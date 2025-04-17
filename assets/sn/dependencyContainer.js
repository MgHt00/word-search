// src/js/services/dependencyContainer.js
import { globals } from "./globals.js";
import { globalDataManager } from "./globalDataManager.js";
import { layoutManager } from "../components/layoutManager.js";
import { scopeFinder } from "../components/scopeFinder.js";
import { fillingManager } from "../components/fillingManager.js";
import { loadingManager } from "../components/loadingManager.js";
import { interactionManager } from "../components/interactionManager.js";
import { random } from "../utils/mathHelpers.js";
import { hasEnoughSq } from "../utils/gridHelpers.js";
import { compareExistingChar } from "../utils/placementHelpers.js";
import { createUL } from "../utils/domHelpers.js";

export function createDependencies() {
  // Global Data Manager
  const dataManager = globalDataManager(globals);
  const {
    addPlacedWordCoordinates,
    addSquareIdToChar,
    isStartSquare,
    storeStartIDAndEndID,
    getEndSquaresFromGlobal,
    getAllPlacedWords,
    findSelectedWordInGlobal,
    getSquareIDsOfSelectedWord,
    reset_wordPlacementData,
  } = dataManager;

  // Layout Manager
  const layout = layoutManager(globals);
  const { generateSqs } = layout;

  // Scope Finder
  const scope = scopeFinder(globals.appData.gridSize);
  const { getSurroundingScope, isWithinHoverScope } = scope;

  // Filling Manager
  const filling = fillingManager(
    globals,
    addPlacedWordCoordinates,
    addSquareIdToChar,
    storeStartIDAndEndID,
    random,
    hasEnoughSq,
    compareExistingChar,
    createUL,
  );
  const { fill } = filling;

  // Loading Manager
  let initializeCallback = null;
  const loading = loadingManager(
    globals,
    generateSqs,
    fill,
    reset_wordPlacementData,
    initializeCallback,
  );
  const { start, enableRestart, restart, setInitializeCallback } = loading;

  // Interaction Manager
  const dataDependencies = {
    isStartSquare,
    getEndSquaresFromGlobal,
    getAllPlacedWords,
    findSelectedWordInGlobal,
    getSquareIDsOfSelectedWord,
  };

  const scopeDependencies = {
    getSurroundingScope,
    isWithinHoverScope,
  };

  const controlDependencies = {
    enableRestart,
    restart,
  };

  const interaction = interactionManager(
    globals,
    dataDependencies,
    scopeDependencies,
    controlDependencies,
  );
  const { initializeInteraction } = interaction;

  setInitializeCallback(initializeInteraction);

  return {
    start,
  };
}

// src/js/index.js
import '../lib/bootstrap.bundle.js';
import { createDependencies } from "./services/dependencyContainer.js";

const { start } = createDependencies();

(async function initialize() {
  start();
})();

