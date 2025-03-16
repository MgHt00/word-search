export function createUL(className = "") {
  let ulElement = document.createElement("ul");
  ulElement.id = "word-list";
  if (className) {
    ulElement.classList.add(className);
  }
  return ulElement;
}