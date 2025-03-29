export function wordManager() {
  async function loadWords() {
    try {
      const response = await fetch('../../assets/data/words.json'); // Adjust the path if needed
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
