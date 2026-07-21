# Loop

When we want to repeat the same code over different values, we generally use a programming constructs loop.

**What are types of loop?**

1. Entry Control Loop(condition checked in the starting of loop e.g. for, while)

2. Exit Control Loop( condition check at end of loop e.g. do while)
   JavaScript support 3 basic loops construct
   for
   syntax of for loop:-

3. **for Loop**

   ```js
   for (initialization; condition; increment / decrement) {
     // code block to be executed
   }
   ```

4. **while Loop**

   ```js
   Initialization;
   while (condition) {
     // code block to be executed
     increment / decrement;
   }
   ```

5. **do...while Loop**

   ```js
   initialization;
   do() {
       // code block to be executed
       increment/decrement;
   }while(condition)
   ```

6. **for of** [es6 introduce]

   ```js
   for (element of arrayName) {
     // code block
   }
   // E.g.
   const array = [1, 2, 3, 4, 5, 6, 7];
   for (const element of array) console.log(element);
   // output 1 2 3 4 5 6 7
   ```
