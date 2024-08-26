## Why Adjust by word.length - 1 :
### Right Direction:
- You start placing the word at the current position (col).
- The last character of the word will be at position (col + word.length - 1).
- Example: If word.length is 5 and you start at (0,0), the word will occupy columns 0 through 4 (inclusive).
- Hence, you need to check whether (col + word.length - 1) is within the grid's boundary.

## Why Use word.length - 1 for Both?
For both the checkRight and checkLeft functions, you should reduce col by word.length - 1:

### Right Direction:

- The word stretches from col to col + (word.length - 1).
- Therefore, the check ensures the word fits within the right boundary of the grid.

### Left Direction:

- The word stretches from col to col - (word.length - 1).
- Therefore, the check ensures the word fits within the left boundary of the grid.