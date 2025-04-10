import { WORDS_DATA_PATH } from '../constants/filePaths.js';
export function wordManager(appSettingsFns) {
  const { setJsonData } = appSettingsFns;
  
  async function loadJSON() {
    try {
      const response = await fetch(WORDS_DATA_PATH);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type") || ""; // If the header doesn’t exist, it defaults to an empty string (""), preventing errors when checking.
      if (!contentType.includes("application/json")) {                // If the server responds with Content-Type: 'application/json; charset=UTF-8' instead of 'application/json', 
        throw new TypeError(`Expected JSON, got ${type}`);            // ...this allows variations like "application/json; charset=UTF-8" to pass the check.
      }

      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Error loading JSON:', error);
      return null; 
    }
  }

  async function getWordsByLength(length) {
    const wordsData = await loadJSON();
    if (!wordsData) {
      return null; 
    }
    if (wordsData[length]) {
      return wordsData[length];
    } else {
      return null; 
    }
  }

  async function getWordsUpToLength(length) {
    const wordsData = await loadJSON();
    if (!wordsData) {
      return null; 
    }
    let wordsArray = [];
    for (let i = length; i >= 1; i--) {
      if (wordsData[i]) {
        wordsArray.push(...wordsData[i]);
      }
    }
    return wordsArray;
  }

  function getMinandMaxWordLength(wordsArray) {
    // check whether wordsArrayLocalCopy is not empty
    let minLength, maxLength;
    let keys = Object.keys(wordsArray);
    minLength = parseInt(keys[0]);
    maxLength = parseInt(keys[keys.length - 1]);
    return { minLength, maxLength };
  }

  async function prepareWordData(length) {
    const wordsData = await loadJSON();
    if (!wordsData) {
      console.warn("Failed to load words data.");
      return;
    }
    setJsonData(wordsData);
    getWordsUpToLength(length);
  }

  return {
    loadJSON,
    getWordsUpToLength,
    getMinandMaxWordLength,
  };
}
