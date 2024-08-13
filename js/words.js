let words = ["words", "search", "untracked", "nothing", "present"];
let filledWords = {};

let currentWord = words[random(0, words.length-1)];
let wordSpread = [...currentWord];
//numOfChar = wordSpread.length;
console.log(`no. of character: ${wordSpread.length}`);

// finding starting positon
// noOfSqs is from 'main.js'
let startingRow = random(1, noOfSqs);
let startingCol = random(1, noOfSqs);
console.log("Starting row-col: ", startingRow,"-", startingCol);

direction = 1;
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
else if (direction === 3) {console.log(`direction: ${direction} - east;`);}
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

// function to calculate whether there is enough square in the calcuated direction
function enoughSq(direction) {
  if (direction === 1) {
    console.log(`direction: ${direction} - north`);
    // ရောက်သွားနိုင်တဲ့ row number ကို တွက်ပါတယ်။
    let rowReach = startingRow - wordSpread.length - 1;
    console.log("rowReach: ", rowReach);

    // ရောက်သွားနိုင်တဲ့ row number က ရှိတဲ့ အကွက် အရေအတွက်ထက် နည်းနေပြီဆိုရင်
    if (rowReach < 0) {
      console.log("no of sqs is not enough");
      return false;
    } else {
      console.log("good to go");
      return true;
    }
  }

  else if (direction === 5) {
    console.log(`direction: ${direction} - south;`);
    let rowReach = startingRow + wordSpread.length-1;
    console.log("rowReach: ", rowReach);

    // ရောက်သွားနိုင်တဲ့ row number က ရှိတဲ့ အကွက် အရေအတွက်ထက် များနေပြီဆိုရင်
    if(rowReach > noOfSqs) {
      console.log("no of sqs is not enough");
      return false;
    } else {
      console.log("good to go");
      return true;
    }
  }
}

// to fill the square with a character
function charFill(row, col, fillChar) {
  //console.log("Function 'charFill()' is called.");
  let currentSq = document.querySelector(`#sq-${row}-${col}`);
  currentSq.textContent = fillChar;

  filledWords[`sq-${row}-${col}`] = fillChar;
  console.log("filledWords: ", filledWords);
}