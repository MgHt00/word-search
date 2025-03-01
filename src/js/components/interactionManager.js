export function interactionManager(globals) {
  const {wordPlacementData} =  globals;
  const {startPoints, endPoints, placedWordCoordinates} = wordPlacementData;

  let endPointFlag = null;

  // Adds a click event listener to a specific square.
  /**
    * @param {string} squareID - The ID of the square (e.g., "sq-3-5").
    * @param {string} type - The type of the square ("start" or "end").
  */
  function addClickListener(squareID, type, selectedWord) {
    const square = document.querySelector(squareID);
    const cleanedSquareID = cleanSquareID(squareID); // Remove the first character (#)

    if (square) {
      square.addEventListener("click", () => {
        if (type === "start") {
          const index = fetchIndex(cleanedSquareID, type, wordPlacementData);
          endPointFlag = endPoints[index];
        }

        if (type === "end") {
          if (cleanedSquareID === endPointFlag) {
            const squaresToFill = placedWordCoordinates.get(selectedWord).placementData;
            //const direction = placedWordCoordinates.get(selectedWord).direction;
            fillColor(squaresToFill);
          };
        }
      })
    } else {
      console.warn(`Square with ID ${squareID} not found.`);
    }

  }

  // Fetches the index of a square ID in either the startPoints or endPoints array.
  /**
   *
   * @param {string} squareID - The ID of the square (e.g., "sq-3-5").
   * @param {string} type - The type of the square ("start" or "end").
   * @param {object} placementObject - The object containing startPoints and endPoints arrays.
   * @returns {number} - The index of the square ID in the corresponding array, or -1 if not found.
   */
  function fetchIndex(squareID, type, placementObject) {
    const arrayName = `${type}Points`;
    const index = placementObject[arrayName].indexOf(squareID); // Get the index of squareID in the array
    return index;
  }

  function cleanSquareID(squareID) {
    return squareID.slice(1); // Remove the first character (#)
  }

  function constructDOMfromID(squareID) {
    return `#${squareID}`;
  }

  // Fill the squares with the marked class.
  /**
   *
   * @param {object} squaresToFill - The object that contains the key value of the squareID.
   */
  function fillColor(squares) {
    squares.map(square => {
      const squareID = constructDOMfromID(square);
      document.querySelector(squareID).classList.add("marked");
    })
  }
  return {
    addClickListener,
  }
}