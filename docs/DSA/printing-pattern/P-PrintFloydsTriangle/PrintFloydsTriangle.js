// Contract, worked example, and edge cases are documented in index.mdx.
const printFloydsTriangle = (numRows) => {
  let current = 1;
  const rows = [];
  for (let i = 1; i <= numRows; i++) {
    const row = [];
    for (let j = 0; j < i; j++) {
      row.push(current);
      current++;
    }
    rows.push(row.join(' '));
  }
  return rows.join('\n');
};

export { printFloydsTriangle };
