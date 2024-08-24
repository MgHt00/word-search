/*
  Functions
  -------
  findAndFill() - direction ကို random ထုတ် ၊ sq လောက်သလား စစ်ပြီး ၊ နေရာ မတွေ့မချင်း ရှာဖြည့်မယ်
    |- enoughSq(), existingCharCheck(), fillAWord(), listAWord()
  fillAWord() - ရလာတဲ့ direction အတိုင်း tempHolder ထဲက စာလုံးတွေဖြည့်မယ်
    |- enoughSq(), charFill()
  enoughSq() - ရလာတဲ့ direction မှာ sq လောက်သလားစစ်မယ်
  charFill() - sq တစ်ကွက်ချင်းကို char တစ်လုံးချင်း ဖြည့်မယ် ၊ staring sq နဲ့ ending sq နာမည်တွေကို startAndEnd[] ထဲ သိမ်းမယ်။
  existingCharCheck() - လက်ရှိအကွက်မှာ char ရှိနေရင် သုံးလို့ ရ ၊ မရ စစ်မယ်
    |- oneByOneCheck()
  oneByOneCheck() - sq အကွက်မှာဖြည့်မယ့် char နဲ့ object ထဲထည့်ထားပြီးတဲ့ char တူလား တစ်လုံးချင်းစစ်မယ်
  listAWord() - HTML မှာ word တွေ list လုပ်ဖို့ 
  processChar() - saveIT သတ်မှတ်မယ်။ charFill() ကို ပြန်ခေါ်မယ်
     |- charFill()
*/

let wordList = ["delete", "suppress", "untracked", "nothing", "present", "branch", "background", "fetched", "comments", "console", "insertion", "deletion"];
let wordListCopy = [...wordList];
let noOfWordsToDisplay = 10;

let filledWords = {}; // ဖြည့်ထားတဲ့ words တွေရဲ့ char တစ်လုံးချင်းစီနဲ့ အကွက် no. နဲ့ တွဲသိမ်းဖို့ 
let startAndEnd = []; // word တစ်ခုချင်းရဲ့ အစ ၊ အဆုံး sq နံပါတ်တွေ မှတ်ဖို့
let startAndEndIndex = 0;
let startOrEnd = "start";
let startingRow, startingCol;
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
    //console.log("START LOOP NO. :", i);
    //console.log("currentWord: ", currentWord);

    // finding starting positon -- noOfSqs is fetched from 'main.js'
    startingRow = random(1, noOfSqs);
    startingCol = random(1, noOfSqs);
    //console.log("Starting row-col: ", startingRow, "-", startingCol);
    
    if (findAndFill(currentWord)) {
      // findAndFill အောင်မြင်ခဲ့ရင် စာလုံးကို array ထဲကနေ ဖျက်ထုတ်မယ်။ 
      wordListCopy.splice(arrayIndex, 1);
      leftToDisplay--;
      //console.log("findAndFill() success: ",wordListCopy);
      //console.log("FindAndFill() success; wordListCopy.length: ", wordListCopy.length);
    }    
  }
  
  // grid (sq) ထဲရောက်နေတဲ့ စာလုံးအရေအတွက်က ပြချင်တဲ့ အရေအတွက် `noOfWordsToDisplay` ကို မရောက်သေးရင် start() ကိုပြန် run မယ်။
  if (leftToDisplay > 0) {
    //console.log("____________");
    //console.log("leftToDisplay: ", leftToDisplay);
    //console.log("wordListCopy.length: ", wordListCopy.length);
    //console.log("EXECUTED: start(wordListCopy, leftToDisplay);");

    setTimeout(() => { // check sn1.MD for studying purpose
        start(wordListCopy, leftToDisplay);
    }, 0);
  }
  
  console.log("START() COMPLELTED!");
}

function findAndFill(currentWord) {
  // () direction ကို random ထုတ် ၊ sq လောက်သလား စစ်ပြီး ၊ နေရာ မတွေ့မချင်း ရှာဖြည့်မယ်

  let wordSpread = [...currentWord];
  //console.log(`no. of character: ${wordSpread.length}`);
  let direction = random(1, 8);
  let attempts = 0;
  let maxAttempts = 30;
  let status = 0; // 0 = fail, 1 = success

  while (attempts < maxAttempts) {
    attempts++;
    // creates an infinite loop, which means the code inside the loop will keep running 
    // over and over again until something inside the loop causes it to stop.

    // direction သိရရင် sq လောက်လားစစ်မယ် 
    if (enoughSq(direction, wordSpread)) {
      //console.log("Successfully found a spot");
      // sq လုံလောက်သော်လည်း sq တွေမှာ char ရှိနေလား ၊ ရှိတဲ့ char က သုံးလို့ရလား (Check if the characters in the squares are compatible with the word)
      if (existingCharCheck(direction, wordSpread)) {
        fillAWord(direction, tempHolder);
        listAWord(currentWord);
        status = 1;
        break;
      } else {
        // existingCharCheck() စစ်လို့ ရှိပြီးသား char နဲ့ မတူရင် row, col အသစ်ပြန်ထုတ်ပြီး ပြန် loop (If not, re-randomize the starting row and column, and try again)
        //console.log("Existing char check failed, retrying with another random row-col ...");
        startingRow = random(1, noOfSqs);
        startingCol = random(1, noOfSqs);
        //console.log("New row-col: ", startingRow, "-", startingCol);
      }
    } else {
      // sq မလောက်တဲ့အခါ row-col အသစ် ပြန် random လုပ်ပြီး ပြန် loop (If not enough squares in the current direction, re-randomize the starting row and column, and try again)
      //console.log("Failed, retrying with another randon row-col ...");
      startingRow = random(1, noOfSqs);
      startingCol = random(1, noOfSqs);
      //console.log("New row-col: ", startingRow, "-", startingCol);
    }
  }

  if (attempts === maxAttempts) {
    console.log("!!! maxAttempt reached !!!");
  }

  return status;
}

function fillAWord(direction, tempHolder) {
// () ရလာတဲ့ direction အတိုင်း tempHolder ထဲက စာလုံးတွေဖြည့်မယ်

  let success = false;
  // north
  if (direction === 1) {
    //console.log(`direction: ${direction} - north`);
    let currentRow = startingRow;
    for (i = 0; i < tempHolder.length; i++) {
      processChar(currentRow, startingCol, tempHolder[i], i);
      currentRow--;
    }
    return success = true;
  }
  // north east
  else if (direction === 2) {
    //console.log(`direction: ${direction} - north east;`);
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
    //console.log(`direction: ${direction} - east;`);
    let currentCol = startingCol;
    for (i = 0; i < tempHolder.length; i++) {
      processChar(startingRow, currentCol, tempHolder[i], i);
      currentCol++;
    }
    return success = true;
  }
  // south east
  else if (direction === 4) {
    //console.log(`direction: ${direction} - south east;`);
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
    //console.log(`direction: ${direction} - south;`);
    let currentRow = startingRow;
    for (i = 0; i < tempHolder.length; i++) {
      processChar(currentRow, startingCol, tempHolder[i], i);
      currentRow++;
    }
    return success = true;
  }
  // south west
  else if (direction === 6) {
    //console.log(`direction: ${direction} - south west;`);
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
    //console.log(`direction: ${direction} - west;`);
    let currentCol = startingCol;
    for (i = 0; i < tempHolder.length; i++) {
      processChar(startingRow, currentCol, tempHolder[i], i);
      currentCol--;
    }
    return success = true;
  }
  // north west
  else if (direction === 8) {
    //console.log(`direction: ${direction} - north west;`);
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

  let topRowReach = startingRow - (wordSpread.length - 1);
  let bottomRowReach = startingRow + (wordSpread.length - 1);
  let leftColReach = startingCol - (wordSpread.length - 1);
  let rightColReach = startingCol + (wordSpread.length - 1);
  //console.log("topRowReach:", topRowReach, ", bottomRowReach:", bottomRowReach, ",leftColReach:", leftColReach, ",rightColReach:", rightColReach);

  // 1 = north,
  if (direction === 1) {
    // ရောက်သွားနိုင်တဲ့ top row number က ရှိတဲ့ အကွက် အရေအတွက်ထက် နည်းနေပြီဆိုရင် return false
    //console.log("enoughSq: ",topRowReach <= 0 ? false : true);
    return topRowReach <= 0 ? false : true;
  }

  //2 = north east
  else if (direction === 2) {
    // ရောက်သွားနိုင်တဲ့ top row number နဲ့ right col no. ကိုတွက်
    if (topRowReach > 0) {
      if (rightColReach <= noOfSqs) {
        //console.log("enoughSq: true");
        return true;
      }
    }
    //console.log("enoughSq: false");
    return false;
  }

  // 3 = east
  else if (direction === 3) {
    // ရောက်သွားနိုင်တဲ့ right column number က ရှိတဲ့ အကွက် အရေအတွက်ထက် များနေပြီဆိုရင် return false
    //console.log("enoughSq: ",rightColReach > noOfSqs ? false : true);
    return rightColReach > noOfSqs ? false : true;
  }

  // 4 = south east
  else if (direction === 4) {
    // ရောက်သွားနိုင်တဲ့ bottom row number နဲ့ right col no. ကိုတွက်
    if (bottomRowReach <= noOfSqs) {
      if (rightColReach <= noOfSqs) {
        //console.log("enoughSq: true");
        return true;
      }
    }
    //console.log("enoughSq: false");
    return false;
  }

  // 5 = south
  else if (direction === 5) {
    // ရောက်သွားနိုင်တဲ့ bottom row number က ရှိတဲ့ အကွက် အရေအတွက်ထက် များနေပြီဆိုရင် return false
    //console.log("enoughSq: ",bottomRowReach > noOfSqs ? false : true);
    return bottomRowReach > noOfSqs ? false : true;
  }

  // 6 = south west
  else if (direction === 6) {
    if (bottomRowReach <= noOfSqs) {
      if (leftColReach > 0) {
        //console.log("enoughSq: true");
        return true;
      }
    }
    console.log("enoughSq: false");
    return false;
  }
  
  // 7 = west
  else if (direction === 7) {
    //console.log("enoughSq: ",leftColReach <= 0 ? false : true);
    return leftColReach <= 0 ? false : true;
  }

  //8 = north west
  else if (direction === 8) {
    if (topRowReach > 0) {
      if (leftColReach > 0) {
        //console.log("enoughSq: true");
        return true;
      }
    }
    //console.log("enoughSq: false");
    return false;
  }
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

start(wordListCopy, noOfWordsToDisplay);