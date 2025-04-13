import { WORDS_DATA_PATH } from '../constants/filePaths.js';
export function wordManager(appDataFns) {
  const { setJsonData, getJsonData, setMinAndMaxWordLength } = appDataFns;
  
  async function loadJSON() {
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
  }

  function getWordsUpToLength(wordsData, length) {
    let wordsArray = [];
    for (let i = length; i >= 1; i--) {
      if (wordsData[i]) {
        wordsArray.push(...wordsData[i]);
      }
    }
    return wordsArray;
  }

  function _getMinandMaxWordLength(wordsArray) {
    let minLength, maxLength;
    let keys = Object.keys(wordsArray);
    minLength = parseInt(keys[0]);
    maxLength = parseInt(keys[keys.length - 1]);

    if(isNaN(minLength) || isNaN(maxLength)) {
      console.error("Invalid word length found in keys:", keys);
      throw new Error(`JSON's min / max length: NaN.`);
    }

    return { minLength, maxLength };
  }

  async function prepareAppData() { 
    try {
      const wordsData = await loadJSON();
      if (!wordsData) throw new Error(`null data`);
      setJsonData(wordsData);

      const { minLength, maxLength } = _getMinandMaxWordLength(wordsData);
      setMinAndMaxWordLength(minLength, maxLength);
      //setMinWordLength(minLength);
      //setMaxWordLength(maxLength);
      
    } catch (error) {
      console.error("Error preparing word data:", error);
    }
  }

  return {
    prepareAppData,
    getWordsUpToLength,
  };
}
