# Type Casting and Coercion

Type Coercion (implicit type conversion) happens when a value is being converted to any other types using certain predefined rules

```javascript
var sum = '1' + 5;
console.log(sum)
console.log(typeof sum)

var minus = '1' - 5;
console.log(minus)
console.log(typeof minus)

var minus = 'one' - 5;
console.log(minus)
console.log(typeof minus)

console.log(0 == false)   //true
console.log(1 == true)   //true
console.log(undefined == false) //false
console.log(null == false) //false
console.log("" == false) //true
console.log(undefined == null) //true only case otherwise false

const a = {}
const b = {name:'b'}
const c = {name:'c'}
a[b] = 200; //coercion b to string
a[c] = 400; //coercion c to string
console.log(a[b])
console.log(a[c])
```

Typecasting (explicit type conversion) when we have a value of certain type and we want to convert those values to certain other types.

## 1. is it True or False?

```javascript
console.log(900.9 === 300.3 * 3)
```

All numbers are IEEE 754 floating-point numbers.

```javascript
⅔ => 0.66666667
```

 Since all numbers are binary encoded some decimal numbers cannot be perfectly expressed as a decimal number. So we use repeating numbers and once numbers hit memory delimiter the last digit must be rounded either up or down.

```javascript
console.log(300.3 * 3) // results 900.9000000000001
```

## 1. How to evaluate the above condition?

```javascript
console.log((300.3 * 3).toFixed(2)) // will return a string Or convert this string into a number we can use
console.log(Number((300.3 * 3).toFixed(2))) // 900.9
```

## 2

```javascript
console.log((300.3 * 3).toPrecision(12)) // 900.900000000
Or convert this string into a number we can use
console.log(Number((300.3 * 3).toPrecision(12))) // 900.9
```

## 3

```javascript
console.log( ((300.3 * 10)*3) /10) // 900.9
```

## 4

```javascript
0.1 + 0.2 !== 0.3  is it True or False?
```

```javascript
const name1 = "sparsh";
const name2 = "sparsh";

console.log(name1 == name2);
console.log(name1 === name2);

const user1 = {
  name: "sparsh",
  age: 28,
};
const user2 = {
  name: "sparsh",
  age: 28,
};

console.log(user1 == user2);
console.log(user1 === user2);
```
