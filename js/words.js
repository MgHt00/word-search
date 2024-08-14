let words = ["words", "search", "untracked", "nothing", "present"];
let filledWords = {};

//let currentWord = words[random(0, words.length-1)];
let currentWord = ["w","o","r","d","s"];
let wordSpread = [...currentWord];
console.log(`no. of character: ${wordSpread.length}`);

// finding starting positon
// noOfSqs is fetched from 'main.js'
let startingRow = random(1, noOfSqs);
let startingCol = random(1, noOfSqs);
console.log("Starting row-col: ", startingRow,"-", startingCol);

// temp - direction will be random in final.
direction = 8;
// 1 = north, 2 = north east, 3 = east, 4 = south east, 
// 5 = south, 6 = south west, 7 = west, 8 = north west
if (direction === 1) {
  console.log(`direction: ${direction} - `);
  if (enoughSq(direction)) {
    let currentRow = startingRow;
    for (i = 0; i < wordSpread.length; i++) {
      charFill(currentRow, startingCol, wordSpread[i]);
      currentRow--;
    }
  }
}
// north east
else if (direction === 2) {
  console.log(`direction: ${direction} - north east;`);
  if (enoughSq(direction)) {
    let currentRow = startingRow;
    let currentCol = startingCol;
    for (i = 0; i < wordSpread.length; i++) {
      charFill(currentRow, currentCol, wordSpread[i]);
      currentRow--;
      currentCol++;
    }
  }
}
// east
else if (direction === 3) {
  console.log(`direction: ${direction} - east;`);
  if (enoughSq(direction)) {
    let currentCol = startingCol;
    for (i = 0; i < wordSpread.length; i++) {
      charFill(startingRow, currentCol, wordSpread[i]);
      currentCol++;
    }
  }
}
// south east
else if (direction === 4) {
  console.log(`direction: ${direction} - south east;`);
  if (enoughSq(direction)) {
    let currentRow = startingRow;
    let currentCol = startingCol;
    for (i = 0; i < wordSpread.length; i++) {
      charFill(currentRow, currentCol, wordSpread[i]);
      currentRow++;
      currentCol++;
    }
  }
  
}
// south
else if (direction === 5) {
  console.log(`direction: ${direction} - south;`);
  if (enoughSq(direction)) {
    let currentRow = startingRow;
    for (i = 0; i < wordSpread.length; i++) {
      charFill(currentRow, startingCol, wordSpread[i]);
      currentRow++;
    }
  }
}
// south west
else if (direction === 6) {
  console.log(`direction: ${direction} - south west;`);
  if (enoughSq(direction)) {
    let currentRow = startingRow;
    let currentCol = startingCol;
    for (i = 0; i < wordSpread.length; i++) {
      charFill(currentRow, currentCol, wordSpread[i]);
      currentRow++;
      currentCol--;
    }
  }
}
// west
else if (direction === 7) {
  console.log(`direction: ${direction} - west;`);
  if (enoughSq(direction)) {
    let currentCol = startingCol;
    for (i = 0; i < wordSpread.length; i++) {
      charFill(startingRow, currentCol, wordSpread[i]);
      currentCol--;
    }
  }
}
// north west
else if (direction === 8) {
  console.log(`direction: ${direction} - north west;`);
  if (enoughSq(direction)) {
    let currentRow = startingRow;
    let currentCol = startingCol;
    for (i = 0; i < wordSpread.length; i++) {
      charFill(currentRow, currentCol, wordSpread[i]);
      currentRow--;
      currentCol--;
    }
  }
}
else {console.log(`No direction found`);}

// FUNCTION to calculate whether there is enough square in the calcuated direction
function enoughSq(direction) {
  let topRowReach = startingRow - (wordSpread.length - 1);
  let bottomRowReach = startingRow + (wordSpread.length - 1);
  let leftColReach = startingCol - (wordSpread.length - 1);
  let rightColReach = startingCol + (wordSpread.length - 1);
  console.log("topRowReach:", topRowReach, ", bottomRowReach:", bottomRowReach, ",leftColReach:", leftColReach, ",rightColReach:", rightColReach);

  // 1 = north,
  if (direction === 1) {
    // ရောက်သွားနိုင်တဲ့ top row number က ရှိတဲ့ အကွက် အရေအတွက်ထက် နည်းနေပြီဆိုရင် return false
    console.log("Inside enoughSq(1)");
    console.log("enoughSq: ",topRowReach < 0 ? false : true);
    return topRowReach <= 0 ? false : true;
  }

  //2 = north east
  else if (direction === 2) {
    // ရောက်သွားနိုင်တဲ့ top row number နဲ့ right col no. ကိုတွက်
    if (topRowReach >= 0) {
      if (rightColReach <= noOfSqs) {
        console.log("enoughSq: true");
        return true;
      }
    }
    console.log("enoughSq: false");
    return false;
  }

  // 3 = east
  else if (direction === 3) {
    // ရောက်သွားနိုင်တဲ့ right column number က ရှိတဲ့ အကွက် အရေအတွက်ထက် များနေပြီဆိုရင် return false
    console.log("enoughSq: ",rightColReach > noOfSqs ? false : true);
    return rightColReach >= noOfSqs ? false : true;
  }

  // 4 = south east
  else if (direction === 4) {
    // ရောက်သွားနိုင်တဲ့ bottom row number နဲ့ right col no. ကိုတွက်
    if (bottomRowReach <= noOfSqs) {
      if (rightColReach <= noOfSqs) {
        console.log("enoughSq: true");
        return true;
      }
    }
    console.log("enoughSq: false");
    return false;
  }

  // 5 = south
  else if (direction === 5) {
    // ရောက်သွားနိုင်တဲ့ bottom row number က ရှိတဲ့ အကွက် အရေအတွက်ထက် များနေပြီဆိုရင် return false
    console.log("enoughSq: ",bottomRowReach > noOfSqs ? false : true);
    return bottomRowReach >= noOfSqs ? false : true;
  }

  // 6 = south west
  else if (direction === 6) {
    if (bottomRowReach <= noOfSqs) {
      if (leftColReach >= 0) {
        console.log("enoughSq: true");
        return true;
      }
    }
    console.log("enoughSq: false");
    return false;
  }
  
  // 7 = west
  else if (direction === 7) {
    console.log("enoughSq: ",leftColReach < 0 ? false : true);
    return leftColReach < 0 ? false : true;
  }

  //8 = north west
  else if (direction === 8) {
    if (topRowReach >= 0) {
      if (leftColReach >= 0) {
        console.log("enoughSq: true");
        return true;
      }
    }
    console.log("enoughSq: false");
    return false;
  }
}

// to fill the square with a character
function charFill(row, col, fillChar) {
  let currentSq = document.querySelector(`#sq-${row}-${col}`);
  currentSq.textContent = fillChar;

  filledWords[`sq-${row}-${col}`] = fillChar;
  console.log("filledWords: ", filledWords);
}