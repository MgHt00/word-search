let words = ["words", "search", "untracked", "nothing", "present"];

let currentWord = words[random(0, words.length-1)];
let wordSpread = [...currentWord];

let startingNumber = `sq-${random(1, noOfSqs)}-${random(1, noOfSqs)}`;
console.log(startingNumber);
let startingSquare = document.querySelector(`#${startingNumber}`);
console.log(startingSquare);