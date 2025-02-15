/*let wordList = ["delete", "suppress", "untracked", "nothing", "present", "branch", "background", "fetched", "comments", "console", "insertion", "deletion"];
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

let sectionWordList = document.querySelector("#section-word-list");*/

const appData = {
  wordList : ["delete", "suppress", "untracked", "nothing", "present", "branch", "background", "fetched", "comments", "console", "insertion", "deletion"],
  //wordListCopy : [...wordList],
  noOfWordsToDisplay : 10,
  noOfSquares: 14,
}

const currentStatus = {
  filledWords : {}, // ဖြည့်ထားတဲ့ words တွေရဲ့ char တစ်လုံးချင်းစီနဲ့ အကွက် no. နဲ့ တွဲသိမ်းဖို့ 
  startAndEnd : [], // word တစ်ခုချင်းရဲ့ အစ ၊ အဆုံး sq နံပါတ်တွေ မှတ်ဖို့
  startAndEndIndex : 0,
  startOrEnd : "start",
  startingRow: null,
  startingCol: null,
  maxRow : appData.noOfSqs,
  maxCol : appData.noOfSqs,
  tempHolder : [],
}

const selectors = {
  squareFrame : document.querySelector("#square-frame"),
  sectionWordList : document.querySelector("#section-word-list"),
}

export const globals =  {
  appData,
  currentStatus,
  selectors,
}