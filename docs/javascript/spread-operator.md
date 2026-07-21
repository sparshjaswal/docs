# Spread [es6]

```javascript
let numbers = [1, 2, 3, 4, 5];
console.log(...numbers);
// 1 2 3 4 5
```

# Rest [es6]

```javascript
function sum(...num) {
  if (typeof num === 'number') return num;
  return num.reduce((x, y) => x + y);
}
console.log(sum([1, 2, 3, 4, 5]));
// [1, 2, 3, 4, 5]
console.log(sum(2));
// 2
```
