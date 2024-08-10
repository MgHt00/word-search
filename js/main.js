// Fetching the value of the --no-of-sqs CSS variable
const rootStyles = getComputedStyle(document.documentElement);
const noOfSqs = parseInt(rootStyles.getPropertyValue('--no-of-sqs'));

const squareFrame = document.querySelector("#square-frame");

function generateSqs(sqs) {
  for (let r = 0,c = 0; r <= sqs; r++, c++) {
    const square = document.createElement("div");
    square.className = `sq-${r}-${c}`;
    square.textContent = `${r}-${c}`;
    squareFrame.appendChild(square);
  }
}

generateSqs(noOfSqs);