The reason the last three console.log statements are not displayed before the recursive call to the start() function is due to how JavaScript handles function calls and the call stack.

## Explanation:
1. Recursive Function Calls:

  - When start() calls itself recursively with start(wordListCopy, leftToDisplay);, the current function execution is paused, and a new execution context is created for the new call to start().
  - The new function call is placed on top of the call stack, and the JavaScript engine starts executing this new instance of start().

2. Call Stack:

  - The call stack is a data structure that keeps track of function calls. When a function is called, it is added to the top of the call stack. When the function completes, it is removed from the stack.
  - Since start() calls itself recursively, the original start() function is not removed from the stack until the recursive call completes. This means that the last three console.log statements in the original start() function won't be executed until the recursive call to start() completes.

3. No Logging Until Recursion Completes:

  - The recursive call happens immediately, and the program's control moves to the new call. As a result, the original function's execution is paused, including the execution of any code after the recursive call. Therefore, the console.log statements won't run until the recursive call and all subsequent recursive calls are finished.

## Example Flow:

Assume `noOfWordsToDisplay = `5 and `leftToDisplay = 2` before the recursive call:

- On the first call, when the recursive start() is called, the original function execution is paused.
- The new start() function runs. If it completes without further recursion, the control returns to the original function call, and the console.log statements are then executed.

## Possible Solutions:
1. Force the Logging Before Recursion:
  - One way to ensure that the console.log statements are executed before the recursive call is to use setTimeout() with a delay of 0. This effectively defers the recursive call, allowing the console.log statements to execute first.

Here’s how you could modify your code:

    if (leftToDisplay > 0) {
        console.log("leftToDisplay: ", leftToDisplay);
        console.log("wordListCopy.length: ", wordListCopy.length);
        console.log("EXECUTED: start(wordListCopy, leftToDisplay);");

        setTimeout(() => {
            start(wordListCopy, leftToDisplay);
        }, 0);
    }

  - This small delay ensures that the console.log messages are flushed to the console before the next iteration of start() is invoked.

2. Check for Console Buffering:

  - If you’re using a development environment or a browser console that buffers console.log outputs, it might not display them immediately. By introducing a small delay (as shown above), you can usually force the logs to appear.

3. Debugging and Step-Through:

  - If you still encounter issues, consider using a debugger to step through the code. This can help you see the order of execution and confirm whether the console.log statements are being skipped or delayed.

### Summary:
Using setTimeout() with a delay of 0 before the recursive call should help ensure that the console.log statements are displayed as expected before the recursion begins. This approach forces the current stack to complete before the recursive call starts.






