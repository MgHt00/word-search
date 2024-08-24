    saveIt = (i === 0 || i === tempHolder.length - 1) ? true : false;

Or, since the ternary operator is essentially returning a boolean value directly, you can simplify it even further:

    saveIt = (i === 0 || i === tempHolder.length - 1);

This version is more concise and does the same thing. The expression (i === 0 || i === tempHolder.length - 1) will evaluate to true or false, and this value is assigned directly to saveIt.