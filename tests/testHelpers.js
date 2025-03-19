export const testWordList = ["comments", "console", "delete"]; // for testing purpose

/*
Scenario: The words 'comments', and 'console' start from the same position, 
... and 'delete' in random position-direction
*/ 
export function testRandom() { // [le9]
  const sequence = [0, 1, 9, 6, 0, 3, 9, 6]; 
  /* sequence => [index of word arrary, direction, row, col ]
     ... index from array sequence needs to be zero on both round, as the `testWordList` array will be spliced from fillingManager
  */

  let index = 0;

  return (min, max) => {
    if (index >= sequence.length) {
      //console.warn("testRandom out of bounds. Using normal random instead.");
      return Math.floor(Math.random() * (max - min + 1)) + min; // Fallback to normal random.
    }
    const result = sequence[index];
    index++;

    //console.log(`testRandom returning: ${result} (min: ${min}, max: ${max})`);
    return result;
  };
}