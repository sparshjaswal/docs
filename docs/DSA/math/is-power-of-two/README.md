---
id: dsa-math-is-power-of-two-readme
title: "Is a power of two"
slug: /DSA/math/is-power-of-two/README
sidebar_label: "Is a power of two"
---

# Is a power of two

**Read first:** [Bit Manipulation](../../bit-manipulation/README.md).

**Practice focus:** Compare repeated division with the single-set-bit property, and check zero separately.

Powers of two start `1, 2, 4, 8, 16, …`; each doubles the previous value. Decide whether a positive integer belongs to this sequence. In binary, each has exactly one 1 bit.

**Naive solution**

In naive solution we just keep dividing the number by two
unless the number becomes `1` and every time we do so, we
check that remainder after division is always `0`. Otherwise, the number can't be a power of two.

**Bitwise solution**

Powers of two in binary form always have just one bit set.
The only exception is with a signed integer (e.g. an 8-bit
signed integer with a value of -128 looks like: `10000000`)

```
1: 0001
2: 0010
4: 0100
8: 1000
```

So after checking that the number is greater than zero,
we can use a bitwise hack to test that one and only one
bit is set.

```
number & (number - 1)
```

For example for number `8` that operations will look like:

```
  1000
- 0001
  ----
  0111

  1000
& 0111
  ----
  0000
```

## Use the correct JavaScript number representation

Number bitwise operators convert operands to signed 32-bit integers. Applying the bit trick to arbitrary Number values can therefore discard significant bits. BigInt avoids that conversion:

```js runnable
function isPowerOfTwo(value) {
  if (typeof value !== 'bigint') throw new TypeError('Pass a BigInt');
  return value > 0n && (value & (value - 1n)) === 0n;
}
console.log(isPowerOfTwo(1n));
console.log(isPowerOfTwo(8n));
console.log(isPowerOfTwo(0n));
console.log(isPowerOfTwo((1n << 40n) + 1n));
```

```text output
true
true
false
false
```

The positivity check excludes both zero and negative inputs. For an integer with `b` bits, BigInt work depends on `b`; calling this O(1) is appropriate only for a fixed-width integer model. As an alternative, repeated exact division by 2 needs O(log n) division steps.

## Check your understanding

Test 1, 2, an odd value above 1, zero, a negative value, and a large power of two. Explain why a number with two set bits stays nonzero after clearing its lowest set bit.

## References

- [GeeksForGeeks](https://www.geeksforgeeks.org/program-to-find-whether-a-no-is-power-of-two/)
- [Bitwise Solution on Stanford](http://www.graphics.stanford.edu/~seander/bithacks.html#DetermineIfPowerOf2)
- [Binary number subtraction on YouTube](https://www.youtube.com/watch?v=S9LJknZTyos&t=0s&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=66)

**Next:** [Bit Manipulation](../bits/README.md).
