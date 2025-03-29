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
    if (wordsData && wordsData[length]) {
      return wordsData[length];
    } else {
      return []; // Return an empty array if no words of that length are found
    }
  }

  return {
    loadWords,
    getWordsByLength,
  };
}
