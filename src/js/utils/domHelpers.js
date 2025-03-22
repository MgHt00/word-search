/*export function createUL(className = "") {
  let ulElement = document.createElement("ul");
  ulElement.id = "word-list";
  if (className) {
    ulElement.classList.add(className);
  }
  return ulElement;
}*/

export function createUL(className) { // using bootstrap
  const ulElement = document.createElement("ul");
  ulElement.id = "word-list"; // Add an ID for easier selection later

  // Add Bootstrap classes for styling
  // ulElement.classList.add("list-group"); // Basic list styling
  if (className) {
    ulElement.classList.add(className); // Add any additional custom classes
  }

  return ulElement;
}
