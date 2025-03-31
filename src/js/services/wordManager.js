import { WORDS_DATA_PATH } from '../constants/filePaths.js';

export function wordManager() {
  async function loadWords() {
    try {
      const response = await fetch(WORDS_DATA_PATH);
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

  return {
    loadWords,
    getWordsUpToLength,
  };
}
