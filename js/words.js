let words = ["words", "search", "untracked", "nothing", "present"];
let filledWords = {};

let currentWord = words[random(0, words.length-1)];
let wordSpread = [...currentWord];
console.log(`no. of character: ${wordSpread.length}`);

// finding starting positon
// noOfSqs is from 'main.js'
let startingRow = random(1, noOfSqs);
let startingCol = random(1, noOfSqs);
console.log("Starting row-col: ", startingRow,"-", startingCol);

direction = 5;
// 1 = north, 2 = north east, 3 = east, 4 = south east, 
// 5 = south, 6 = south west, 7 = west, 8 = north west

if (direction === 1) {
  if (enoughSq(direction)) {
    let currentRow = startingRow;
    for (i = 0; i < wordSpread.length; i++) {
      charFill(currentRow, startingCol, wordSpread[i]);
      currentRow--;
    }
  }
}

else if (direction === 2) {console.log(`direction: ${direction} - north east;`);}
else if (direction === 3) {
  

}
else if (direction === 4) {console.log(`direction: ${direction} - south east;`);}
else if (direction === 5) {
  if (enoughSq(direction)) {
    let currentRow = startingRow;
    for (i = 0; i < wordSpread.length; i++) {
      charFill(currentRow, startingCol, wordSpread[i]);
      currentRow++;
    }
  }
}
else if (direction === 6) {console.log(`direction: ${direction} - south west;`);}
else if (direction === 7) {console.log(`direction: ${direction} - west;`);}
else if (direction === 7) {console.log(`direction: ${direction} - north west;`);}
else {console.log(`No direction found`);}

// FUNCTION to calculate whether there is enough square in the calcuated direction
function enoughSq(direction) {
  let topRowReach = startingRow - wordSpread.length - 1;
  let bottomRowReach = startingRow + wordSpread.length - 1;
  let leftColReach = startingCol - wordSpread.length - 1;
  let rightColReach = startingCol - wordSpread.length + 1;
  console.log("topRowReach:", topRowReach, ", bottomRowReach:", bottomRowReach, ",leftColReach:", leftColReach, ",rightColReach:", rightColReach);

  if (direction === 1) {
    console.log(`direction: ${direction} - north`);
    // ရောက်သွားနိုင်တဲ့ top row number က ရှိတဲ့ အကွက် အရေအတွက်ထက် နည်းနေပြီဆိုရင် return false
    console.log("enoughSq: ",topRowReach < 0 ? false : true);
    return topRowReach < 0 ? false : true;
  }

  else if (direction === 3) {
    
  }

  else if (direction === 5) {
    console.log(`direction: ${direction} - south;`);
    // ရောက်သွားနိုင်တဲ့ bottom row number က ရှိတဲ့ အကွက် အရေအတွက်ထက် များနေပြီဆိုရင် return false
    console.log("enoughSq: ",bottomRowReach > noOfSqs ? false : true);
    return bottomRowReach > noOfSqs ? false : true;
  }
}

// to fill the square with a character
function charFill(row, col, fillChar) {
  let currentSq = document.querySelector(`#sq-${row}-${col}`);
  currentSq.textContent = fillChar;

  filledWords[`sq-${row}-${col}`] = fillChar;
  console.log("filledWords: ", filledWords);
}