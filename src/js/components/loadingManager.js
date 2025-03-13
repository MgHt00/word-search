export function loadingManager(selectors) {
  const { body, squareFrame, sectionWordList } = selectors;

  function freeze() {
    squareFrame.classList.add("dim");
    sectionWordList.classList.add("dim");
    document.getElementById("overlay").style.display = "block";
    document.getElementById("loading-text").style.display = "block";
  }

  function unfreeze() {
    squareFrame.classList.remove("dim");
    sectionWordList.classList.remove("dim");
    document.getElementById("overlay").style.display = "none";
    document.getElementById("loading-text").style.display = "none";
  }

  return {
    freeze,
    unfreeze,
  };
}