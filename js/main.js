// Fetching the value of the --no-of-sqs CSS variable
const rootStyles = getComputedStyle(document.documentElement);
const noOfSqs = parseInt(rootStyles.getPropertyValue('--no-of-sqs'));
// getComputedStyle(document.documentElement).getPropertyValue('--no-of-sqs') retrieves the value of --no-of-sqs from the :root selector.
// Conversion: Since CSS variables are strings by default, we use parseInt to convert the value to a number. 

const squareFrame = document.querySelector("#square-frame");

function generateSqs(sqs) {
  //let sqNum = 1;
  for (let r = 1; r <= sqs; r++) {
    for (let c = 1; c <= sqs; c++) {
      const square = document.createElement("div");
      square.id = `sq-${r}-${c}`;
      square.className = `sq-${r}-${c}`;
      square.textContent = `${r},${c}`; 
      //square.className = `sq-${sqNum}`;
      //square.textContent = sqNum;
      squareFrame.appendChild(square);
    }
    //sqNum++;
  }
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

generateSqs(noOfSqs);