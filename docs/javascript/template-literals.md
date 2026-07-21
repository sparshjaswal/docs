---
id: javascript-template-literals
title: Template Literals [es6]
slug: /javascript/template-literals
sidebar_label: Template Literals [es6]
---

# Template Literals [es6]

The template is termed as a certain predefined format and literals are referred to as a value which you don’t want to mutate while displaying or showing. **Backtick Operator**
Let's suppose we want to print table of multiple of 5(print template)

```javascript
for(var i=1;i<=10;i++)
    console.log('5 X '+ i +' ='+5*i);
// output
5 X 1  = 5
5 X 2  = 10
5 X 3  = 15
5 X 4  = 20
5 X 5  = 25
5 X 6  = 30
5 X 7  = 35
5 X 8  = 40
5 X 9  = 45
5 X 10 = 50

With new approach we can do something like

for(var i=1;i<=10;i++)
 console.log(`5 X ${i} = ${5*i}`);


Let's suppose we want to print multiline output
    console.log('GM!!! \n How are you?');
        OR new approach
    console.log(`GM!!! How are you?`);


Less Code below
const domain = 'sony.com';
const protocol = 'https';
const resource = 'products'
const url = `${protocol}://www.${domain}/${resource}`;
console.log(url);
```
