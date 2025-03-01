export function listenerManager() {
  // Adds a click event listener to a specific square.
  /**
    * @param {string} squareID - The ID of the square (e.g., "sq-3-5").
    * @param {string} type - The type of the square ("start" or "end").
  */
  function addClickListener(squareID, type) {
    const square = document.querySelector(squareID);
    if (square) {
      square.addEventListener("click", () => {
        console.log(`Clicked ${type} square: ${squareID}`);
        square.classList.toggle("marked"); 
      })
    } else {
      console.warn(`Square with ID ${squareID} not found.`);
    }
  }

  return {
    addClickListener,
  }
}