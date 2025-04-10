import { WORDS_DATA_PATH } from '../constants/filePaths.js';
let wordsArrayLocalCopy = []; // Name ok???

export function wordManager() {
  async function loadWords() {
    try {
      const response = await fetch(WORDS_DATA_PATH);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error loading words:', error);
      return null; 
    }
  }

  async function getWordsByLength(length) {
    const wordsData = await loadWords();
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
    const wordsData = await loadWords();
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

  return {
    loadWords,
    getWordsUpToLength,
    getMinandMaxWordLength,
  };
}
