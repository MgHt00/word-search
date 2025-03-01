export function interactionManager(globals) {
  const {wordPlacementData} =  globals;
  const {startPoints, endPoints, placedWordCoordinates} = wordPlacementData;

  let endflag = null;

  // Adds a click event listener to a specific square.
  /**
    * @param {string} squareID - The ID of the square (e.g., "sq-3-5").
    * @param {string} type - The type of the square ("start" or "end").
  */
  function addClickListener(squareID, type, selectedWord) {
    const square = document.querySelector(squareID);

    if (square) {
      square.addEventListener("click", () => {
        const index = fetchIndex(squareID, type, wordPlacementData);

        if (type === "start") {
          endflag = endPoints[index];
        }

        if (type === "end") {
          if (endflag === cleanSquareID(squareID)) {
            console.warn("BINGOOOOOOOOOOO!!!!");
            const squaresToFill = placedWordCoordinates.get(selectedWord).placementData;
            const direction = placedWordCoordinates.get(selectedWord).direction;
            console.log({ squaresToFill, direction });
            fillColor(squaresToFill);
          };
        }

        console.log({ type, squareID, index, endflag });
        //square.classList.toggle("marked"); 
      })
    } else {
      console.warn(`Square with ID ${squareID} not found.`);
    }
  }

  function fetchIndex(squareID, type, placementObject) {
      const arrayName = `${type}Points`;
      const cleanedSquareID = cleanSquareID(squareID); // Remove the first character (#)
      const index = placementObject[arrayName].indexOf(cleanedSquareID); // Get the index of squareID in the array
      return index;
  }

  function cleanSquareID(squareID) {
    return squareID.slice(1); // Remove the first character (#)
  }

  function constructDOMfromID(squareID) {
    return `#${squareID}`;
  }

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