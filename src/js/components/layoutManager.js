export function layoutManager(globals) {

  const { selectors } = globals;
  const { squareFrame } = selectors;

  function generateSqs(sqs = 14) {
    console.groupCollapsed("generateSqs()");

    if (!sqs) {
      console.warn("Missing paramter.",sqs);
    }

    for (let r = 1; r <= sqs; r++) {
      for (let c = 1; c <= sqs; c++) {
        const square = document.createElement("div");
        square.id = `sq-${r}-${c}`;
        square.className = `sq-${r}-${c}`;
        squareFrame.appendChild(square);
      }
    }

    console.groupEnd();
  }

  return {
    generateSqs,
  }
}