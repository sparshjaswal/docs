---
id: dsa-linked-list-reverse-traversal-readme
title: "Reversed Linked List Traversal"
slug: /DSA/linked-list/reverse-traversal/README
sidebar_label: "Reversed Linked List Traversal"
---

# Reversed Linked List Traversal

**Practice focus:** Compare saving values on a stack with delaying output until recursive calls return.

Read the values of a singly linked list from tail to head. This task does not change the `next` references. Reversing the links is a different operation with a different mutation contract.

**Before you start:** read [forward traversal](../traversal/README.md).

## Save then read backward

| Forward visit | Stack after saving the value |
| --- | --- |
| 12 | `[12]` |
| 99 | `[12, 99]` |
| 37 | `[12, 99, 37]` |

Read that stack backward to produce `37 → 99 → 12`. A singly linked node has no previous reference, so the saved order supplies the missing information.

```js runnable
function reverseValues(head) {
  const values = [];
  for (let node = head; node !== null; node = node.next) values.push(node.value);
  return values.reverse();
}
const head = { value: 12, next: { value: 99, next: { value: 37, next: null } } };
console.log(reverseValues(head).join(' → '));
console.log(head.value, head.next.value);
```

```text output
37 → 99 → 12
12 99
```

## Cost and alternatives

Time is O(n) and the returned array uses O(n) space. Recursion can process a node after visiting `next`, but its call stack also uses O(n) space and can overflow on a long list. Repeatedly scanning from the head to find the preceding node avoids a stack but costs O(n²) time.

If mutation is allowed, reversing links takes O(n) time and O(1) working space; restoring the original list needs a second reversal. A doubly linked list can follow previous references from the tail. Choose according to the data structure and whether other code shares the nodes.

## Check your understanding

Test an empty list and one node. Save references to the original head and its next node before calling the function, then confirm both references and links remain unchanged. A cyclic list violates this function's input contract.

## Reference

- [Wikipedia](https://en.wikipedia.org/wiki/Linked_list)

## Exercise and failure drill

Print a singly linked list in reverse without changing its links. Compare recursion, an explicit stack, and reversing the list.

<details>
<summary>Expected trace and debugging checks</summary>

Recursion and a stack retain the earlier nodes, using linear additional storage. Reversing links changes the structure and requires an explicit mutation contract, including restoration if callers expect the original order.

</details>

## Interview reasoning

Can reverse output be both one-pass and constant extra space without mutation? For an arbitrary singly linked list with forward-only access, retaining the needed history or changing traversal structure is necessary; repeated rescanning instead trades extra time for storage.

**Next:** [Doubly Linked List](../../doubly-linked-list/README.md).
