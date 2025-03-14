export function interactionManager(globals) {
  const { selectors, wordPlacementData } = globals;
  const { squareFrame } = selectors;
  const { startIDAndEndID } = wordPlacementData;

  function addClickListener() {
    squareFrame.addEventListener("click", (event) => {
      if (event.target.matches('[class|="sq"]')) {
        const clickedSquare = event.target.id;
        console.log("Clicked square ID:", clickedSquare);
        // Add your game logic here...
      }
    });
  }

  return {
    addClickListener,
  };
}