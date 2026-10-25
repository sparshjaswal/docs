---
id: dsa-linked-list-readme
title: "🔗 Linked List"
slug: /DSA/linked-list/README
sidebar_label: "Linked List"
---

import PracticeProblem from '@site/src/components/PracticeProblem';

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Linked lists: change connections without losing data

**Prerequisites:** [arrays](../Array/README.md), loops, and [JavaScript references](../javascript-for-dsa.md). A **node** is an object containing a value and a reference to another node. A **linked list** is a chain of these objects. `head` refers to the first node; `null` means there is no node.

Imagine a treasure hunt: each card gives a clue and the location of the next card. You can follow the chain, but cannot immediately jump to the seventh card. That is the main tradeoff compared with an indexed array.

```text
head
  |
  v
+----------+     +----------+     +----------+
| val: 10  |     | val: 20  |     | val: 30  |
| next: ---+---->| next: ---+---->| next:null|
+----------+     +----------+     +----------+
```

Boxes represent separate objects, not consecutive memory addresses. Arrows are references. Reassigning `current` moves a reference; assigning `current.next` changes the structure itself. JavaScript manages memory, so there is no pointer arithmetic or manual freeing here.

Use a list when local insertion/removal around known nodes is important, or when the problem gives you nodes. Use an array when random indexed access is important. Finding a node first may take O(n), even if the final link change takes O(1).

<AlgorithmWalkthrough name="linkedList" />

## Learning steps

For a playlist represented by nodes, changing the next-song link changes the playing order without moving song records.

1. Follow the arrows and distinguish a node from its value.
2. Reverse links while keeping the unvisited part reachable.
3. Use slow and fast references to find a middle or detect a cycle.

## Build, traverse, and reverse a list

**Contract:** `reverseList` receives the head of a finite list with no cycle. It changes the existing nodes' links and returns the new head. An empty list remains `null`. `valuesOf` is a helper for displaying finite lists, not for cyclic inputs.

```js runnable
function listFrom(values) {
  let head = null;
  for (let index = values.length - 1; index >= 0; index--) {
    head = { val: values[index], next: head };
  }
  return head;
}

function valuesOf(head) {
  const values = [];
  for (let node = head; node !== null; node = node.next) {
    values.push(node.val);
  }
  return values;
}

function reverseList(head) {
  let previous = null;
  let current = head;
  while (current !== null) {
    const nextNode = current.next; // Save the untouched chain before changing a link.
    current.next = previous;
    previous = current;
    current = nextNode;
  }
  return previous;
}

const originalHead = listFrom([10, 20, 30]);
const reversedHead = reverseList(originalHead);
console.log(valuesOf(reversedHead).join(','));
console.log(originalHead.next === null);
console.log(reverseList(null));
```

```text output
30,20,10
true
null
```

The caller must use the returned head. The old head now refers to the last node, not to a copy of the original list.

| After processing | Reversed prefix headed by `previous` | Untouched suffix headed by `current` |
| --- | --- | --- |
| No nodes | null | 10 → 20 → 30 → null |
| 10 | 10 → null | 20 → 30 → null |
| 20 | 20 → 10 → null | 30 → null |
| 30 | 30 → 20 → 10 → null | null |

**Why it works:** the two chains contain all original nodes exactly once. Saving `nextNode` keeps the suffix reachable while changing the current link. Each step moves one node from the suffix to the reversed prefix. When the suffix is empty, the prefix is the complete reversed list. The reversal costs O(n) time and O(1) auxiliary space; building and displaying the list each use O(n) space separately.

## Fast and slow references

Move `slow` one link and `fast` two links. In a finite list, when `fast` reaches the end, `slow` has traveled about half the distance. In a cycle, once both references are inside it, the faster one gains one position per step and eventually catches the slower one.

```js runnable
function findMiddle(head) {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow; // The second middle for an even-length finite list.
}

function hasCycle(head) {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true; // Compare node identity, not equal values.
  }
  return false;
}

const third = { val: 30, next: null };
const second = { val: 20, next: third };
const first = { val: 10, next: second };
console.log(findMiddle(first).val);
console.log(hasCycle(first));
third.next = second;
console.log(hasCycle(first));
console.log(hasCycle(null));
```

```text output
20
false
true
false
```

Check `fast` before reading `fast.next`; `&&` stops evaluation when the first condition is false. Equal values do not imply equal nodes. Both algorithms use O(n) time and O(1) auxiliary space, with n distinct reachable nodes. `findMiddle` requires no cycle; use cycle detection if that assumption is unknown.

## Circular and doubly linked lists

A **circular list** deliberately links its last node back to its head. It can represent turns that repeat. A loop that waits for `null` would never stop. Instead, stop on returning to the exact starting node.

```text
head -> [A] -> [B] -> [C]
         ^             |
         +-------------+
Stop after C: the next reference equals head again.
```

```js runnable
function circularValues(head) {
  if (head === null) return [];
  const values = [];
  let node = head;
  do {
    values.push(node.val);
    node = node.next;
  } while (node !== head);
  return values;
}

const first = { val: 'A', next: null };
const second = { val: 'B', next: first };
first.next = second;
console.log(circularValues(first).join(','));
const only = { val: 'X', next: null };
only.next = only;
console.log(circularValues(only).join(','));
console.log(circularValues(null).length);
```

```text output
A,B
X
0
```

**Contract:** input is empty or a proper circular list whose cycle starts at head. This is not a validator for arbitrary broken links or a cycle starting in the middle. `do ... while` visits the head once before checking for a return to it. Each of n nodes is visited once: O(n) time, O(1) traversal space plus O(n) output.

For circular insertion after a known node, set `newNode.next = node.next`, then `node.next = newNode`. When inserting the first node into an empty list, set its `next` to itself; insertion into an existing singleton uses the ordinary two-link update. Deleting a known successor redirects one link, but deleting the only node must set the stored head to `null`; deleting the head requires also updating the last node's link.

A **doubly linked list** adds a backward reference. For `A ↔ B ↔ C`, removal of known node B reconnects both A's next and C's previous references. Study the complete [doubly linked list implementation](../doubly-linked-list/README.md) before [LRU cache](../lru-cache/README.md), which combines these links with a map.

## Understanding checks and practice

1. Why must reversal save `current.next` before overwriting it?
2. What do the middle and cycle functions return for an empty list? What is the middle of a four-node finite list?
3. Reverse `10 → 20 → null` on paper. Then merge two **disjoint**, sorted finite lists without allocating replacement value nodes.

<details>
<summary>Hints</summary>

Draw separate arrows for each variable. For merging, keep the smaller current node and advance only that list. A temporary dummy node makes the first attachment behave like every later attachment.

</details>

<details>
<summary>Answers and a merge solution</summary>

1. Otherwise the link to the unprocessed suffix is lost; `current.next` would point backward.
2. The results are `null` and `false`. For four nodes, `slow` stops at the third, the second of the two middles.
3. Reversal first produces `10 → null` and then `20 → 10 → null`.

```js runnable
function mergeTwoLists(first, second) {
  const dummy = { next: null };
  let tail = dummy;
  while (first !== null && second !== null) {
    if (first.val <= second.val) {
      tail.next = first;
      first = first.next;
    } else {
      tail.next = second;
      second = second.next;
    }
    tail = tail.next;
  }
  tail.next = first ?? second;
  return dummy.next;
}

const first = { val: 1, next: { val: 4, next: null } };
const second = { val: 2, next: { val: 3, next: null } };
let merged = mergeTwoLists(first, second);
const result = [];
while (merged !== null) {
  result.push(merged.val);
  merged = merged.next;
}
console.log(result.join(','));
console.log(mergeTwoLists(null, null));
```

```text output
1,2,3,4
null
```

The attached prefix stays sorted: each step chooses the smallest remaining head, which is no larger than any later item in either sorted list. Appending the remaining suffix preserves order. Each node is attached once: O(n + m) time, O(1) auxiliary space. The display array uses separate O(n + m) output space. This function reuses and mutates input links; shared nodes between inputs violate its contract.

</details>

## Worked examples and answers {/* #workbook-practice */}

Attempt the linked [Practice Problems](#practice-problems) before opening their answers. See the [workbook guide](../../javascript/workbook.md) for the A–C exercise format.

### 36. Linked lists and pointer reasoning {/* #workbook-36 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** reverse the same node objects without losing the rest of the chain.

Review [building and reversing a list](#build-traverse-and-reverse-a-list) and [fast and slow references](#fast-and-slow-references). In the example below, `previous` heads the reversed part and `current` heads the untouched part. Save the next node before changing a link. The result mutates the original nodes; creating an independent list would require new nodes.

The same reasoning extends to [doubly linked lists](../doubly-linked-list/README.md): changing two-way links adds more relationships to preserve. A **sentinel** is an extra helper node that can give the first real node a consistent predecessor and simplify endpoint code.

For cycle checks, compare object identity, not stored values. After slow and fast references meet, restarting one at the head and advancing both one link at a time finds the cycle entry. Test empty input, one node, repeated values, and a cycle that returns to the head.

**Worked example**

```js
function reverseList(head) {
  let previous = null;
  let current = head;
  while (current !== null) {
    const next = current.next;
    current.next = previous;
    previous = current;
    current = next;
  }
  return previous;
}
const head = { value: 1, next: { value: 2, next: null } };
const reversed = reverseList(head);
console.log(reversed.value, reversed.next.value);
```

**Expected output**

```text
2 1
```

**Why the example works**

The first iteration changes 1.next to null while retaining node 2 in next. The second changes 2.next to node 1. Returning previous exposes the new head. The old head still refers to node 1, which is now the tail.

</details>

Find **36A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-36-answer">
<summary>Check your reasoning and answer</summary>

For Node checks, add `import assert from "node:assert/strict";` at the top of your file. Browser and multi-file examples use the setup stated above.

**36A.** Overwriting the only reference to the suffix can lose access to the remaining nodes. Saving the successor preserves the unprocessed chain while the current link changes.

**36B.** No. Finding the value or its predecessor can take O(n). The local rewiring is O(1) only when the required node references are already available.

**36C.** The fast reference must have both a current node and a next node before advancing twice. Compare node identity after moving. On an acyclic list the loop terminates at the end; on a cycle the references meet.

**Reference code**

Use the worked example above first if the answer calls its functions or classes. Run each lesson in its own `.mjs` file.

```js
function hasCycle(head) {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
```

**Check the result**

```js
assert.equal(hasCycle(null), false);
const one = { value: 1, next: null };
assert.equal(hasCycle(one), false);
one.next = one;
assert.equal(hasCycle(one), true);
```

</details>

## Practice Problems

{/* BEGIN GENERATED PRACTICE PROBLEMS */}

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **36A — Why save next before changing current.next?** | **Must fix** | [Worked example](#workbook-36) | [Answer](#workbook-36-answer) |
| **36B — Is deleting a value from a singly linked list always O(1)?** | **Must fix** | [Worked example](#workbook-36) | [Answer](#workbook-36-answer) |
| **36C — Implement hasCycle(head) using fast and slow references.** | **Must fix** | [Worked example](#workbook-36) | [Answer](#workbook-36-answer) |
| <PracticeProblem id={21} title={"Merge Two Sorted Lists"} text={"Problem statement\nMerge two singly linked lists whose values are sorted in ascending order. Return the head of one\nsorted list containing every original node, reusing and relinking the existing nodes. Either input\nmay be empty, and equal values must all remain.\nInput \u0026 expected result\nThe returned head may be an original head or another original node. The result must end at null\nand remain sorted in nondecreasing order. Include duplicates from both lists rather than\neliminating equal-valued nodes.\nEXAMPLE 1\nInput: list1 = [1,4], list2 = [2,3,5]\nReturn list: [1,2,3,4,5]\nExplanation: The original nodes can be arranged as 1, 2, 3, 4, 5, preserving every value in\nsorted order.\nEXAMPLE 2\nInput: list1 = [], list2 = [0,0]\nReturn list: [0,0]\nExplanation: With no nodes in the first list, the second list already contains the complete sorted\nresult.\nConstraints \u0026 guarantees\n• Node.val: -100 through 100 (inclusive)\n• Each input list has 0 through 50 nodes. Both value sequences are nondecreasing\nJavaScript starter\nfunction mergeTwoLists(list1, list2) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/merge-two-sorted-lists/) | — |
| [LC 83 — Remove Duplicates from Sorted List](https://leetcode.com/problems/remove-duplicates-from-sorted-list/) | Easy | [LeetCode](https://leetcode.com/problems/remove-duplicates-from-sorted-list/) | — |
| <PracticeProblem id={141} title={"Linked List Cycle"} text={"Problem statement\nGiven the head of a singly linked list, determine whether repeatedly following next eventually\nrevisits a node. Compare node identity rather than values. Return true for a cycle and false if\ntraversal reaches null. The list may be empty. Aim for constant extra space.\nInput \u0026 expected result\nThe function receives head only. A diagram or judge annotation identifying the cycle's destination\nis descriptive information, not an extra argument. Nodes with identical values are still different\nnodes unless their references are identical.\nEXAMPLE 1\nInput: nodes 4 -\u003e 7 -\u003e 9, with 9.next pointing back to node 7\nOutput: true\nExplanation: Following next from 9 returns to the already visited node 7, so traversal repeats\nindefinitely.\nEXAMPLE 2\nInput: head = [5,5], with the second node pointing to null\nOutput: false\nExplanation: The equal values belong to different nodes, and traversal terminates rather than\nrevisiting a node.\nConstraints \u0026 guarantees\n• Node.val: -10^5 through 10^5 (inclusive)\n• List size: 0 through 10^4 nodes. The judge's cycle annotation pos is -1 or a valid zero-based node index\n• it is not a function parameter\nJavaScript starter\nfunction hasCycle(head) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/linked-list-cycle/) | — |
| <PracticeProblem id={160} title={"Intersection of Two Linked Lists"} text={"Problem statement \u0026 expected result\nReturn the first node shared by two acyclic linked lists, or null if they share no node. Intersection means object\nidentity, not equal values. Preserve both lists. The judge constructs any shared suffix before passing the two\nheads. Aim for linear time and constant extra space.\nEXAMPLE 1\nInput: intersectVal = 8, listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], skipA = 2, skipB = 3\nReturned shared node: value 8\nExplanation: The first shared node has value 8; equal earlier values are separate objects.\nEXAMPLE 2\nInput: intersectVal = 2, listA = [1,9,1,2,4], listB = [3,2,4], skipA = 3, skipB = 1\nReturned shared node: value 2\nExplanation: The shared suffix begins at the node with value 2.\nConstraints \u0026 guarantees\n- The number of nodes of listA is in the m.\n- The number of nodes of listB is in the n.\n- 1 \u003c= m, n \u003c= 3 * 10^4\n- 1 \u003c= Node.val \u003c= 10^5\n- 0 \u003c= skipA \u003c= m\n- 0 \u003c= skipB \u003c= n\n- intersectVal is 0 if listA and listB do not intersect.\n- intersectVal == listA[skipA] == listB[skipB] if listA and listB intersect.\nJavaScript starter\nfunction getIntersectionNode(headA, headB) {\n// TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/intersection-of-two-linked-lists/) | — |
| [LC 203 — Remove Linked List Elements](https://leetcode.com/problems/remove-linked-list-elements/) | Easy | [LeetCode](https://leetcode.com/problems/remove-linked-list-elements/) | — |
| <PracticeProblem id={206} title={"Reverse Linked List"} text={"Problem statement\nReverse the direction of a singly linked list and return the new head. Each node must point to its\nformer predecessor, and the original first node must become the final node pointing to null. The list\nmay be empty. Consider both iterative and recursive approaches.\nInput \u0026 expected result\nReturn null for an empty list. For a nonempty list, return the original tail after reversing the links.\nThe required result is a linked list with the same nodes and values, not merely a reversed array of\ntheir values.\nEXAMPLE 1\nInput: head = [2,5,9]\nReturn list: [9,5,2]\nExplanation: The original tail 9 becomes the head and points to 5, which points to 2; node 2 then\npoints to null.\nEXAMPLE 2\nInput: head = [7]\nReturn list: [7]\nExplanation: A single node has no other links to reverse and is both the original and resulting\nhead.\nConstraints \u0026 guarantees\n• Node.val: -5000 through 5000 (inclusive)\n• List size: 0 through 5000 nodes\nJavaScript starter\nfunction reverseList(head) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/reverse-linked-list/) | — |
| <PracticeProblem id={234} title={"Palindrome Linked List"} text={"Problem statement\nDetermine whether the values in a singly linked list read the same from head to tail as they do in\nreverse. Return a Boolean. The comparison concerns node values rather than node identities.\nInput \u0026 expected result\nFollow-up: use O(n) time and O(1) extra space.\nEXAMPLE 1\nInput: head = [3,7,3]\nOutput: true\nExplanation: The forward and reversed value sequences are identical.\nEXAMPLE 2\nInput: head = [3,7]\nOutput: false\nExplanation: Reversing the values produces [7,3].\nConstraints \u0026 guarantees\n• List node count: [1, 10^5]\n• 0 \u003c= Node.val \u003c= 9\nJavaScript starter\nfunction isPalindrome(head) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/palindrome-linked-list/) | — |
| <PracticeProblem id={876} title={"Middle of the Linked List"} text={"Problem statement\nReturn the middle node of a singly linked list. When the length is even, return the later of the two\nmiddle nodes. Return the original node reference, preserving the links from it onward.\nInput \u0026 expected result\nDisplayed output is the suffix beginning at the returned node.\nEXAMPLE 1\nInput: head = [2,4,6,8,10]\nOutput list: [6,8,10]\nExplanation: The third node is the unique middle.\nEXAMPLE 2\nInput: head = [2,4,6,8]\nOutput list: [6,8]\nExplanation: The second and third nodes are central; return the third.\nConstraints \u0026 guarantees\n• List node count: [1, 100]\n• 1 \u003c= Node.val \u003c= 100\nJavaScript starter\nfunction middleNode(head) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/middle-of-the-linked-list/) | — |
| [LC 1290 — Convert Binary Number in a Linked List to Integer](https://leetcode.com/problems/convert-binary-number-in-a-linked-list-to-integer/) | Easy | [LeetCode](https://leetcode.com/problems/convert-binary-number-in-a-linked-list-to-integer/) | — |
| <PracticeProblem id={2} title={"Add Two Numbers"} text={"Problem statement\nTwo nonempty linked lists represent nonnegative integers, one decimal digit per node, with the\nleast significant digit first. Add the integers and return a linked list in the same format. The\nnumbers have no leading zero except the representation of zero itself. Account for any carry\nbeyond the final input node.\nInput \u0026 expected result\nList notation shows digits from head to tail, so the first element represents the units digit. Return a\nlist of digits, not a number or string. Input lists may have different lengths, and the result may be\none node longer.\nEXAMPLE 1\nInput: l1 = [5,4], l2 = [7,3]\nOutput: [2,8], representing 45 + 37 = 82\nExplanation: The first list represents 45 and the second represents 37. Their sum, 82, is stored\nas units 2 followed by tens 8.\nEXAMPLE 2\nInput: l1 = [9,9], l2 = [1]\nReturn list: [0,0,1]\nExplanation: Ninety-nine plus one is 100. The additional leading digit of the number becomes\nthe last list node.\nConstraints \u0026 guarantees\n• Node.val: 0 through 9 (inclusive)\n• Each list has 1 through 100 nodes. Numbers have no leading zero, apart from the representation of zero\nitself\nJavaScript starter\nfunction addTwoNumbers(l1, l2) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/add-two-numbers/) | — |
| <PracticeProblem id={19} title={"Remove Nth Node From End of List"} text={"Problem statement\nRemove the nth node counted backward from the end of a nonempty singly linked list, then return\nits head. n is between 1 and the number of nodes. Removing the first node must update the\nreturned head. Try to solve it in one pass.\nInput \u0026 expected result\nCount the tail as position 1 from the end. Exactly one node is removed, even when values repeat.\nThe result contains one fewer node; for a one-node input, removing that node returns null.\nEXAMPLE 1\nInput: head = [10,20,30,40], n = 3\nReturn list: [10,30,40]\nExplanation: Counting backward gives 40 as first, 30 as second, and 20 as third. Removing 20\nproduces the shown list.\nEXAMPLE 2\nInput: head = [8], n = 1\nOutput: null\nExplanation: The only node is also the first node from the end, so removing it leaves an empty\nlist.\nConstraints \u0026 guarantees\n• sz: 1 through 30 (inclusive)\n• Node.val: 0 through 100 (inclusive)\n• n: 1 through sz (inclusive)\n• sz denotes the list's node count\nJavaScript starter\nfunction removeNthFromEnd(head, n) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/remove-nth-node-from-end-of-list/) | — |
| <PracticeProblem id={24} title={"Swap Nodes in Pairs"} text={"Problem statement\nSwap each consecutive pair of nodes in a singly linked list, starting with its first two nodes.\nReconnect the nodes themselves; changing their stored values is not allowed. If the final node has\nno partner, leave it at the end.\nInput \u0026 expected result\nReturn the head of the reordered list. An empty input returns null.\nEXAMPLE 1\nInput: head = [4,7,2,9,5]\nOutput list: [7,4,9,2,5]\nExplanation: The first two pairs swap positions, while the last node stays in place.\nEXAMPLE 2\nInput: head = [6]\nOutput list: [6]\nExplanation: A single node has no partner.\nConstraints \u0026 guarantees\n• List node count: [0, 100]\n• 0 \u003c= Node.val \u003c= 100\nJavaScript starter\nfunction swapPairs(head) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/swap-nodes-in-pairs/) | — |
| <PracticeProblem id={61} title={"Rotate List"} text={"Problem statement\nRotate a singly linked list to the right by k positions, where k is nonnegative and may exceed the\nlist length. A right rotation moves the last node to the front. Return the new head, preserving all\nnodes and their values. An empty or one-node list remains unchanged.\nInput \u0026 expected result\nA rotation changes links rather than values. The result must still be a finite singly linked list ending\nat null. Rotating by the length of a nonempty list restores its original order, and k = 0 makes no\nchanges.\nEXAMPLE 1\nInput: head = [1,2,3,4], k = 1\nReturn list: [4,1,2,3]\nExplanation: One right rotation moves the last node, 4, ahead of 1 while keeping the other\nnodes in order.\nEXAMPLE 2\nInput: head = [4,5,6], k = 4\nReturn list: [6,4,5]\nExplanation: Three right rotations restore the original list; the fourth moves 6 to the front.\nConstraints \u0026 guarantees\n• Node.val: -100 through 100 (inclusive)\n• k: 0 through 2 * 10^9 (inclusive)\n• List size: 0 through 500 nodes\nJavaScript starter\nfunction rotateRight(head, k) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/rotate-list/) | — |
| <PracticeProblem id={82} title={"Remove Duplicates from Sorted List II"} text={"Problem statement\nA linked list is sorted in ascending order. Delete every value that appears more than once,\nremoving all nodes containing that repeated value. Retain only values that occurred exactly once,\nin sorted order. Return the new head; the result may be empty.\nInput \u0026 expected result\nThe operation removes repeated values completely, rather than keeping one representative of\neach run. Input order is already nondecreasing. Preserve the original relative order of the nodes\nwhose values occur only once.\nEXAMPLE 1\nInput: head = [1,1,2,3,3,4]\nReturn list: [2,4]\nExplanation: Both 1 nodes and both 3 nodes are removed. Values 2 and 4 each occur once, so\ntheir nodes remain.\nEXAMPLE 2\nInput: head = [2,2,2]\nOutput: null\nExplanation: The only value appears more than once, so none of its nodes can be retained.\nConstraints \u0026 guarantees\n• Node.val: -100 through 100 (inclusive)\n• List size: 0 through 300 nodes. Values are in nondecreasing order\nJavaScript starter\nfunction deleteDuplicates(head) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/) | — |
| <PracticeProblem id={86} title={"Partition List"} text={"Problem statement\nRearrange a linked list around x so that every node with value less than x precedes every node\nwith value at least x. Within each of the two groups, preserve the nodes' original relative order.\nReturn the head of the rearranged list.\nInput \u0026 expected result\nNodes equal to x belong to the second group. This is a stable partition, not a request to sort the\nentire list. Return the existing nodes connected into the required order, with the final next pointer\nset to null.\nEXAMPLE 1\nInput: head = [3,1,4,2], x = 3\nReturn list: [1,2,3,4]\nExplanation: The values below 3 are 1 and 2 in that order. The other nodes, 3 and 4, follow in\ntheir original order.\nEXAMPLE 2\nInput: head = [4,1,3,2,5], x = 3\nReturn list: [1,2,4,3,5]\nExplanation: The second group remains 4,3,5; partitioning does not sort the values within either\ngroup.\nConstraints \u0026 guarantees\n• Node.val: -100 through 100 (inclusive)\n• x: -200 through 200 (inclusive)\n• List size: 0 through 200 nodes\nJavaScript starter\nfunction partition(head, x) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/partition-list/) | — |
| <PracticeProblem id={92} title={"Reverse Linked List II"} text={"Problem statement\nReverse the nodes of a singly linked list from one-based position left through position right,\ninclusive. Keep nodes outside that range in the same order and reconnect the pieces. Return the\nhead of the resulting list. The positions are valid, with left no greater than right. Try to perform the\nchange in one traversal.\nInput \u0026 expected result\nPositions count nodes from the original head starting at 1. Only the inclusive segment is reversed;\nits length is right - left + 1. When left is 1, reversing the segment can change which node is\nreturned as head.\nEXAMPLE 1\nInput: head = [1,2,3,4,5], left = 2, right = 4\nReturn list: [1,4,3,2,5]\nExplanation: Positions 2 through 4 contain 2, 3, 4. They become 4, 3, 2 between the unchanged\nouter nodes 1 and 5.\nEXAMPLE 2\nInput: head = [7,8,9], left = 1, right = 2\nReturn list: [8,7,9]\nExplanation: The reversed segment begins at the head, so node 8 becomes the new head.\nConstraints \u0026 guarantees\n• n: 1 through 500 (inclusive)\n• Node.val: -500 through 500 (inclusive)\n• 1 \u003c= left \u003c= right \u003c= n\n• n denotes the list's node count\nJavaScript starter\nfunction reverseBetween(head, left, right) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/reverse-linked-list-ii/) | — |
| <PracticeProblem id={138} title={"Copy List with Random Pointer"} text={"Problem statement\nEach node has val, next, and random, where random points to any node in the same list or to null.\nCreate a deep copy and return its head. Every copied pointer must target a copied node with the\ncorresponding relationship; no copied pointer may point into the original list. Preserve all values\nand next order.\nInput \u0026 expected result\nAn empty input produces null. If examples use [value, randomIndex] pairs, randomIndex identifies\na zero-based position in the original list; null means no random target. The function receives node\nreferences, not those descriptive pairs.\nEXAMPLE 1\nInput: 2 -\u003e 8; node 2.random points to 8, node 8.random points to itself\nResult: a separate 2 -\u003e 8 list with the same random relationships\nExplanation: The copied nodes contain 2 and 8, but have new identities. The first copy targets\nthe second, and the second targets itself.\nEXAMPLE 2\nInput: one node with val = 6, next = null, random = null\nResult: one new node with val = 6 and both pointers null\nExplanation: Equal data does not allow returning the original node; the result must be a deep\ncopy.\nConstraints \u0026 guarantees\n• n: 0 through 1000 (inclusive)\n• Node.val: -10^4 through 10^4 (inclusive)\n• n is the node count. Each random reference is null or identifies an input-list node\nJavaScript starter\nfunction copyRandomList(head) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/copy-list-with-random-pointer/) | — |
| <PracticeProblem id={142} title={"Linked List Cycle II"} text={"Problem statement \u0026 expected result\nReturn the actual node reference at which a linked-list cycle begins, or null when no cycle exists. Preserve the\nlist. Example pos values describe the tail connection made by the judge and are not function arguments. Aim for\nconstant auxiliary space.\nEXAMPLE 1\nInput: head = [3,2,0,-4], pos = 1\nReturned node: index 1 (value 2)\nExplanation: Return the node at index 1, whose value is 2.\nEXAMPLE 2\nInput: head = [1,2], pos = 0\nReturned node: index 0 (value 1)\nExplanation: Return the head node; the cycle begins at index 0.\nConstraints \u0026 guarantees\n- The number of the nodes in the list is in the range [0, 10^4].\n- -10^5 \u003c= Node.val \u003c= 10^5\n- pos is -1 or a valid index in the linked-list.\nJavaScript starter\nfunction detectCycle(head) {\n// TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/linked-list-cycle-ii/) | — |
| <PracticeProblem id={143} title={"Reorder List"} text={"Problem statement\nReorder a singly linked list originally L0, L1, ..., Ln into L0, Ln, L1, Ln-1, L2, Ln-2, and so on. Modify\nthe list by changing links, not by changing node values. No result value is required; the original\nhead must lead to the rearranged sequence.\nInput \u0026 expected result\nThe endpoint alternation stops when all nodes have appeared exactly once. For an odd-length\ninput, the original middle node becomes the tail. The function modifies head's linked structure and\nshould not return an array representation.\nEXAMPLE 1\nInput: head = [1,2,3,4,5,6]\nAfter the call: [1,6,2,5,3,4]\nExplanation: The sequence alternates first and last remaining nodes: 1,6,2,5,3,4. Every original\nnode appears once.\nEXAMPLE 2\nInput: head = [2,4,6,8,10]\nAfter the call: [2,10,4,8,6]\nExplanation: The middle node 6 remains after the two outer pairs have been interleaved.\nConstraints \u0026 guarantees\n• Node.val: 1 through 1000 (inclusive)\n• List size: 1 through 5 * 10^4 nodes\nJavaScript starter\nfunction reorderList(head) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/reorder-list/) | — |
| <PracticeProblem id={148} title={"Sort List"} text={"Problem statement\nSort a singly linked list by ascending node value and return the sorted head. Retain every input\nnode, including duplicate values. The list may be empty. Aim for O(n log n) time and O(1) auxiliary\nspace.\nInput \u0026 expected result\nReturn a linked-list head after arranging values in nondecreasing order. Equal values must retain\ntheir multiplicity; deduplication is not requested. The time and space targets apply to the full\nsorting procedure, including any auxiliary data structures.\nEXAMPLE 1\nInput: head = [4,1,3,2]\nReturn list: [1,2,3,4]\nExplanation: The nodes' values in ascending order are 1,2,3,4, so the returned list follows that\nsequence.\nEXAMPLE 2\nInput: head = [3,1,3]\nReturn list: [1,3,3]\nExplanation: Both nodes with value 3 remain in the sorted result.\nConstraints \u0026 guarantees\n• Node.val: -10^5 through 10^5 (inclusive)\n• List size: 0 through 5 * 10^4 nodes\nJavaScript starter\nfunction sortList(head) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/sort-list/) | — |
| [LC 237 — Delete Node in a Linked List](https://leetcode.com/problems/delete-node-in-a-linked-list/) | Medium | [LeetCode](https://leetcode.com/problems/delete-node-in-a-linked-list/) | — |
| <PracticeProblem id={328} title={"Odd Even Linked List"} text={"Problem statement\nGroup the nodes at odd positions before the nodes at even positions in a singly linked list. Positions\nare one-based: the head is position 1. Keep the original relative order within each group. Rearrange\nnode links using O(n) time and O(1) extra space.\nInput \u0026 expected result\nReturn the new head. Grouping depends on positions, not whether node values are odd or even.\nEXAMPLE 1\nInput: head = [8,5,2,7,6]\nOutput list: [8,2,6,5,7]\nExplanation: Positions 1, 3, 5 come first, followed by positions 2 and 4.\nEXAMPLE 2\nInput: head = [4,9]\nOutput list: [4,9]\nExplanation: There is one node in each group, so the order stays the same.\nConstraints \u0026 guarantees\n• List node count: [0, 10^4]\n• -10^6 \u003c= Node.val \u003c= 10^6\nJavaScript starter\nfunction oddEvenList(head) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/odd-even-linked-list/) | — |
| [LC 382 — Linked List Random Node](https://leetcode.com/problems/linked-list-random-node/) | Medium | [LeetCode](https://leetcode.com/problems/linked-list-random-node/) | — |
| [LC 725 — Split Linked List in Parts](https://leetcode.com/problems/split-linked-list-in-parts/) | Medium | [LeetCode](https://leetcode.com/problems/split-linked-list-in-parts/) | — |
| [LC 2074 — Reverse Nodes in Even Length Groups](https://leetcode.com/problems/reverse-nodes-in-even-length-groups/) | Medium | [LeetCode](https://leetcode.com/problems/reverse-nodes-in-even-length-groups/) | — |
| <PracticeProblem id={25} title={"Reverse Nodes in k-Group"} text={"Problem statement\nReverse a linked list in consecutive groups of k nodes and return its new head. If fewer than k\nnodes remain at the end, leave that final group unchanged. k is positive and no larger than the list\nlength. Rearrange node links rather than changing stored values. Aim for constant additional\nspace.\nInput \u0026 expected result\nGroup boundaries are determined by counting k nodes at a time from the original head. Reverse\neach complete group independently. Return the first node of the resulting chain, and leave a short\ntrailing group in its original order.\nEXAMPLE 1\nInput: head = [1,2,3,4,5,6,7], k = 3\nReturn list: [3,2,1,6,5,4,7]\nExplanation: The first two complete groups reverse separately to 3,2,1 and 6,5,4. The remaining\nnode 7 stays at the end.\nEXAMPLE 2\nInput: head = [1,2,3,4,5], k = 2\nReturn list: [2,1,4,3,5]\nExplanation: The two complete pairs reverse, while the final single node is not a complete\ngroup.\nConstraints \u0026 guarantees\n• 1 \u003c= k \u003c= n \u003c= 5000\n• Node.val: 0 through 1000 (inclusive)\n• n denotes the list's node count\nJavaScript starter\nfunction reverseKGroup(head, k) {\n  // TODO: write your solution.\n}"} /> | Hard | [LeetCode](https://leetcode.com/problems/reverse-nodes-in-k-group/) | — |
| G38 — Locate the kth node counted from the tail. | Exercise | Linked lists. Related only: [LC 19](https://leetcode.com/problems/remove-nth-node-from-end-of-list/) - Remove Nth Node From End of List. Removes the nth node from the end instead of only returning it. | — |
| G39 — Sort a list containing only zeroes, ones, and twos. | Exercise | Linked lists. Related only: [LC 148](https://leetcode.com/problems/sort-list/) - Sort List. Sorts a general linked list; input is not restricted to three values. | — |
| G40 — Remove a loop while retaining every node. | Exercise | Linked lists. Related only: [LC 142](https://leetcode.com/problems/linked-list-cycle-ii/) - Linked List Cycle II. Finds the start of a cycle but does not remove it. | — |
| [CC — Linked List Operations (LISTOPS)](https://www.codechef.com/problems/LISTOPS) | Medium | — |  |
| [LC 1474 — Delete N Nodes After M Nodes of a Linked List](https://leetcode.com/problems/delete-n-nodes-after-m-nodes-of-a-linked-list/) | Easy | [LeetCode](https://leetcode.com/problems/delete-n-nodes-after-m-nodes-of-a-linked-list/) |  |
| [LC 147 — Insertion Sort List](https://leetcode.com/problems/insertion-sort-list/) | Medium | [LeetCode](https://leetcode.com/problems/insertion-sort-list/) |  |
| [LC 445 — Add Two Numbers II](https://leetcode.com/problems/add-two-numbers-ii/) | Medium | [LeetCode](https://leetcode.com/problems/add-two-numbers-ii/) |  |
| [LC 817 — Linked List Components](https://leetcode.com/problems/linked-list-components/) | Medium | [LeetCode](https://leetcode.com/problems/linked-list-components/) |  |
| [LC 1367 — Linked List in Binary Tree](https://leetcode.com/problems/linked-list-in-binary-tree/) | Medium | [LeetCode](https://leetcode.com/problems/linked-list-in-binary-tree/) |  |
| [LC 1721 — Swapping Nodes in a Linked List](https://leetcode.com/problems/swapping-nodes-in-a-linked-list/) | Medium | [LeetCode](https://leetcode.com/problems/swapping-nodes-in-a-linked-list/) |  |
| [CC — Reverse Linked List (REVLIST)](https://www.codechef.com/problems/REVLIST) | Medium | — |  |
| [CC — Merge Sorted Lists (MERGESORT)](https://www.codechef.com/problems/MERGESORT) | Medium | — |  |
| [LC 1206 — Design Skiplist](https://leetcode.com/problems/design-skiplist/) | Hard | [LeetCode](https://leetcode.com/problems/design-skiplist/) |  |
| [CC — Advanced Linked List (ADVLIST)](https://www.codechef.com/problems/ADVLIST) | Hard | — |  |

{/* END GENERATED PRACTICE PROBLEMS */}

## Related Topics

- [Two Pointers](../two-pointers/README.md) — fast/slow is a linked-list technique
- [Stack](../stack/README.md) — LRU = doubly linked list + hash map
- [Trees](../trees/README.md) — tree nodes are linked nodes with more pointers

[← Back to Home](../index.md) · © sparshjaswal

**Next:** [links in both directions](../doubly-linked-list/README.md).
