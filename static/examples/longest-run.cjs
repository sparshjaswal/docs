// Complete standard-input solution for assessment 1.
function longestRun(scores, threshold) {
  let current = 0;
  let best = 0;
  for (const score of scores) {
    current = score >= threshold ? current + 1 : 0;
    best = Math.max(best, current);
  }
  return best;
}

function solveRuns(input) {
  if (input.trim() === '') return '';
  const tokens = input.trim().split(/\s+/);
  let position = 0;
  const testCases = Number(tokens[position++]);
  const answers = [];
  for (let test = 0; test < testCases; test++) {
    const length = Number(tokens[position++]);
    const threshold = Number(tokens[position++]);
    const scores = [];
    for (let index = 0; index < length; index++) {
      scores.push(Number(tokens[position++]));
    }
    answers.push(String(longestRun(scores, threshold)));
  }
  return answers.join('\n');
}

process.stdout.write(solveRuns(require('node:fs').readFileSync(0, 'utf8')));
