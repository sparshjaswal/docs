---
id: dsa-trie-readme
title: "Trie"
slug: /DSA/trie/README
sidebar_label: "Trie"
---

import PracticeProblem from '@site/src/components/PracticeProblem';

# Trie

**Prerequisites:** strings, object references, `Map`, arrays used as stacks, and tree paths. A trie stores words by sharing their starting letters. For example, `cat` and `car` share the path `c → a`, then split into `t` and `r`.

To search for `cat`, follow one letter at a time. A flag marks where a complete word ends. Without that flag, you cannot tell a stored word from a prefix of a longer word.

```text
Words: car, cart, cat          [*] = a complete word ends here

(root)
  |
  c
  |
  a
 / \
r[*] t[*]                     car and cat end here
 |
 t[*]                        cart ends here
```

Read a path from the root to spell a word. The node reached by `ca` is not terminal, so `ca` is only a prefix. The `r` node is both a complete-word endpoint and the parent of another letter. Marking `car` must not stop a search for `cart`.

A flat `Set` is usually simpler for exact word membership alone. A trie earns its extra nodes when problems repeatedly ask about prefixes, branch over possible next letters, or share work among many word searches.

Use a trie for prefix search and autocomplete. Inserting or looking up a word of length L takes O(L) child lookups, assuming each child lookup is O(1). Listing all matching words also takes time for the results.

## Learning steps

An autocomplete box needs words beginning with a few typed letters. Sharing their first letters avoids storing every search path separately.

1. Trace car, cart, and cat through the shared branches.
2. Distinguish a prefix path from a complete-word marker.
3. Remove a word without removing a shared branch, then collect suggestions.

## Worked examples and answers {/* #workbook-practice */}

Attempt the linked [Practice Problems](#practice-problems) before opening their answers. See the [workbook guide](../../javascript/workbook.md) for the A–C exercise format.

### 39. Tries and prefix search {/* #workbook-39 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** distinguish a complete word from a shared prefix.

Use the `car`, `cart`, and `cat` diagram above to trace each path. A word query checks both the path and the terminal flag; a prefix query checks the path alone. The root may mark an empty word if the contract allows it.

The implementation uses `for...of`, so one edge represents a Unicode code point. It does not represent a UTF-16 code unit or a complete user-perceived character in every case. Case folding or normalization belongs in an explicit input policy.

Removing a word clears its terminal flag, then prunes only empty nonterminal nodes. A shared prefix must survive. Counts can support prefix-frequency queries only if insertion and deletion update them consistently. Autocomplete walks descendants after finding the prefix; its cost includes the returned text, so a UI should request a useful result limit.

**Worked example**

The complete implementation below treats stored words as a set: inserting a duplicate has no additional effect. The empty string is allowed, and the empty prefix always refers to the root. Suggestions use JavaScript string comparison order (alphabetical for lowercase English words). The limit must be a nonnegative integer. All traversals use loops, avoiding recursion depth limits on long words.

```js runnable
class Trie {
  root = { end: false, children: new Map() };
  insert(word) {
    let node = this.root;
    for (const character of word) {
      if (!node.children.has(character)) {
        node.children.set(character, { end: false, children: new Map() });
      }
      node = node.children.get(character);
    }
    node.end = true;
  }
  findNode(prefix) {
    let node = this.root;
    for (const character of prefix) {
      node = node.children.get(character);
      if (!node) return undefined;
    }
    return node;
  }
  has(word) { return this.findNode(word)?.end === true; }
  startsWith(prefix) { return this.findNode(prefix) !== undefined; }
  remove(word) {
    let node = this.root;
    const path = [];
    for (const character of word) {
      const child = node.children.get(character);
      if (!child) return false;
      path.push([node, character]);
      node = child;
    }
    if (!node.end) return false; // A prefix alone was never a stored word.
    node.end = false;
    for (let index = path.length - 1; index >= 0; index--) {
      if (node.end || node.children.size > 0) break;
      const [parent, character] = path[index];
      parent.children.delete(character);
      node = parent;
    }
    return true;
  }
  suggestions(prefix, limit = 10) {
    if (!Number.isInteger(limit) || limit < 0) throw new RangeError('Invalid limit');
    const start = this.findNode(prefix);
    if (!start || limit === 0) return [];
    const result = [];
    const stack = [[start, prefix]];
    while (stack.length > 0 && result.length < limit) {
      const [node, word] = stack.pop();
      if (node.end) result.push(word);
      const children = [...node.children.entries()].sort(([a], [b]) =>
        a < b ? -1 : a > b ? 1 : 0);
      // Reverse push order so the alphabetically first child is popped first.
      for (let index = children.length - 1; index >= 0; index--) {
        const [character, child] = children[index];
        stack.push([child, word + character]);
      }
    }
    return result;
  }
}

const trie = new Trie();
trie.insert('cart');
console.log(trie.has('car'), trie.startsWith('car'));
trie.insert('car');
console.log(trie.has('car'));
const words = new Trie();
for (const word of ['car', 'cart', 'cat']) words.insert(word);
console.log(words.suggestions('ca', 3).join(','));
console.log(words.remove('car'), words.has('car'), words.has('cart'));
console.log(words.suggestions('ca').join(','));
console.log(words.remove('ca'), words.remove('missing'));
words.insert('');
console.log(words.has(''), words.remove(''), words.has(''));
```

```text output
false true
true
car,cart,cat
true false true
cart,cat
false false
true true false
```

**Why the example works**

Inserting cart creates four edges and marks only the final node. Searching car reaches a real node whose terminal flag is false. Inserting car reuses the first three edges and changes that flag without disturbing cart.

For deletion, follow the path for car and clear its terminal flag. Its r node still has the t child used by cart, so pruning stops immediately. If you later delete cart, its t leaf becomes empty and is removed; the r node can then be removed too because car is no longer stored. Stop at the a node because its other t child still spells cat. A node is safe to remove **only when it is nonterminal and has no children**. This condition proves that deletion cannot destroy another word.

Autocomplete first locates ca, then explores its descendants. It reports terminal nodes, including car before its longer extension cart. Pushing children in reverse sorted order makes the stack visit them in sorted order. Every descendant path is visited once and each terminal node represents exactly one word, so suggestions are correct and have no duplicates.

Insertion, exact search, and deletion take O(L) expected child-map operations for a word of L code points. Deletion uses O(L) temporary path storage; iterative exact search uses O(1) working space. A trie built from S total input code points uses at most O(S + 1) nodes.

Autocomplete is **output-sensitive**: its work depends on visited descendants as well as the prefix length. For V visited nodes with at most A children each, child ordering costs up to O(V × A log A); lowercase English bounds A by 26. This teaching version also constructs strings while exploring. If the maximum resulting word length is M and the alphabet size is fixed, a conservative bound for string work and stored pending strings is O(VM), in addition to returned text. With an unbounded alphabet, include the A factor for generated child prefixes: O(VAM). Do not describe autocomplete as O(prefix length) regardless of results. For very large tries, keep a shared character path and traversal frames or precompute a small number of suggestions per node.

**Common mistakes:** using one shared child map for all nodes; forgetting the terminal flag; deleting an entire shared branch; recursively traversing words deep enough to overflow the stack; promising O(1) space while storing full pending prefixes.

</details>

Find **39A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-39-answer">
<summary>Check your reasoning and answer</summary>

For Node checks, add `import assert from "node:assert/strict";` at the top of your file. Browser and multi-file examples use the setup stated above.

**39A.** A path may exist only because it leads to a longer stored word. The terminal flag separates existence of a prefix from membership of a complete word.

**39B.** It is the path of zero edges, so it refers to the root. Every stored word has that prefix, even when the empty word itself is not stored.

**39C.** Locate the prefix once, then traverse its descendants. Count only terminal nodes. Repeated insertion marks the same terminal node and therefore does not create a duplicate word.

**Reference code**

Use the worked example above first if the answer calls its functions or classes. Run each lesson in its own `.mjs` file.

```js
function countPrefix(trie, prefix) {
  const start = trie.findNode(prefix);
  if (!start) return 0;
  const stack = [start];
  let count = 0;
  while (stack.length) {
    const node = stack.pop();
    if (node.end) count++;
    for (const child of node.children.values()) stack.push(child);
  }
  return count;
}
```

**Check the result**

```js
assert.equal(countPrefix(trie, "car"), 2);
assert.equal(countPrefix(trie, "cat"), 0);
trie.insert("car");
assert.equal(countPrefix(trie, ""), 2);
```

</details>

## More checks before practice

1. **Check:** after inserting only cart, what are `has('car')` and `startsWith('car')`?
2. **Apply:** insert car and cart, delete cart, and explain why car remains.
3. **Challenge:** support duplicate words and deletion of one occurrence. Which flag would become a count?

<details>
<summary>Hints</summary>

A prefix is not necessarily terminal. Pruning stops at a terminal node. Duplicate multiplicities need more information than true or false.

</details>

<details>
<summary>Answers</summary>

1. False and true: the path exists, but its endpoint is unmarked.
2. Removing the final t leaf reaches the r node, whose terminal flag is still true. The pruning loop stops there.
3. Replace `end` with a nonnegative occurrence count. Insertion increments it; removing one occurrence decrements it only if positive. A node can be pruned only when its count is zero and it has no children. If maintaining counts along each prefix too, update every ancestor consistently.

</details>

## Practice Problems

{/* BEGIN GENERATED PRACTICE PROBLEMS */}

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **39A — Why is a terminal flag required?** | **Must fix** | [Worked example](#workbook-39) | [Answer](#workbook-39-answer) |
| **39B — What is the empty prefix of a trie?** | **Must fix** | [Worked example](#workbook-39) | [Answer](#workbook-39-answer) |
| **39C — Write countPrefix(trie, prefix), counting distinct stored words under the prefix using an explicit stack.** | **Must fix** | [Worked example](#workbook-39) | [Answer](#workbook-39-answer) |
| <PracticeProblem id={208} title={"Implement Trie (Prefix Tree)"} text={"Problem statement\nImplement Trie for lowercase English words. The constructor makes an empty structure.\ninsert(word) stores a word, search(word) reports whether that exact word has been stored, and\nstartsWith(prefix) reports whether any stored word begins with prefix. A prefix alone does not\ncount as a complete word unless it was inserted.\nInput \u0026 expected result\nAll methods operate on the same stored collection across calls. Inserting an existing word is\nallowed and does not make searches ambiguous. search requires a word endpoint, whereas\nstartsWith may succeed at any prefix of an inserted word.\nEXAMPLE 1\nOperations: insert(\"code\"), search(\"cod\"), startsWith(\"cod\"), search(\"code\")\nQuery results: false, true, true\nExplanation: The prefix cod appears in code but was not inserted as a word. The full string code\nis present.\nEXAMPLE 2\nOperations: insert(\"a\"), insert(\"ab\"), search(\"a\"), startsWith(\"b\")\nQuery results: true, false\nExplanation: The shorter inserted word remains valid, and neither stored word begins with b.\nConstraints \u0026 guarantees\n• word.length, prefix.length: 1 through 2000 (inclusive)\n• word and prefix use a-z. Combined method calls: at most 3 * 10^4\nJavaScript starter\nclass Trie {\n  constructor() { /* TODO */ }\n  insert(word) { /* TODO */ }\n  search(word) { /* TODO */ }\n  startsWith(prefix) { /* TODO */ }\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/implement-trie-prefix-tree/) | — |
| <PracticeProblem id={211} title={"Design Add and Search Words Data Structure"} text={"Problem statement\nImplement WordDictionary with addWord(word) and search(word). Added words contain lowercase\nEnglish letters. A search pattern may also contain dots; each dot stands for exactly one arbitrary\nletter. search returns true when any stored word matches the entire pattern, including its length.\nThe constructor starts with no words.\nInput \u0026 expected result\nA dot never matches zero letters or several letters. Search must match the whole stored word, not\njust a prefix or substring. Return a boolean indicating existence; do not return the matching words\nor count them.\nEXAMPLE 1\nOperations: addWord(\"map\"), addWord(\"cap\"), search(\".ap\"), search(\"m..\"), search(\"ma\")\nQuery results: true, true, false\nExplanation: Both map and cap match .ap, map matches m.., and neither three-letter word\nmatches the two-letter pattern ma.\nEXAMPLE 2\nOperations: addWord(\"go\"), search(\"..\"), search(\"g..\")\nQuery results: true, false\nExplanation: Two dots match the two letters of go; g followed by two dots requires a word of\nlength three.\nConstraints \u0026 guarantees\n• word.length: 1 through 25 (inclusive)\n• Stored words use a-z\n• searches may additionally use dots. A search contains at most 2 dots. Combined method calls: at most\n10^4\nJavaScript starter\nclass WordDictionary {\n  constructor() { /* TODO */ }\n  addWord(word) { /* TODO */ }\n  search(word) { /* TODO */ }\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/design-add-and-search-words-data-structure/) | — |
| [LC 421 — Maximum XOR of Two Numbers in an Array](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/) | Medium | [LeetCode](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/) | — |
| <PracticeProblem id={648} title={"Replace Words"} text={"Problem statement \u0026 expected result\nReplace each sentence word with its shortest dictionary prefix, if one exists. Leave words without a matching\nprefix intact. Return the resulting words joined by spaces; matching uses lowercase letters.\nEXAMPLE 1\nInput: dictionary = [\"cat\",\"bat\",\"rat\"], sentence = \"the cattle was rattled by the battery\"\nOutput: \"the cat was rat by the bat\"\nExplanation: cattle, rattled and battery have dictionary prefixes cat, rat and bat.\nEXAMPLE 2\nInput: dictionary = [\"a\",\"b\",\"c\"], sentence = \"aadsfasf absbs bbab cadsfafs\"\nOutput: \"a a b c\"\nExplanation: The first matching one-letter root is also the shortest root.\nConstraints \u0026 guarantees\n- 1 \u003c= dictionary.length \u003c= 1000\n- 1 \u003c= dictionary[i].length \u003c= 100\n- dictionary[i] consists of only lower-case letters.\n- 1 \u003c= sentence.length \u003c= 10^6\n- sentence consists of only lower-case letters and spaces.\n- The number of words in sentence is in the range [1, 1000]\n- The length of each word in sentence is in the range [1, 1000]\n- Every two consecutive words in sentence will be separated by exactly one space.\n- sentence does not have leading or trailing spaces.\nJavaScript starter\nfunction replaceWords(dictionary, sentence) {\n// TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/replace-words/) | — |
| <PracticeProblem id={677} title={"Map Sum Pairs"} text={"Problem statement \u0026 expected result\nImplement a string-to-integer map. insert(key, val) sets a key's value, replacing its old value when present.\nsum(prefix) returns the total of current values whose keys start with prefix. Return zero when no keys match.\nEXAMPLE 1\nCreate MapSum; insert(\"apple\",3); sum(\"ap\"); insert(\"app\",2); sum(\"ap\").\nQuery results: [3,5]\nExplanation: Both keys start with ap, so their current values contribute.\nEXAMPLE 2\nCreate MapSum; insert(\"a\",2); insert(\"a\",5); sum(\"a\"); sum(\"b\").\nQuery results: [5,0]\nExplanation: The second insert replaces 2 with 5; no key starts with b.\nConstraints \u0026 guarantees\n- 1 \u003c= key.length, prefix.length \u003c= 50\n- key and prefix consist of only lowercase English letters.\n- 1 \u003c= val \u003c= 1000\n- At most 50 calls will be made to insert and sum.\nJavaScript starter\nclass MapSum {\nconstructor() { /* TODO */ }\ninsert(key, val) { /* TODO */ }\nsum(prefix) { /* TODO */ }\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/map-sum-pairs/) | — |
| <PracticeProblem id={1268} title={"Search Suggestions System"} text={"Problem statement \u0026 expected result\nAfter each successive character of searchWord is typed, return up to three product names beginning with the\ntyped prefix. Choose the lexicographically earliest matches. Return one suggestion list per prefix, including empty\nlists where nothing matches.\nEXAMPLE 1\nInput: products = [\"mobile\",\"mouse\",\"moneypot\",\"monitor\",\"mousepad\"], searchWord = \"mouse\"\nOutput: [[\"mobile\",\"moneypot\",\"monitor\"],[\"mobile\",\"moneypot\",\"monitor\"],[\"mouse\",\"mousepad\"\n],[\"mouse\",\"mousepad\"],[\"mouse\",\"mousepad\"]]\nExplanation: Suggestions narrow as the prefix grows from m to mouse.\nEXAMPLE 2\nInput: products = [\"havana\"], searchWord = \"havana\"\nOutput: [[\"havana\"],[\"havana\"],[\"havana\"],[\"havana\"],[\"havana\"],[\"havana\"]]\nExplanation: The sole product matches every typed prefix.\nConstraints \u0026 guarantees\n- 1 \u003c= products.length \u003c= 1000\n- 1 \u003c= products[i].length \u003c= 3000\n- 1 \u003c= sum(products[i].length) \u003c= 2 * 10^4\n- All the strings of products are unique.\n- products[i] consists of lowercase English letters.\n- 1 \u003c= searchWord.length \u003c= 1000\n- searchWord consists of lowercase English letters.\nJavaScript starter\nfunction suggestedProducts(products, searchWord) {\n// TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/search-suggestions-system/) | — |
| <PracticeProblem id={212} title={"Word Search II"} text={"Problem statement\nGiven a rectangular board of letters and a list words, return every listed word that can be formed\nby following horizontally or vertically adjacent cells. A cell may be used at most once within a\nword's path. Different words may reuse cells, and each found word should appear once in the\nresult. Return words in any order.\nInput \u0026 expected result\nEach word may start at any cell and may turn along its path. Diagonal moves are forbidden, and\ncell reuse is forbidden only within a single word search. Report a word once even when several\npaths spell it.\nEXAMPLE 1\nInput: board = [[\"c\",\"a\"],[\"t\",\"r\"]], words = [\"car\",\"cat\",\"art\"]\nOutput: [\"car\",\"art\"]\nExplanation: The paths c-a-r and a-r-t use adjacent cells. Spelling cat would require an illegal\ndiagonal move from a to t.\nEXAMPLE 2\nInput: board = [[\"a\",\"a\"]], words = [\"a\",\"aa\",\"aaa\"]\nOutput: [\"a\",\"aa\"]\nExplanation: One or two cells can spell the first two words, but three letters would require\nreusing a cell.\nConstraints \u0026 guarantees\n• m = board.length\n• n = board[r].length\n• m and n: 1 through 12\n• Word count: 1 through 3 * 10^4. Each word has 1 through 10 letters\n• Board cells and words use a-z. Dictionary entries do not repeat\nJavaScript starter\nfunction findWords(board, words) {\n  // TODO: write your solution.\n}"} /> | Hard | [LeetCode](https://leetcode.com/problems/word-search-ii/) | — |
| <PracticeProblem id={336} title={"Palindrome Pairs"} text={"Problem statement\nFind all ordered pairs of different indices i and j for which words[i] followed by words[j] forms a\npalindrome. Each input word is unique, but an empty word is allowed. Reversing a pair may\nproduce a different valid answer.\nInput \u0026 expected result\nReturn index pairs without duplicates. Required runtime: O(sum of all word lengths).\nEXAMPLE 1\nInput: words = [\"bat\",\"tab\",\"cat\"]\nOutput: [[0,1],[1,0]]\nExplanation: Both battab and tabbat read the same in either direction.\nEXAMPLE 2\nInput: words = [\"\", \"aba\", \"xyz\"]\nOutput: [[0,1],[1,0]]\nExplanation: Combining the empty word with aba in either order preserves its palindrome.\nConstraints \u0026 guarantees\n• 1 \u003c= words.length \u003c= 5000\n• 0 \u003c= words[i].length \u003c= 300\n• Words use lowercase English letters\nJavaScript starter\nfunction palindromePairs(words) {\n  // TODO: write your solution.\n}"} /> | Hard | [LeetCode](https://leetcode.com/problems/palindrome-pairs/) | — |
| <PracticeProblem id={588} title={"Design In-Memory File System"} text={"Problem statement\nImplement an in-memory FileSystem initially containing only /. ls(path) returns sorted immediate\nchild names for a directory, or a one-item list containing the file name for a file. mkdir(path)\ncreates the directory and any missing parents. addContentToFile(filePath, content) creates a new\nfile or appends to an existing file. readContentFromFile(filePath) returns its accumulated text.\nInput \u0026 expected result\nPaths are absolute. Operations use valid paths; a file's parent exists when content is added. Each\nexample starts with a new system.\nEXAMPLE 1\nOperations: mkdir(\"/notes\"),\naddContentToFile(\"/notes/a\", \"hi\"),\nls(\"/\"), readContentFromFile(\"/notes/a\")\nQuery results: [[\"notes\"],\"hi\"]\nExplanation: The root contains the notes directory and the file stores hi.\nEXAMPLE 2\nOperations: addContentToFile(\"/x\", \"a\"),\naddContentToFile(\"/x\", \"b\"), ls(\"/x\"),\nreadContentFromFile(\"/x\")\nQuery results: [[\"x\"],\"ab\"]\nExplanation: The second write appends, and listing a file returns its name.\nConstraints \u0026 guarantees\n• Paths are absolute, with / as the root.\n• Names use lowercase letters; path operations are valid.\n• A file and a directory cannot share the same path.\nPremium source: current numeric bounds could not be publicly verified.\nJavaScript starter\nclass FileSystem {\n  constructor() { /* TODO */ }\n  ls(path) { /* TODO */ }\n  mkdir(path) { /* TODO */ }\n  addContentToFile(filePath, content) { /* TODO */ }\n  readContentFromFile(filePath) { /* TODO */ }\n}"} /> | Hard · Premium | [LeetCode](https://leetcode.com/problems/design-in-memory-file-system/) | — |
| [LC 642 — Design Search Autocomplete System](https://leetcode.com/problems/design-search-autocomplete-system/) | Hard · Premium | [LeetCode](https://leetcode.com/problems/design-search-autocomplete-system/) | — |
| [LC 1803 — Count Pairs With XOR in a Range](https://leetcode.com/problems/count-pairs-with-xor-in-a-range/) | Hard | [LeetCode](https://leetcode.com/problems/count-pairs-with-xor-in-a-range/) | — |
| G18 — Find a contiguous subarray with maximum XOR. | Exercise | Bits and mathematics. Requires a contiguous subarray; LeetCode 421 instead chooses two array values. | — |

{/* END GENERATED PRACTICE PROBLEMS */}

## References

- [Wikipedia](https://en.wikipedia.org/wiki/Trie)
- [YouTube](https://www.youtube.com/watch?v=zIjfhVPRZCg&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=7&t=0s)

**Next:** [backtracking](../backtracking/README.md).
