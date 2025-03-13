export function loadingManager(selectors) {
  const { body, squareFrame, sectionWordList } = selectors;
  const overlay = document.getElementById("overlay");
  const loadingText = document.getElementById("loading-text"); 

  function freeze() {
    squareFrame.classList.add("dim");
    sectionWordList.classList.add("dim");
    overlay.classList.remove("hidden");
    overlay.classList.add("visible");
    loadingText.classList.remove("hidden");
    loadingText.classList.add("visible");
  }

  function unfreeze() {
    squareFrame.classList.remove("dim");
    sectionWordList.classList.remove("dim");
    overlay.classList.remove("visible");
    overlay.classList.add("hidden");
    loadingText.classList.remove("visible");
    loadingText.classList.add("hidden");
  }

  return {
    freeze,
    unfreeze,
  };
}