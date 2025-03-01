export function interactionManager(globals) {
  const {wordPlacementData} =  globals;
  const {startPoint, endPoint} = wordPlacementData;

  // Adds a click event listener to a specific square.
  /**
    * @param {string} squareID - The ID of the square (e.g., "sq-3-5").
    * @param {string} type - The type of the square ("start" or "end").
  */
  function addClickListener(squareID, type) {
    const square = document.querySelector(squareID);
    if (square) {
      square.addEventListener("click", () => {
        const index = fetchIndex(squareID, type, wordPlacementData);
        console.log(`Clicked ${type} square: ${squareID} index: ${index}`);
        square.classList.toggle("marked"); 
      })
    } else {
      console.warn(`Square with ID ${squareID} not found.`);
    }
  }

  function fetchIndex(squareID, type, placementObject) {
      const arrayName = `${type}Points`;
      const cleanedSquareID = squareID.slice(1); // Remove the first character (#)
      console.info(`fetchIndex: ${arrayName}, ${squareID}`);
      const index = placementObject[arrayName].indexOf(cleanedSquareID); // Get the index of squareID in the array
      return index;
  }
  
  return {
    addClickListener,
  }
}