let words = ["words", "search", "untracked", "nothing", "present"];
let filledWords = {};
let currentWord, wordSpread, startingRow, startingCol;

let TEMPsq1 = document.querySelector("#sq-6-6");
filledWords["sq-6-6"] = "e";

function start()
{
  /*
  for (let i = 0; i < words.length; i++) {
    
  }
  */
  //TEMP1. currentWord = words[random(0, words.length-1)];
  currentWord = ["w","o","r","d","s"];
  wordSpread = [...currentWord];
  console.log(`no. of character: ${wordSpread.length}`);

  // finding starting positon
  // noOfSqs is fetched from 'main.js'
  //TEMP2. startingRow = random(1, noOfSqs);
  startingRow = 6;
  //TEMP3. startingCol = random(1, noOfSqs);
  startingCol = 3
  console.log("Starting row-col: ", startingRow,"-", startingCol);

  FindAndFill();
}


function FindAndFill() {
  while (true) {
    // creates an infinite loop, which means the code inside the loop will keep running 
    // over and over again until something inside the loop causes it to stop.
    //TEMP4 let direction = random(1, 8);
    direction = 3;
    if (fillAWord(direction)) {
      console.log("Success");
      break; // Exit loop on success
    } else {
      console.log("Failed, retrying...");
    }
  }
}

function fillAWord(direction) {
  let success = false;
  // 1 = north, 2 = north east, 3 = east, 4 = south east, 
  // 5 = south, 6 = south west, 7 = west, 8 = north west
  if (direction === 1) {
    console.log(`direction: ${direction} - north`);
    if (enoughSq(direction)) {
      let currentRow = startingRow;
      for (i = 0; i < wordSpread.length; i++) {
        charFill(currentRow, startingCol, wordSpread[i]);
        currentRow--;
      }
      return success = true;
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
      return success = true;
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
      return success = true;
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
      return success = true;
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
      return success = true;
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
      return success = true;
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
      return success = true;
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
      return success = true;
    }
  }
  else {
    console.log(`No direction found`);
  }
  return success;
}


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
    console.log("enoughSq: ",topRowReach <= 0 ? false : true);
    return topRowReach <= 0 ? false : true;
  }

  //2 = north east
  else if (direction === 2) {
    // ရောက်သွားနိုင်တဲ့ top row number နဲ့ right col no. ကိုတွက်
    if (topRowReach > 0) {
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
    return rightColReach > noOfSqs ? false : true;
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
    return bottomRowReach > noOfSqs ? false : true;
  }

  // 6 = south west
  else if (direction === 6) {
    if (bottomRowReach <= noOfSqs) {
      if (leftColReach > 0) {
        console.log("enoughSq: true");
        return true;
      }
    }
    console.log("enoughSq: false");
    return false;
  }
  
  // 7 = west
  else if (direction === 7) {
    console.log("enoughSq: ",leftColReach <= 0 ? false : true);
    return leftColReach <= 0 ? false : true;
  }

  //8 = north west
  else if (direction === 8) {
    if (topRowReach > 0) {
      if (leftColReach > 0) {
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
  let currentSq = `sq-${row}-${col}`;
  let currentDOM = document.querySelector(`#${currentSq}`);

  if (exitingCharCheck(currentSq, fillChar)) {
    currentDOM.textContent = fillChar;
    filledWords[currentSq] = fillChar;
    console.log("filledWords: ", filledWords);
  }
}
 
function exitingCharCheck(currentSq, fillChar) {
  if (!filledWords[currentSq]) {
    console.log("No char in the sq. Good to go!");
    return true;
  } 
  else if (filledWords[currentSq] === fillChar) {
    console.log("Existing char in sq is same as incoming. Good to go!");
    return true;
  } 
  else {
    console.log("Existing char in sq is NOT same as incoming. FAIL.");
    return false;
  }
}

start();