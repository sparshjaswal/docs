// Contract, worked example, and edge cases are documented in index.mdx.
const groupAnagrams = (strs) => {
  const map = new Map();

  for (const str of strs) {
    const freq = new Array(26).fill(0);

    for (const ch of str) {
      freq[ch.charCodeAt(0) - 97]++;
    }

    const key = freq.join(',');

    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(str);
  }

  return [...map.values()];
};

export { groupAnagrams };
