/* check le1.MD for functions and structures */

let wordList = ["delete", "suppress", "untracked", "nothing", "present", "branch", "background", "fetched", "comments", "console", "insertion", "deletion"];
let wordListCopy = [...wordList];
let noOfWordsToDisplay = 10;

let filledWords = {}; // ဖြည့်ထားတဲ့ words တွေရဲ့ char တစ်လုံးချင်းစီနဲ့ အကွက် no. နဲ့ တွဲသိမ်းဖို့ 
let startAndEnd = []; // word တစ်ခုချင်းရဲ့ အစ ၊ အဆုံး sq နံပါတ်တွေ မှတ်ဖို့
let startAndEndIndex = 0;
let startOrEnd = "start";
let startingRow, startingCol;
let maxRow = noOfSqs;
let maxCol = noOfSqs;
let tempHolder = [];

let sectionWordList = document.querySelector("#section-word-list");

function start(wordListCopy, noOfWordsToDisplay)
{
  let leftToDisplay = noOfWordsToDisplay;
  console.log("No of times to loop in total: ", noOfWordsToDisplay);
  for (let i = 0; i < noOfWordsToDisplay; i++) {
    let arrayIndex = random(0, (wordListCopy.length-1));
    let currentWord = wordListCopy[arrayIndex];
    console.log("______start() starts______");

    // finding starting positon -- noOfSqs is fetched from 'main.js'
    startingRow = random(1, noOfSqs);
    startingCol = random(1, noOfSqs);

    if (findAndFill(currentWord)) {
      // findAndFill အောင်မြင်ခဲ့ရင် စာလုံးကို array ထဲကနေ ဖျက်ထုတ်မယ်။ 
      wordListCopy.splice(arrayIndex, 1);
      leftToDisplay--;
    }    
  }
  
  // grid (sq) ထဲရောက်နေတဲ့ စာလုံးအရေအတွက်က ပြချင်တဲ့ အရေအတွက် `noOfWordsToDisplay` ကို မရောက်သေးရင် start() ကိုပြန် run မယ်။
  if (leftToDisplay > 0) {
    setTimeout(() => { // check sn1.MD for studying purpose
        start(wordListCopy, leftToDisplay);
    }, 0);
  }
}

function findAndFill(currentWord) {
  // () direction ကို random ထုတ် ၊ sq လောက်သလား စစ်ပြီး ၊ နေရာ မတွေ့မချင်း ရှာဖြည့်မယ်

  let wordSpread = [...currentWord];
  let attempts = 0;
  let maxAttempts = 30;
  let status = 0; // 0 = fail, 1 = success

  while (attempts < maxAttempts) {
    attempts++;
    let direction = getRandomDirection();

    if(attemptPlacement(direction, wordSpread)) {
      listAWord(currentWord);
      status = 1;
      break;
    } else {
      // existingCharCheck() စစ်လို့ ရှိပြီးသား char နဲ့ မတူရင် row, col အသစ်ပြန်ထုတ်ပြီး ပြန် loop (If not, re-randomize the starting row and column, and try again)
      chooseNewPosition()
    }
  }
  handleMaxAttempts(attempts, maxAttempts);
  return status;
}

function fillAWord(direction, tempHolder) {
// () ရလာတဲ့ direction အတိုင်း tempHolder ထဲက စာလုံးတွေဖြည့်မယ်

  let success = false;
  // north
  if (direction === 1) {
    let currentRow = startingRow;
    for (i = 0; i < tempHolder.length; i++) {
      processChar(currentRow, startingCol, tempHolder[i], i);
      currentRow--;
    }
    return success = true;
  }
  // north east
  else if (direction === 2) {
    let currentRow = startingRow;
    let currentCol = startingCol;
    for (i = 0; i < tempHolder.length; i++) {
      processChar(currentRow, currentCol, tempHolder[i], i);
      currentRow--;
      currentCol++;
    }
    return success = true;
  }
  // east
  else if (direction === 3) {
    let currentCol = startingCol;
    for (i = 0; i < tempHolder.length; i++) {
      processChar(startingRow, currentCol, tempHolder[i], i);
      currentCol++;
    }
    return success = true;
  }
  // south east
  else if (direction === 4) {
    let currentRow = startingRow;
    let currentCol = startingCol;
    for (i = 0; i < tempHolder.length; i++) {
      processChar(currentRow, currentCol, tempHolder[i], i);
      currentRow++;
      currentCol++;
    }
    return success = true;
  }
  // south
  else if (direction === 5) {
    let currentRow = startingRow;
    for (i = 0; i < tempHolder.length; i++) {
      processChar(currentRow, startingCol, tempHolder[i], i);
      currentRow++;
    }
    return success = true;
  }
  // south west
  else if (direction === 6) {
    let currentRow = startingRow;
    let currentCol = startingCol;
    for (i = 0; i < tempHolder.length; i++) {
      processChar(currentRow, currentCol, tempHolder[i], i);
      currentRow++;
      currentCol--;
    }
    return success = true;
  }
  // west
  else if (direction === 7) {
    let currentCol = startingCol;
    for (i = 0; i < tempHolder.length; i++) {
      processChar(startingRow, currentCol, tempHolder[i], i);
      currentCol--;
    }
    return success = true;
  }
  // north west
  else if (direction === 8) {
    let currentRow = startingRow;
    let currentCol = startingCol;
    for (i = 0; i < tempHolder.length; i++) {
      processChar(currentRow, currentCol, tempHolder[i], i);
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

function enoughSq(direction, wordSpread) {
  // () to check whether there is enough square in the calcuated direction

  let rightStatus = checkRight(wordSpread, startingRow, startingCol);
  let leftStatus = checkLeft(wordSpread, startingRow, startingCol);
  let topStatus = checkTop(wordSpread, startingRow, startingCol);
  let belowStatus = checkBelow(wordSpread, startingRow, startingCol);
  
  if (direction === 1) return topStatus; // 1 = north, ရောက်သွားနိုင်တဲ့ top row number ကိုစစ်
  else if (direction === 2) return (topStatus && rightStatus); //2 = north east
  else if (direction === 3) return rightStatus; // 3 = east
  else if (direction === 4) return (belowStatus && rightStatus); // 4 = south east
  else if (direction === 5) return belowStatus; // 5 = south
  else if (direction === 6) return (belowStatus && leftStatus); // 6 = south west
  else if (direction === 7) return leftStatus; // 7 = west
  else if (direction === 8) return (topStatus && leftStatus); //8 = north west
}

function charFill(row, col, fillChar, saveIt) {
  // () to fill the square with incoming character

  let currentSq = `sq-${row}-${col}`;
  let currentDOM = document.querySelector(`#${currentSq}`);
  //console.log("currentSq", currentSq);
    
  currentDOM.textContent = fillChar; // display on screen
  filledWords[currentSq] = fillChar; // input -> object

  if (saveIt) {
    if (startOrEnd === "start") {
      // Initialize the object if it's the start of a new entry
      startAndEnd[startAndEndIndex] = {};
      startAndEnd[startAndEndIndex]["start"] = currentSq;
      startOrEnd = "end";
    }
    else if(startOrEnd === "end") {
      startAndEnd[startAndEndIndex]["end"] = currentSq;
      startOrEnd = "start";
      startAndEndIndex++;
    }
    //console.log("startAndEndIndex: ", startAndEndIndex);
    //console.log("startAndEnd[]: ", startAndEnd);
  }
}

function existingCharCheck(direction, wordSpread) {
  // () လက်ရှိအကွက်မှာ char ရှိနေရင် သုံးလို့ ရ ၊ မရ စစ်

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
    return true; 
  }
}

function oneByOneCheck(currentSq, char) {
  // () sq အကွက်မှာဖြည့်မယ့် char နဲ့ object ထဲထည့်ထားပြီးတဲ့ char တူလား တစ်လုံးချင်းစစ်

  if (!filledWords[currentSq]) {
    //console.log("No char in the sq. Good to go!");
    tempHolder[i] =  char;
    return true;
  }
  else if (filledWords[currentSq] === char) {
    //console.log("Existing char in sq is same as incoming. Good to go!");
    tempHolder[i] =  char;
    return true;
  } 
  else {
    //console.log("Existing char in sq is NOT same as incoming. FAIL.");
    return false;
  }
}

function listAWord(incoming) {
  // function to list the words underneath the square frame

  let ulElement = document.createElement("ul");
  let liElement = document.createElement("li");
  
  liElement.textContent = incoming;
  ulElement.appendChild(liElement);
  sectionWordList.appendChild(ulElement);
}

function processChar(row, col, char, index) {
  // check starting and ending index, set saveIt, and calls charFill(),

  let saveIt = (index === 0 || index === tempHolder.length -1); // check sn2.MD ( saveIt = (i === 0 || i === tempHolder.length - 1) ? true : false;)
  charFill(row, col, char, saveIt);
  return saveIt;
}

function checkRight(word, row, col) {
  // check le2.MD for the logic behind the adjustments
  if (!isWithinBounds(row, col + (word.length - 1))) return false;
  return true;  // Explicitly return true if the word fits within the boundary
}

function checkLeft(word, row, col) {
  if (!isWithinBounds(row, col - (word.length - 1))) return false;
  return true;
}

function checkTop(word, row, col) {
  if (!(isWithinBounds(row - (word.length - 1), col))) return false;
  return true;
}

function checkBelow(word, row, col) {
  if (!(isWithinBounds(row + word.length - 1, col))) return false;
  return true;
}

function isWithinBounds(row, col) {
  // Boundary check function
  return row > 0 && row <= maxRow && col >0 && col <= maxCol;
}

function getRandomDirection() {
  return random(1, 8);
}

function attemptPlacement(direction, wordSpread) {
  if(enoughSq(direction, wordSpread) && existingCharCheck(direction, wordSpread)) {
    // sq လုံလောက်သော်လည်း sq တွေမှာ char ရှိနေလား ၊ ရှိတဲ့ char က သုံးလို့ရလား (Check if the characters in the squares are compatible with the word)
    fillAWord(direction, tempHolder);
    return true; // Placement successful
  }
  return false;
}

function chooseNewPosition() {
  startingRow = random(1, noOfSqs);
  startingCol = random(1, noOfSqs);
}

function handleMaxAttempts(attempts, maxAttempts) {
  if (attempts === maxAttempts) {
    console.log("!!! maxAttempt reached !!!");
  }
}

start(wordListCopy, noOfWordsToDisplay);