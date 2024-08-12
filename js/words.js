let words = ["words", "search", "untracked", "nothing", "present"];
//let numOfChar = 0;

let currentWord = words[random(0, words.length-1)];
let wordSpread = [...currentWord];
//numOfChar = wordSpread.length;
console.log(`no. of character: ${wordSpread.length}`);

// finding starting positon
let startingRow = random(1, noOfSqs);
let startingCol = random(1, noOfSqs);
console.log("Starting row-col: ", startingRow,"-", startingCol);
/*let startingNumber = `sq-${startingRow}-${startingCol}`;
console.log(`startingNumber: ${startingNumber}`);
let startingSquare = document.querySelector(`#${startingNumber}`);
//console.log("startingSquare:", startingSquare);*/


// finding direction 
/*
let direction = random(1,8);
*/
//temp - fixed direction
direction = 5;
// 1 = north, 2 = north east, 3 = east, 4 = south east, 
// 5 = south, 6 = south west, 7 = west, 8 = north west
// just printing out the direction for debuging purpose
if (direction === 1) {console.log(`direction: ${direction} - north`);}
else if (direction === 2) {console.log(`direction: ${direction} - north east;`);}
else if (direction === 3) {console.log(`direction: ${direction} - east;`);}
else if (direction === 4) {console.log(`direction: ${direction} - south east;`);}
else if (direction === 5) {
  console.log(`direction: ${direction} - south;`);
  // ရောက်သွားနိုင်တဲ့ row number ကို တွက်ပါတယ်။
  let rowReach = startingRow + wordSpread.length-1;
  console.log("rowReach: ", rowReach);

  if(rowReach > noOfSqs) {
    console.log("no of sqs is not enough");
  } else {
    console.log("good to go");
    let tempRow = startingRow;
    for (i = 0; i < wordSpread.length; i++) {
      let startingNumber = `sq-${tempRow}-${startingCol}`;
      let startingSquare = document.querySelector(`#${startingNumber}`);
      startingSquare.textContent = wordSpread[i];
      tempRow++;
    }
  }
}
else if (direction === 6) {console.log(`direction: ${direction} - south west;`);}
else if (direction === 7) {console.log(`direction: ${direction} - west;`);}
else if (direction === 7) {console.log(`direction: ${direction} - north west;`);}
else {console.log(`No direction found`);}