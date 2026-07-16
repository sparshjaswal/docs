# Symbol

```js
const symbol = Symbol('age');
const anotherSymbol = Symbol('age');
const Obj = {
    name: 'sparsh',
    age: 16,
    [symbol]: 31
}
console.log(Obj.symbol);
// undefined
console.log(Obj.anotherSymbol);
// undefined
console.log(Obj.age);
// 16
console.log(Obj[symbol]);
// 31
console.log(Obj[anotherSymbol]);
// undefined
console.log(symbol === anotherSymbol);
// false
```

```js
const symbol = Symbol.for('debug');
const anotherSymbol = Symbol.for('age');
const Obj = {
    name: 'sparsh',
    age: 16,
    [symbol]: 31
}
console.log(Obj.symbol);
// undefined
console.log(Obj.anotherSymbol);
// undefined
console.log(Obj.age);
// 16
console.log(Obj[symbol]);
// 31
console.log(Obj[anotherSymbol]);
// 31
console.log(symbol === anotherSymbol);
// true
```
