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
import { countdownManager } from "./components/countdownManager.js";
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

// Interaction Manager
const scopeDependencies = {
  getSurroundingScope,
  isWithinHoverScope,
};

const interaction = interactionManager(
  globals,
  wordPlacementQueryFns,
  settingFormStateFns,
  scopeDependencies,
);

const { setInteractionManagerCallbacks, initializeGameWords, initializeInteraction } = interaction;

// --- Countdown Manager ---
const countdown = countdownManager(globals, appSettingsFns);
const { setCoundownManagerCallbacks, initializeCountdown, pauseCountdown, countdownUtils } = countdown;

// --- Input Manager ---
const input = inputManager(globals, appSettingsFns, settingFormStateFns, countdownUtils);
const { initializeInput } = input;

// Loading Manager
const gameInitializers = {
  initializeGameWords, 
  initializeInteraction, 
  initializeInput, 
  initializeCountdown, 
}

const loading = loadingManager(
  globals,
  gameInitializers,
  generateSqs,
  getWordsUpToLength,
  fill,
  wordPlacementFns.reset_wordPlacementData,
  pauseCountdown,
);
const { start, enableRestart, enableGameOver, restart } = loading;

// --- Set Callbacks for Interaction Manager & Countdown Manager ---
setInteractionManagerCallbacks(enableRestart, restart);
setCoundownManagerCallbacks(enableGameOver);

// --- Start the Game ---
(async function initialize() {
  start();
})()