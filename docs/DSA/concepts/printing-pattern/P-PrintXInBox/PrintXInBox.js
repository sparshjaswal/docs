// Print an X pattern inside a square box using '#'.
// Returns an array of strings, one string per row.

const printXInBox = length => {
  if (length <= 0) return [];

  const rows = [];

  for (let row = 0; row < length; row++) {
    let line = "";
    for (let col = 0; col < length; col++) {
      const border = row === 0 || col === 0 || row === length - 1 || col === length - 1;
      const diagonal = row === col || row + col === length - 1;
      line += border || diagonal ? "#" : " ";
    }
    rows.push(line);
  }

  return rows;
};

console.log(printXInBox(7));
console.log(printXInBox(10));

export { printXInBox };
