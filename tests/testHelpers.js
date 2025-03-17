export const testWordList = ["comments", "console"]; // for testing purpose

export function testRandom() { // [le9]
  // sequence => [index of word arrary, direction, row, col ]
  // index needs to b zero on both round, as the `testWordList` array will be spliced from fillingManager
  const sequence = [0, 1, 9, 6, 0, 3, 9, 6];
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