/*
  Functions
  -------
  findAndFill() - direction ကို random ထုတ် ၊ sq လောက်သလား စစ်ပြီး ၊ နေရာ မတွေ့မချင်း ရှာဖြည့်မယ်
    |- enoughSq(), existingCharCheck(), fillAWord()
  fillAWord() - ရလာတဲ့ direction အတိုင်း tempHolder ထဲက စာလုံးတွေဖြည့်မယ်
    |- enoughSq(), charFill()
  enoughSq() - ရလာတဲ့ direction မှာ sq လောက်သလားစစ်မယ်
  charFill() - sq တစ်ကွက်ချင်းကို char တစ်လုံးချင်း ဖြည့်မယ်
  existingCharCheck() - လက်ရှိအကွက်မှာ char ရှိနေရင် သုံးလို့ ရ ၊ မရ စစ်မယ်
    |- oneByOneCheck()
  oneByOneCheck() - sq အကွက်မှာဖြည့်မယ့် char နဲ့ object ထဲထည့်ထားပြီးတဲ့ char တူလား တစ်လုံးချင်းစစ်မယ်
*/

let words = ["words", "search", "untracked", "nothing", "present"];
let filledWords = {};
let currentWord, wordSpread, startingRow, startingCol;
let tempHolder = [];

/* DEBUGGING
let TEMPsq0 = document.querySelector("#sq-6-10");
let TEMPsq1 = document.querySelector("#sq-3-7");
filledWords["sq-6-10"] = "w"
filledWords["sq-3-7"] = "d";
TEMPsq0.textContent = filledWords["sq-6-10"];
TEMPsq1.textContent = filledWords["sq-3-7"];
*/

function start()
{
  for (let i = 0; i < words.length; i++) {
    //currentWord = words[random(0, words.length-1)];
    currentWord = words[i];
    console.log("____________");
    console.log("start no. ", i);
    console.log("currentWord: ", currentWord);
    //currentWord = ["a","p","p","l","e"];
    wordSpread = [...currentWord];
    console.log(`no. of character: ${wordSpread.length}`);

    // finding starting positon -- noOfSqs is fetched from 'main.js'
    startingRow = random(1, noOfSqs);
    //TEMP2. startingRow = 6;
    startingCol = random(1, noOfSqs);
    //TEMP3. startingCol = 6;
    console.log("Starting row-col: ", startingRow, "-", startingCol);
    
    findAndFill();
  }
}

// () direction ကို random ထုတ် ၊ sq လောက်သလား စစ်ပြီး ၊ နေရာ မတွေ့မချင်း ရှာဖြည့်မယ်
function findAndFill() {
  let direction = random(1, 8);
  //TEMP4 direction = 8;

  while (true) {
    // creates an infinite loop, which means the code inside the loop will keep running 
    // over and over again until something inside the loop causes it to stop.
    if (enoughSq(direction)) {
      // direction ကိုသိရလို့ sq လုံလောက်ရင်
      console.log("Successfully found a spot");
      // sq လုံလောက်သော်လည်း sq တွေမှာ char ရှိနေလား ၊ ရှိတဲ့ char က သုံးလို့ရလား
      if (existingCharCheck(direction, wordSpread)) {
        // ရတယ် ဆိုရင် fill မယ်။
        fillAWord(direction, tempHolder);
      }
      break;
    } else {
      // sq မလောက်တဲ့အခါ row-col အသစ် ပြန် random လုပ်ပြီး ပြန် loop
      console.log("Failed, retrying with another randon row-col ...");
      startingRow = random(1, noOfSqs);
      startingCol = random(1, noOfSqs);
      console.log("New row-col: ", startingRow, "-", startingCol);
      /*
      console.log("FAILED. Not enough sqs. BREAK from loop.");
      //console.log("currentWord: ", currentWord);
      //console.log("_________");
      break;
      */
    }
  }
}

// () ရလာတဲ့ direction အတိုင်း tempHolder ထဲက စာလုံးတွေဖြည့်မယ်
function fillAWord(direction, tempHolder) {
  let success = false;
  // 1 = north, 2 = north east, 3 = east, 4 = south east, 
  // 5 = south, 6 = south west, 7 = west, 8 = north west
  if (direction === 1) {
    console.log(`direction: ${direction} - north`);
    let currentRow = startingRow;
    for (i = 0; i < tempHolder.length; i++) {
      charFill(currentRow, startingCol, tempHolder[i]);
      currentRow--;
    }
    return success = true;
  }
  // north east
  else if (direction === 2) {
    console.log(`direction: ${direction} - north east;`);
    let currentRow = startingRow;
    let currentCol = startingCol;
    for (i = 0; i < tempHolder.length; i++) {
      charFill(currentRow, currentCol, tempHolder[i]);
      currentRow--;
      currentCol++;
    }
    return success = true;
  }
  // east
  else if (direction === 3) {
    console.log(`direction: ${direction} - east;`);
    let currentCol = startingCol;
    for (i = 0; i < tempHolder.length; i++) {
      charFill(startingRow, currentCol, tempHolder[i]);
      currentCol++;
    }
    return success = true;
  }
  // south east
  else if (direction === 4) {
    console.log(`direction: ${direction} - south east;`);
    let currentRow = startingRow;
    let currentCol = startingCol;
    for (i = 0; i < tempHolder.length; i++) {
      charFill(currentRow, currentCol, tempHolder[i]);
      currentRow++;
      currentCol++;
    }
    return success = true;
  }
  // south
  else if (direction === 5) {
    console.log(`direction: ${direction} - south;`);
    let currentRow = startingRow;
    for (i = 0; i < tempHolder.length; i++) {
      charFill(currentRow, startingCol, tempHolder[i]);
      currentRow++;
    }
    return success = true;
  }
  // south west
  else if (direction === 6) {
    console.log(`direction: ${direction} - south west;`);
    let currentRow = startingRow;
    let currentCol = startingCol;
    for (i = 0; i < tempHolder.length; i++) {
      charFill(currentRow, currentCol, tempHolder[i]);
      currentRow++;
      currentCol--;
    }
    return success = true;
  }
  // west
  else if (direction === 7) {
    console.log(`direction: ${direction} - west;`);
    let currentCol = startingCol;
    for (i = 0; i < tempHolder.length; i++) {
      charFill(startingRow, currentCol, tempHolder[i]);
      currentCol--;
    }
    return success = true;
  }
  // north west
  else if (direction === 8) {
    console.log(`direction: ${direction} - north west;`);
    let currentRow = startingRow;
    let currentCol = startingCol;
    for (i = 0; i < tempHolder.length; i++) {
      charFill(currentRow, currentCol, tempHolder[i]);
      currentRow--;
      currentCol--;
    }
    return success = true;
  }
  else {
    console.log(`No direction found`);
  }
  return success;
}


// () to check whether there is enough square in the calcuated direction
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

// () to fill the square with "a" character
function charFill(row, col, fillChar) {
  let currentSq = `sq-${row}-${col}`;
  let currentDOM = document.querySelector(`#${currentSq}`);

    currentDOM.textContent = fillChar;
    filledWords[currentSq] = fillChar;
    //console.log("filledWords: ", filledWords);
}

// () လက်ရှိအကွက်မှာ char ရှိနေရင် သုံးလို့ ရ ၊ မရ စစ်
function existingCharCheck(direction, wordSpread) {
  tempHolder = [];
  // 1 = north
  if (direction === 1) {
    let currentRow = startingRow;
    for (i = 0; i < wordSpread.length; i++) {
      let currentSq = `sq-${currentRow}-${startingCol}`;
      if(oneByOneCheck(currentSq, wordSpread[i])) {
        currentRow--;
      }
      else return false;
    }
    return true; 
  }
  // 2 = north east
  else if (direction === 2) {
    let currentRow = startingRow;
    let currentCol = startingCol;
    for (i = 0; i < wordSpread.length; i++) {
      let currentSq = `sq-${currentRow}-${currentCol}`;
      if(oneByOneCheck(currentSq, wordSpread[i])) {
        currentRow--;
        currentCol++;
      }
      else return false;
    }
    return true;
  }
  // 3 = east
  else if (direction === 3) {
    let currentCol = startingCol;
    for (i = 0; i < wordSpread.length; i++) {
      let currentSq = `sq-${startingRow}-${currentCol}`;
      if(oneByOneCheck(currentSq, wordSpread[i])) {
        currentCol++;
      }
      else return false;
    }
    return true;
  }
  // 4 = south east
  else if (direction === 4) {
    let currentRow = startingRow;
    let currentCol = startingCol;
    for (i = 0; i < wordSpread.length; i++) {
      let currentSq = `sq-${currentRow}-${currentCol}`;
      if(oneByOneCheck(currentSq, wordSpread[i])) {
        currentRow++;
        currentCol++;
      }
      else return false;
    }
    return true;
  }
  // south
  else if (direction === 5) {
    let currentRow = startingRow;
    for (i = 0; i < wordSpread.length; i++) {
      let currentSq = `sq-${currentRow}-${startingCol}`;
      if (oneByOneCheck(currentSq, wordSpread[i])) {
        currentRow++;
      }
      else return false;
    } 
    return true;
  }
  // south west
  else if (direction === 6) {
    let currentRow = startingRow;
    let currentCol = startingCol;
    for (i = 0; i < wordSpread.length; i++) {
      let currentSq = `sq-${currentRow}-${currentCol}`;
      if (oneByOneCheck(currentSq, wordSpread[i])) {
        currentRow++;
        currentCol--;
      }
      else return false;
    }
    return true;
  }
  // west
  else if (direction === 7) {
    let currentCol = startingCol;
    for (i = 0; i < wordSpread.length; i++) {
      let currentSq = `sq-${startingRow}-${currentCol}`;
      if (oneByOneCheck(currentSq, wordSpread[i])) {
        currentCol--;
      }
      else return false;
    }
    return true;
  }
  // north west
  else if (direction === 8) {
    let currentRow = startingRow;
    let currentCol = startingCol;
    for (i = 0; i < wordSpread.length; i++) {
      let currentSq = `sq-${currentRow}-${currentCol}`;
      if (oneByOneCheck(currentSq, wordSpread[i])) {
        currentRow--;
        currentCol--;       
      }
      else return false;
    }
    return true; // just for debugging
  }
}

// () sq အကွက်မှာဖြည့်မယ့် char နဲ့ object ထဲထည့်ထားပြီးတဲ့ char တူလား တစ်လုံးချင်းစစ်
function oneByOneCheck(currentSq, char) {
  if (!filledWords[currentSq]) {
    //console.log("filledWords[currentSq]: ", filledWords[currentSq]);
    //console.log("wordSpread[i]: ", char);
    console.log("No char in the sq. Good to go!");
    tempHolder[i] =  char;
    //console.log("tempHolder[i]: ", tempHolder[i]);
    return true;
  }
  else if (filledWords[currentSq] === char) {
    //console.log("filledWords[currentSq]: ", filledWords[currentSq]);
    //console.log("wordSpread[i]: ", char);
    console.log("Existing char in sq is same as incoming. Good to go!");
    tempHolder[i] =  char;
    //console.log("tempHolder[i]: ", tempHolder[i]);
    return true;
  } 
  else {
    //console.log("filledWords[currentSq]: ", filledWords[currentSq]);
    //console.log("wordSpread[i]: ", char);
    console.log("Existing char in sq is NOT same as incoming. FAIL.");
    return false;
  }
}

start();