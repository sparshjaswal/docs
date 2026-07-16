# IIFE (Immediately Invoked Function Expression)

IIFE is a function expression that is called an Immediately Invoked Function Expression, i.e., a function which is executed immediately after it's created.

```
(function printMsg(msg){
    		console.log(msg);
})("Hello World");

var sayHello = function (name) {
   		return "Hello!!!"+ name;
}();

(
   		() => console.log("Hello world")
)();
```

## Advantages of using IIFE:
- **Maintain private scope**
- **Provide implementation best practices or design patterns**

## Example: Creating Dynamic Buttons

```javascript
// We need to create dynamically 5 buttons, each button will have its own alert
`window.addEventListener('load', (event) => {
    for(var i = 1;i<=5;i++){
        var body = document.getElementsByTagName("BODY")[0];
        var button = document.createElement("BODY");
        button.innerHTML = 'Button' + i;
        button.onclick = function(){
            alert('this is button 1'+i)
        }
        body.append(button);
    }
});`

//solutions to above problem
`window.addEventListener('load', (event) => {
    for(var i = 1;i<=5;i++){
        var body = document.getElementsByTagName("BODY")[0];
        var button = document.createElement("BODY");
        button.innerHTML = 'Button' + i;
        (function(num){
            button.onclick = function(){
                alert('this is button 1'+num)
  	}
  })(i)
  body.append(button);
}
});`
With IIFE we can give the opportunity to bind multiple/concat files with any issue of scope collisions. Tools like grunt , glup emerges.
But the issues observed:-
How to remove dead code
Lots of IIFE are used which increase the slowness.
## 🚀 Advanced IIFE Patterns

> **Note**: This section contains advanced IIFE patterns and techniques that will be expanded in future updates.

**Coming Soon:**
- Module Pattern with IIFE
- Advanced Parameter Passing
- IIFE with Async/Await
- Performance Optimization Techniques
