export function random(min, max) {
  console.info("Random called");
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Create the test random function
export function testRandom() {
  const sequence = [8, 8, 6, 1, 9, 8, 6, 3];
  let index = 0;

  return (min, max) => {
    if (index >= sequence.length) {
      console.warn("testRandom out of bounds. Using normal random instead.");
      return random(min, max); // Fallback to normal random.
    }
    const result = sequence[index];
    index++;

    console.log(`testRandom returning: ${result} (min: ${min}, max: ${max})`);
    return result;
  };
}