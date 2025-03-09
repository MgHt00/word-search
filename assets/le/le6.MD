Why is this combination used?

This await new Promise(resolve => setTimeout(resolve, 0)); line is used right before a recursive call to _fill. The purpose is to avoid potential problems related to too much recursion on the call stack, also to make sure the browser does not skip to the next section of the code. In summary, these 2 lines were added to solve two problem:

1. Prevent stack overflow (Too much recursive call): Recursive functions can lead to stack overflow errors if the recursion goes too deep. By yielding control to the event loop with setTimeout(..., 0), we prevent the call stack from getting too large. Each time _fill is called, it does not start immediately, it will only start when the main thread is ready.
2. Prevent the browser from skipping: the recursive call won't be skipped because we use await to make sure that the recursive call is done before continue.

In essence: This combination forces the browser to "take a break" between recursive calls, preventing stack overflows and skipping. It ensures that the call stack remains relatively shallow.

---

# Understanding the `await new Promise(resolve => setTimeout(resolve, 0))` Pattern in JavaScript

This document explains the purpose and behavior of the `await new Promise(resolve => setTimeout(resolve, 0));` code snippet, particularly in the context of recursive functions and asynchronous JavaScript.

## The Question

The core question was:

> So loosely, it means, `await new Promise...` line is a dummy promise, just to make the browser take a break before calling `_fill` once again?

## The Answer

Yes, that's the correct understanding!

The code `await new Promise(resolve => setTimeout(resolve, 0));` is, in essence, a **dummy promise**. Its primary role is *not* to wait for a real asynchronous operation to complete. Instead, it's a clever way to introduce a **pause** or a **yield** in the code's execution flow.

### Key Concepts

Let's break down why it works this way:

1.  **Dummy Promise:** You're right to call it a "dummy promise" because the `resolve` function (which fulfills the promise) is immediately passed to `setTimeout`. There's no actual delay or external asynchronous event being waited for. The `setTimeout` with a delay of `0` is the trick.

2.  **`setTimeout(..., 0)`'s Role:**
    *   **Not Immediate Execution:** A `setTimeout` with a `0ms` delay does *not* mean "execute immediately." It means "execute as soon as the current call stack is empty."
    *   **Event Loop's Job:** It pushes the `resolve` callback to the task queue. The browser's event loop will then pick up that task and execute it at the appropriate time (after the current synchronous code has finished).

3.  **`await`'s Impact:**
    *   **Pausing Execution:** The `await` keyword causes the enclosing `async` function to pause its execution at that specific line.
    *   **Yielding to the Event Loop:** While paused, the JavaScript engine is free to do other things. It can process events, update the UI, handle other tasks in the task queue, etc.

4.  **Recursive Calls:**
    * `_fill` is a recursive function.
    * Recursion is when a function calls itself.
    * If recursion happens too many times, the application will crash because of stack overflow.
    * When the recursion is too much, `setTimeout` will be added in between to avoid this problem.
    * `await` keyword is added to make sure the recursive call is finished before continuing.

### Why Use This Pattern?

In the context of recursive functions (like `_fill` in the `fillingManager.js` code), this pattern is crucial for:

1.  **Preventing Stack Overflow:** The most important reason for this dummy promise pattern is to prevent a potential **stack overflow** error. Recursive functions, if they go too deep, can crash the browser because each function call adds another "frame" to the call stack. By adding this dummy promise, we're ensuring that the recursive calls don't happen in one long, unbroken chain. Instead, there's a slight break between each call, giving the call stack a chance to unwind a bit.

2.  **Allowing Browser to Update UI:** Because we're yielding to the event loop, this can also help with UI responsiveness. If `_fill` was running in a purely synchronous loop, the browser might appear frozen or unresponsive until `_fill` was entirely done. By yielding, the browser gets small windows of opportunity to redraw the UI, handle user interactions, etc.

3. **Making sure the browser does not skip any words**: by adding `await`, we make sure that the previous recursive call is complete, before moving on.

### Simplified Analogy

Imagine you're stacking boxes.

*   **Without the dummy promise:** You might stack them so high and so fast that the whole tower topples over. That's like a stack overflow.
*   **With the dummy promise:** You stack a box, then pause for a moment to make sure the box is secure. You give yourself a little break before adding the next box. This prevents the whole thing from collapsing.

### In Summary

The `await new Promise(resolve => setTimeout(resolve, 0));` technique is used to:

1.  Introduce a pause (yield) in the execution flow of an `async` function.
2.  Prevent stack overflow errors in recursive functions.
3.  Make sure the browser does not skip.
4.  Improve UI responsiveness by allowing the event loop to do its job.

It's a clever and common pattern in JavaScript for managing recursive or long-running asynchronous operations.
