# use strict

The JavaScript directive "use strict" enables strict mode. Strict mode makes JavaScript code safer and
more predictable by turning some silent failures into errors and disallowing problematic language features.

Key effects of strict mode

- Prevents accidental globals: assigning to an undeclared variable throws a ReferenceError.
- Disallows duplicate parameter names in functions (causes a SyntaxError).
- Makes attempts to delete non-configurable properties throw an error instead of silently failing.
- Changes `this` in functions: when not called as a method, `this` is `undefined` (instead of the global object).

How to enable strict mode

Place the directive at the top of a file or at the start of a function:

```javascript
// Strict mode for the whole file
'use strict';

// Or strict mode only in a function
function example() {
  'use strict';
  // function body
}
```

Examples

1) Accidental global variables

```javascript
// Without strict mode this creates a global variable
name = 'sparsh';
console.log(name); // 'sparsh'

// With strict mode this throws
'use strict';
name = 'sparsh'; // ReferenceError: name is not defined
```

2) Duplicate function parameters

```javascript
// Non-strict mode allows duplicate parameter names (confusing behaviour)
function nonStrict(a, a, b) {
  console.log(a, a, b);
}
nonStrict(1, 2, 3); // prints: 2 2 3

// In strict mode this is a SyntaxError
'use strict';
function strictFn(a, a, b) {
  // SyntaxError in strict mode
}
```

Notes

- ES modules and modern bundlers use strict mode by default — you usually only need the directive in
  legacy scripts.
- Do not use “smart quotes” for the directive. Use plain single or double quotes: 'use strict' or "use strict".
- Strict mode can help catch bugs early and make your code more reliable.
