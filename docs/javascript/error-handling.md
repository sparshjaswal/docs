# Error Handling

Error in code can occur while executions or runtime, even if our code is free from syntax and compile-time error.JavaScript like other languages support handling such errors.

```js
try{
     conSole.log()
}
catch(error){
     console.log(error)
}
finally{
     console.log("this is block will always execute")
}
```

Error handling in javascript includes three blocks, Try block - where the code is which will be prone to error/exceptions is written and once the error occurred the catch block will receive the error object. After executions of the catch block, the final block is executed.catch and finally, blocks are optional but one of them must be written.

```js
class DerivedErrorClass extends Error{
     constructor(){
     super();
         this.name="derivedError";
         this.message="and error handling";
         // this.stack = "" give the complete stack where error occurs
     }
}
try{
    throw new DerivedErrorClass();
}
catch(error){
     console.log(error)
}
finally{
     console.log("this is block will always execute")
}
```

JavaScript Error capturing flow, whenever an error occurs an error block will go to a nearby capturing block and if there is no capturing block then will go to browsers onerror block.
