import '../lib/bootstrap.bundle.js';

import { globals } from "./services/globals.js";
import { globalDataManager } from "./services/globalDataManager.js";
import { wordManager } from "./services/wordManager.js";
import { random } from "./utils/mathHelpers.js";
import { hasEnoughSq } from "./utils/gridHelpers.js";
import { compareExistingChar } from "./utils/placementHelpers.js";
import { createUL } from "./utils/domHelpers.js";
import { layoutManager } from "./components/layoutManager.js";
import { scopeFinder } from "./components/scopeFinder.js";
import { fillingManager } from "./components/fillingManager.js";
import { loadingManager } from "./components/loadingManager.js";
import { interactionManager } from "./components/interactionManager.js";
import { timerManager } from "./components/timerManager.js";
import { inputManager } from './components/inputManager.js';

// Testing concerns
import { testWordList, noOfWordsToDisplay, testRandom } from "../../tests/testHelpers.js";

// Global Data Manager
const dataManager = globalDataManager(globals);
const { appSettingsFns, wordPlacementFns, wordPlacementQueryFns, settingFormStateFns } = dataManager;

// Word Manager
const words = wordManager();
const { getWordsUpToLength } = words;

// Layout Manager
const layout = layoutManager(globals);
const { generateSqs } = layout;

// Scope Finder
const scope = scopeFinder(globals.appData.gridSize);
const { 
  getSurroundingScope, 
  isWithinHoverScope } = scope;

// Filling Manager
const filling = fillingManager(
  globals,
  wordPlacementFns,
  //testRandom(), // comment this after testing.
  random, // uncomment for normal situation
  hasEnoughSq,
  compareExistingChar,
  createUL,
); 
const { fill } = filling;

// Loading Manager
const loading = loadingManager(
  globals,
  generateSqs,
  getWordsUpToLength,
  fill,
  wordPlacementFns.reset_wordPlacementData,
);
const { start, enableRestart, enableGameOver, restart, setLoadingManagerCallbacks } = loading;

// Interaction Manager
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
  wordPlacementQueryFns,
  settingFormStateFns,
  scopeDependencies,
  controlDependencies,
);

const { initializeGameWords, initializeInteraction } = interaction;

// --- Timer Manager ---
const time = timerManager(globals, appSettingsFns, enableGameOver);
const { initializeCountdown, pauseCountdown } = time;

// --- Input Manager ---
const input = inputManager(globals, appSettingsFns, settingFormStateFns, initializeCountdown);
const { initializeInput } = input;

// --- Set Callbacks for Loading Manager ---
setLoadingManagerCallbacks({ initializeGameWords, initializeInteraction, initializeInput, initializeCountdown });

// --- Start the Game ---
(async function initialize() {
  start();
})()