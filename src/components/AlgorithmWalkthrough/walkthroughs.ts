type Cell = { value: string; note?: string; tone?: 'plain' | 'active' | 'done' | 'muted' };
type Row = { label: string; cells: Cell[] };
type Step = { title: string; explanation: string; reason: string; rows: Row[] };
type Walkthrough = { title: string; goal: string; setup?: string; steps: Step[] };

function row(label: string, values: (string | number)[], notes: Record<number, string> = {}): Row {
  return {
    label,
    cells: values.map((value, i) => ({
      value: String(value),
      note: notes[i],
      tone: notes[i] ? 'active' : 'plain',
    })),
  };
}
function step(title: string, explanation: string, reason: string, ...rows: Row[]): Step {
  return { title, explanation, reason, rows };
}

const examples = {
  aiBackpropagation: {
    title: 'Send the loss signal back through two weights',
    goal: 'Follow x = 2, a = 3, b = 4, target = 10, with loss = (prediction − target)² / 2.',
    setup: 'Calculate all gradients using the original weights before updating either weight.',
    steps: [
      step('Forward: multiply twice', 'The hidden value is 3 × 2 = 6. The prediction is 4 × 6 = 24.', 'The forward pass saves values needed by the derivative rules.', row('Forward values', ['input 2', 'hidden 6', 'prediction 24'])),
      step('Measure the loss slope', 'Error is 24 − 10 = 14. Loss is 14² / 2 = 98; its slope with respect to prediction is 14.', 'For half the squared error, differentiating cancels the factor two.', row('At the output', ['target 10', 'error 14', 'loss 98'])),
      step('Back to the second weight', 'Changing b changes prediction by hidden = 6. Multiply 14 × 6 to get gradient 84.', 'The chain rule multiplies the local slope by the signal arriving from the loss.', row('Gradient for b', ['14 from loss', '× 6 from hidden', '= 84'])),
      step('Back to the first weight', 'Pass through b = 4 and input x = 2: 14 × 4 × 2 = 112.', 'Every operation on the route contributes its derivative.', row('Gradient for a', ['14', '× 4', '× 2', '= 112'])),
      step('Update together', 'With learning rate 0.001, a becomes 2.888 and b becomes 3.916. Recompute the loss to check the step.', 'Updating a weight too early would mix gradients from different forward passes.', row('New weights', ['a = 2.888', 'b = 3.916'])),
    ],
  },
  aiDataSplit: {
    title: 'Keep the final exam separate',
    goal: 'Separate learning, choosing, and final evaluation before preparing data.',
    setup: 'Each record belongs to one split. Related users or later time periods may need grouped or chronological splits instead of random rows.',
    steps: [
      step('Reserve the test set', 'Set aside the final evaluation examples before inspecting model results.', 'A final test can only estimate performance honestly while it stays outside model selection.', row('Roles', ['training', 'validation', 'test'], { 2: 'sealed until the final decision' })),
      step('Fit preparation on training data', 'Calculate missing-value replacements and scaling statistics from training examples only.', 'A transformation can leak information even when it never reads a target label.', row('Fit here', ['training'], { 0: 'learn preparation and model weights' }), row('Apply unchanged', ['validation', 'test'])),
      step('Choose with validation', 'Compare candidate settings using validation results. Keep a record of each experiment.', 'Repeated choices use validation information; they must not use the sealed test results.', row('Candidate choice', ['A', 'B', 'C'], { 1: 'chosen using validation' })),
      step('Evaluate the selected procedure', 'Freeze the procedure and evaluate once on the untouched test set. Report errors as well as the aggregate score.', 'Changing the model after seeing test failures turns that set into development data.', row('Final report', ['score', 'slice errors', 'uncertainty', 'limitations'])),
    ],
  },
  aiTraining: {
    title: 'One weight learns from one example',
    goal: 'Trace y-hat = w × x with x = 1, target y = 2, and loss (prediction − target)² / 2.',
    setup: 'Start with weight w = 1 and learning rate 0.2. This is one teaching step, not evidence that a model generalizes.',
    steps: [
      step('Predict', 'Multiply the input by the current weight: 1 × 1 = 1.', 'A forward pass evaluates the current model before any weights change.', row('Values', ['x = 1', 'w = 1', 'prediction = 1', 'target = 2'])),
      step('Measure the error', 'The prediction is one below the target. The loss is (1 − 2)² / 2 = 0.5.', 'The loss turns a task error into a number the training procedure can reduce.', row('Error and loss', ['error = −1', 'loss = 0.5'])),
      step('Calculate the gradient', 'For this loss, the gradient with respect to w is (w × x − y) × x = −1.', 'The gradient describes the local direction of increasing loss; the update moves the other way.', row('Gradient', ['dL/dw = −1'], { 0: 'negative slope at the current weight' })),
      step('Update and check', 'Set w = 1 − 0.2 × (−1) = 1.2. The new prediction is 1.2 and the loss is 0.32.', 'Training loss fell on this example. Separate validation examples are still needed to judge generalization.', row('After update', ['w = 1.2', 'prediction = 1.2', 'loss = 0.32'])),
    ],
  },
  aiRetrieval: {
    title: 'An answer needs evidence',
    goal: 'Answer “When does the library close on Friday?” using an allowed, current source.',
    setup: 'The example documents are fictional. Retrieved text is evidence to inspect, not authority to change system rules.',
    steps: [
      step('Receive the question', 'Identify the information needed: a location, day, and closing time.', 'A clear question helps distinguish a relevant document from one that merely shares a word.', row('Need', ['library', 'Friday', 'closing time'])),
      step('Filter and retrieve', 'Search only documents the user may access. Exclude private staff records.', 'Retrieval must preserve access rules before any content reaches the model.', row('Allowed candidates', ['D1: current hours', 'D2: book return rules', 'D3: old hours'])),
      step('Rank and inspect', 'D1 states Friday closing is 18:00. D2 does not answer the question; D3 is superseded.', 'A high similarity score alone does not establish freshness or support.', row('Evidence', ['D1: Friday 18:00'], { 0: 'current and directly relevant' })),
      step('Answer or abstain', 'Return “The library closes at 18:00 on Friday [D1].” If no allowed source supports the time, say that the information is missing.', 'A citation must point to evidence that supports the claim. A citation-shaped string is not enough.', row('Check', ['source exists', 'claim supported', 'user allowed', 'date current'])),
    ],
  },
  aiAgentLoop: {
    title: 'A tool call is a checked action',
    goal: 'Trace a bounded assistant that checks book availability before proposing a reservation.',
    setup: 'Tool choices in this illustration are predetermined. A real model proposes actions; application code enforces permissions and limits.',
    steps: [
      step('Propose', 'The assistant proposes a catalogue lookup for book B17.', 'A proposed action is structured data, not permission to execute arbitrary code.', row('Proposal', ['tool: lookup_book', 'book_id: B17'])),
      step('Validate and authorize', 'Check the tool name, argument types, current user, and remaining budget.', 'Invalid or unauthorized requests stop before execution.', row('Checks', ['known tool', 'valid input', 'allowed action', 'budget remains'])),
      step('Execute and observe', 'The trusted lookup tool returns “available”. Store that observation with its source and request ID.', 'Tool results may be incomplete or untrusted text; they do not rewrite the system policy.', row('Observation', ['B17: available'], { 0: 'read-only lookup completed' })),
      step('Require approval for a write', 'A reservation changes external state. Present the exact action to the user and wait for approval before running it.', 'A general goal does not replace checks around consequential actions.', row('Proposed write', ['reserve B17', 'for current user', 'approval required'])),
      step('Stop with a clear result', 'After completion, refusal, timeout, or exhausted budget, stop and explain the outcome.', 'A loop needs both a success condition and hard limits, even when each model response looks plausible.', row('Possible endings', ['completed', 'needs input', 'denied', 'budget exhausted'])),
    ],
  },
  matrixSpiral: {
    title: 'Peel a matrix one boundary at a time',
    goal: 'Read [[1,2,3], [4,5,6], [7,8,9]] clockwise without visiting a cell twice.',
    setup: 'Rows and columns start at 0. The remaining rectangle includes its top, bottom, left, and right bounds.',
    steps: [
      step(
        'Read the top row',
        'Visit 1, 2, 3 from left to right. Move top from row 0 to row 1.',
        'The whole old top row is finished, so it must be excluded from later boundaries.',
        row('Boundary visited', [1, 2, 3]),
        row('Remaining bounds', ['rows 1–2', 'columns 0–2']),
        row('Output so far', [1, 2, 3]),
      ),
      step(
        'Read the right column',
        'Visit 6, 9 from top to bottom. Move right from column 2 to column 1.',
        'Start at the new top row; including the old top row would repeat 3.',
        row('Boundary visited', [6, 9]),
        row('Remaining bounds', ['rows 1–2', 'columns 0–1']),
        row('Output so far', [1, 2, 3, 6, 9]),
      ),
      step(
        'Read the bottom row',
        'A row remains. Visit 8, 7 from right to left, then move bottom from row 2 to row 1.',
        'Use the reduced right bound so that 9 is not visited twice.',
        row('Boundary visited', [8, 7]),
        row('Remaining bounds', ['row 1', 'columns 0–1']),
        row('Output so far', [1, 2, 3, 6, 9, 8, 7]),
      ),
      step(
        'Read the left column',
        'A column remains. Visit 4 from bottom to top, then move left from column 0 to column 1.',
        'Both row bounds now equal 1, so this boundary contains only one cell.',
        row('Boundary visited', [4]),
        row('Remaining bounds', ['row 1', 'column 1']),
        row('Output so far', [1, 2, 3, 6, 9, 8, 7, 4]),
      ),
      step(
        'Read the center and stop',
        'The remaining top row contains only 5. After reading it, top becomes 2 while bottom is 1.',
        'The bounds have crossed, so no rows remain. Do not read another bottom row or left column.',
        row('Boundary visited', [5]),
        row('Remaining rectangle', ['empty: top > bottom']),
        row('Final output', [1, 2, 3, 6, 9, 8, 7, 4, 5]),
      ),
    ],
  },
  radixSort: {
    title: 'Sort one digit at a time',
    goal: 'Put [21, 13, 12] in ascending order by grouping on the ones digit, then the tens digit.',
    setup: 'Read each bucket from left to right. Keep the arrival order inside a bucket: that is what stable means.',
    steps: [
      step(
        'Read the ones digit',
        '21 goes into bucket 1, 13 into bucket 3, and 12 into bucket 2.',
        'Each number goes into exactly one bucket according to its ones digit.',
        row('Input order', [21, 13, 12]),
        row('Nonempty ones buckets', ['[21]', '[12]', '[13]'], { 0: 'digit 1', 1: 'digit 2', 2: 'digit 3' }),
      ),
      step(
        'Collect the ones buckets',
        'Read buckets 0 through 9. Empty buckets contribute nothing. The new order is [21, 12, 13].',
        'The numbers are now sorted by their ones digit, but the full numbers are not sorted yet.',
        row('After ones pass', [21, 12, 13], { 0: 'ones = 1', 1: 'ones = 2', 2: 'ones = 3' }),
      ),
      step(
        'Read the tens digit',
        'In this new order, 21 goes into bucket 2. Both 12 and 13 go into bucket 1, with 12 still first.',
        'Preserving arrival order keeps the ones digits sorted within each equal tens-digit group.',
        row('Nonempty tens buckets', ['[12, 13]', '[21]'], { 0: 'digit 1', 1: 'digit 2' }),
      ),
      step(
        'Collect the tens buckets',
        'Reading the buckets in digit order gives [12, 13, 21]. All numbers have at most two digits, so stop.',
        'The tens digit is now sorted; ties are already ordered by the ones digit from the previous stable pass.',
        row('Sorted result', [12, 13, 21]),
      ),
    ],
  },
  array: {
    title: 'An index is a position',
    goal: 'Read and update one item in [10, 20, 30].',
    steps: [
      step(
        'Start counting at zero',
        'The first item is at index 0. The last item is at index 2.',
        'An array index tells us where an item is, not what its value is.',
        row('Array', [10, 20, 30], { 0: 'index 0', 1: 'index 1', 2: 'index 2' }),
      ),
      step(
        'Read index 1',
        'items[1] returns 20.',
        'We already know the position, so we do not need to search through the array.',
        row('Array', [10, 20, 30], { 1: 'read this' }),
      ),
      step(
        'Update index 1',
        'After items[1] = 25, the array is [10, 25, 30].',
        'Updating a value keeps the same positions and the same array length.',
        row('Array', [10, 25, 30], { 1: 'changed' }),
      ),
    ],
  },
  binarySearch: {
    title: 'Find 7 in a sorted array',
    goal: 'Keep only the part that can still contain the target.',
    setup: 'Input: [1, 3, 5, 7, 9]. Target: 7. Bounds include both end positions.',
    steps: [
      step(
        'Check the middle',
        'The middle value is 5. It is smaller than 7.',
        'Every value to the left is also too small because the array is sorted.',
        row('Candidates', [1, 3, 5, 7, 9], { 0: 'left', 2: 'middle', 4: 'right' }),
      ),
      step(
        'Keep the right side',
        'Move left past 5. The remaining values are [7, 9].',
        'We remove 1, 3, and 5 together; none can be the target.',
        row('Remaining candidates', [7, 9], { 0: 'left + middle', 1: 'right' }),
      ),
      step(
        'Find the target',
        'The new middle value is 7, at index 3 in the original array.',
        'The middle equals the target, so the search stops.',
        row('Answer', [7], { 0: 'index 3' }),
      ),
    ],
  },
  slidingWindow: {
    title: 'Largest sum of two neighbors',
    goal: 'Find the best pair of consecutive values in [2, 1, 5, 1].',
    steps: [
      step(
        'Build the first window',
        '2 + 1 = 3. The best sum so far is 3.',
        'A window of size 2 must contain exactly two neighboring items.',
        row('Array', [2, 1, 5, 1], { 0: 'in window', 1: 'in window' }),
        row('State', [3, 3], { 0: 'sum', 1: 'best' }),
      ),
      step(
        'Slide right once',
        'Remove 2 and add 5: 3 − 2 + 5 = 6.',
        'The middle value 1 stays in the window, so we do not add it again.',
        row('Array', [2, 1, 5, 1], { 1: 'in window', 2: 'in window' }),
        row('State', [6, 6], { 0: 'sum', 1: 'best' }),
      ),
      step(
        'Slide right again',
        'Remove 1 and add 1. The sum stays 6. The answer is 6.',
        'All three size-2 windows have now been checked.',
        row('Array', [2, 1, 5, 1], { 2: 'in window', 3: 'in window' }),
        row('State', [6, 6], { 0: 'sum', 1: 'best' }),
      ),
    ],
  },
  twoPointers: {
    title: 'Find a pair that adds to 8',
    goal: 'Use the sorted order of [1, 2, 4, 6].',
    steps: [
      step(
        'Start at both ends',
        '1 + 6 = 7, which is too small.',
        'With 1 fixed, every other possible partner is at most 6. We can safely stop using 1.',
        row('Sorted array', [1, 2, 4, 6], { 0: 'left', 3: 'right' }),
      ),
      step(
        'Move left forward',
        '2 + 6 = 8. We found the pair.',
        'Moving left forward increases the smaller value while keeping the larger one.',
        row('Sorted array', [1, 2, 4, 6], { 1: 'left', 3: 'right' }),
      ),
      step(
        'Return the positions',
        'The answer is indices [1, 3], containing values [2, 6].',
        'Two different positions are used. This example uses zero-based indices.',
        row('Answer values', [2, 6], { 0: 'index 1', 1: 'index 3' }),
      ),
    ],
  },
  prefixSum: {
    title: 'Add a range without adding it again',
    goal: 'Find the sum from index 1 through index 3 in [2, 4, 1, 3].',
    steps: [
      step(
        'Start with zero',
        'prefix[0] = 0 means we have not included any values yet.',
        'The extra zero makes ranges that start at index 0 work with the same formula.',
        row('Input', [2, 4, 1, 3]),
        row('Prefix totals', [0]),
      ),
      step(
        'Store running totals',
        'The totals are 0, 2, 6, 7, 10.',
        'prefix[i] is the sum of the first i values, stopping before index i.',
        row('Prefix totals', [0, 2, 6, 7, 10], { 1: 'first 1', 4: 'first 4' }),
      ),
      step(
        'Subtract the unwanted part',
        'prefix[4] − prefix[1] = 10 − 2 = 8.',
        'The total 10 includes indices 0 through 3. Removing index 0 leaves 4 + 1 + 3.',
        row('Range values', [4, 1, 3]),
        row('Answer', [8]),
      ),
    ],
  },
  kadane: {
    title: 'Keep a useful running sum',
    goal: 'Find the largest nonempty subarray sum in [-2, 3, -1, 4].',
    steps: [
      step(
        'Start with the first value',
        'ending = -2 and best = -2.',
        'Starting with a real value keeps the answer correct even when every value is negative.',
        row('Values', [-2, 3, -1, 4], { 0: 'current' }),
        row('State', [-2, -2], { 0: 'ending', 1: 'best' }),
      ),
      step(
        'Start again at 3',
        'Choose 3 instead of -2 + 3 = 1.',
        'The negative sum behind us would only make the new subarray worse.',
        row('State', [3, 3], { 0: 'ending', 1: 'best' }),
      ),
      step(
        'Keep the useful prefix',
        '3 + (-1) = 2, which is better than starting at -1.',
        'A negative value does not always mean restart. Compare both choices.',
        row('State', [2, 3], { 0: 'ending', 1: 'best' }),
      ),
      step(
        'Extend to 4',
        '2 + 4 = 6. The best subarray is [3, -1, 4].',
        'ending is the best sum that ends here; best remembers the largest sum seen anywhere.',
        row('Winning subarray', [3, -1, 4]),
        row('State', [6, 6], { 0: 'ending', 1: 'best' }),
      ),
    ],
  },
  monotonicStack: {
    title: 'Find the next larger value',
    goal: 'For each value in [2, 1, 3], find the first larger value to its right.',
    setup: 'The stack stores indices. Below, each box shows a value and its index.',
    steps: [
      step(
        'Wait for a larger value',
        'Push index 0, whose value is 2.',
        'We have not seen anything to the right of 2 yet.',
        row('Waiting stack: bottom to top', [2], { 0: 'index 0' }),
      ),
      step(
        'Keep waiting',
        '1 is smaller than 2, so push index 1 as well.',
        'Neither waiting value has found a larger value yet.',
        row('Waiting stack: bottom to top', [2, 1], { 0: 'index 0', 1: 'index 1' }),
      ),
      step(
        'Resolve both answers',
        '3 is larger than 1 and 2. Pop both and set both answers to 3.',
        'Each popped item has found its first larger value to the right.',
        row('Answers so far', [3, 3, '?']),
        row('Waiting stack', [3], { 0: 'index 2' }),
      ),
      step(
        'Finish',
        'No value follows 3. Use -1 for its missing answer.',
        'Each index enters and leaves the stack at most once.',
        row('Final answers', [3, 3, -1]),
      ),
    ],
  },
  recursion: {
    title: 'Follow factorial(3)',
    goal: 'Multiply 3 × 2 × 1 by solving a smaller problem each time.',
    steps: [
      step(
        'Ask for a smaller answer',
        'factorial(3) waits for 3 × factorial(2).',
        'The input drops from 3 to 2, moving toward the stopping point.',
        row('Waiting calls', ['factorial(3)'], { 0: 'waiting' }),
      ),
      step(
        'Ask once more',
        'factorial(2) waits for 2 × factorial(1).',
        'Each call keeps its own input while the smaller call runs.',
        row('Waiting calls', ['factorial(3)', 'factorial(2)'], { 1: 'latest call' }),
      ),
      step(
        'Stop at the base case',
        'factorial(1) returns 1 without another call.',
        'A base case is an input we can answer directly.',
        row('Return value', [1], { 0: 'factorial(1)' }),
      ),
      step(
        'Return through the calls',
        'factorial(2) returns 2 × 1 = 2. Then factorial(3) returns 3 × 2 = 6.',
        'The most recent waiting call finishes first.',
        row('Answers', [1, 2, 6], { 0: 'for 1', 1: 'for 2', 2: 'for 3' }),
      ),
    ],
  },
  dp: {
    title: 'Choose houses without taking neighbors',
    goal: 'Find the largest total from [2, 7, 9, 3], with no adjacent houses.',
    steps: [
      step(
        'Use the first house',
        'The best total from [2] is 2.',
        'Before any houses the total is 0. At the first house, compare skipping it with taking it.',
        row('Best totals by number of houses', [0, 2], { 0: '0 houses', 1: '1 house' }),
      ),
      step(
        'Compare skip and take',
        'For house 2: max(2, 0 + 7) = 7.',
        'Taking 7 means we must skip its neighbor 2.',
        row('Best totals', [0, 2, 7]),
      ),
      step(
        'Reuse an earlier answer',
        'For house 3: max(7, 2 + 9) = 11.',
        'Taking 9 can safely use the best answer from two houses earlier.',
        row('Best totals', [0, 2, 7, 11], { 3: 'new total' }),
      ),
      step(
        'Keep the better choice',
        'For house 4: max(11, 7 + 3) = 11. Choose values 2 and 9.',
        'The best answer can skip the current house. We do not have to take every positive value.',
        row('Houses', [2, 7, 9, 3], { 0: 'take', 2: 'take' }),
        row('Best totals', [0, 2, 7, 11, 11]),
      ),
    ],
  },
  greedy: {
    title: 'Fit as many meetings as possible',
    goal: 'Choose meetings that do not overlap.',
    setup:
      'Meetings: A = [1, 3], B = [2, 5], C = [3, 4]. A meeting may start when the previous one ends.',
    steps: [
      step(
        'Sort by finish time',
        'The order is A, C, B because their finish times are 3, 4, 5.',
        'Finishing early leaves the most room for later meetings.',
        row('Meeting order', ['A: 1–3', 'C: 3–4', 'B: 2–5']),
      ),
      step(
        'Take A',
        'Choose A and remember finish time 3.',
        'Among the available first meetings, A ends earliest.',
        row('Chosen meetings', ['A: 1–3']),
      ),
      step(
        'Take C',
        'C starts at 3, so it can follow A. The new finish time is 4.',
        'Touching endpoints are allowed in this example.',
        row('Chosen meetings', ['A: 1–3', 'C: 3–4']),
      ),
      step(
        'Skip B',
        'B starts at 2, before the last chosen meeting ends. The answer is 2 meetings.',
        'This rule maximizes the number of meetings; it does not maximize arbitrary meeting profits.',
        row('Chosen meetings', ['A', 'C'], { 0: 'kept', 1: 'kept' }),
      ),
    ],
  },
  hashing: {
    title: 'Count letters in “aba”',
    goal: 'Use a Map to remember how many times each letter appears.',
    steps: [
      step(
        'Read a',
        'a has not appeared before. Store a → 1.',
        'A key identifies the thing we want to remember; its value stores the count.',
        row('Map entries', ['a → 1']),
      ),
      step(
        'Read b',
        'b is a new key. Store b → 1.',
        'Each different letter gets its own count.',
        row('Map entries', ['a → 1', 'b → 1']),
      ),
      step(
        'Read a again',
        'Look up a and change its count from 1 to 2.',
        'The same key updates the existing entry instead of creating a duplicate.',
        row('Map entries', ['a → 2', 'b → 1'], { 0: 'updated' }),
      ),
    ],
  },
  linkedList: {
    title: 'Follow links, one node at a time',
    goal: 'Read the list 10 → 20 → 30 → null.',
    steps: [
      step(
        'Start at the head',
        'head points to the first node, which holds 10.',
        'A node stores a value and a link to the next node.',
        row('Node order', [10, '→', 20, '→', 30, '→', 'null'], { 0: 'current' }),
      ),
      step(
        'Follow next',
        'current = current.next moves from 10 to 20.',
        'Unlike an array, a linked list has no direct index lookup.',
        row('Node order', [10, '→', 20, '→', 30, '→', 'null'], { 2: 'current' }),
      ),
      step(
        'Reach the final node',
        'Follow next again to read 30.',
        'We must follow the earlier links to reach this node.',
        row('Node order', [10, '→', 20, '→', 30, '→', 'null'], { 4: 'current' }),
      ),
      step(
        'Stop at null',
        'The next link is null. There are no more nodes.',
        'Check for null before trying to read a node value.',
        row('Current pointer', ['null'], { 0: 'stop' }),
      ),
    ],
  },
  stack: {
    title: 'The last item added leaves first',
    goal: 'Push A, push B, then pop one item.',
    steps: [
      step(
        'Push A',
        'Add A to the top of an empty stack.',
        'A stack lets us add and remove at one end.',
        row('Stack: bottom to top', ['A'], { 0: 'top' }),
      ),
      step(
        'Push B',
        'Add B above A. B is now the top.',
        'The newest item sits at the removal end.',
        row('Stack: bottom to top', ['A', 'B'], { 1: 'top' }),
      ),
      step(
        'Pop',
        'Remove and return B. A stays in the stack.',
        'This is last in, first out: LIFO.',
        row('Remaining stack', ['A'], { 0: 'top' }),
        row('Returned value', ['B']),
      ),
    ],
  },
  queue: {
    title: 'The first item added leaves first',
    goal: 'Add A, add B, then remove one item.',
    steps: [
      step(
        'Enqueue A',
        'Add A at the back of an empty queue.',
        'Enqueue means add to the back.',
        row('Queue: front to back', ['A'], { 0: 'front + back' }),
      ),
      step(
        'Enqueue B',
        'Add B after A.',
        'A arrived first, so A stays at the front.',
        row('Queue: front to back', ['A', 'B'], { 0: 'front', 1: 'back' }),
      ),
      step(
        'Dequeue',
        'Remove and return A. B becomes the front.',
        'This is first in, first out: FIFO.',
        row('Remaining queue', ['B'], { 0: 'front' }),
        row('Returned value', ['A']),
      ),
    ],
  },
  heap: {
    title: 'Put the smallest value at the root',
    goal: 'Insert 1 into a min-heap with root 2 and children 5 and 4.',
    setup: 'The boxes show level order: root first, then each level from left to right.',
    steps: [
      step(
        'Start with a valid heap',
        '2 is no larger than its children 5 and 4.',
        'A heap orders parents against children. Siblings do not have to be sorted.',
        row('Heap in level order', [2, 5, 4], { 0: 'root' }),
      ),
      step(
        'Add at the next open position',
        'Append 1 as the left child of 5.',
        'Adding at the end keeps the tree complete.',
        row('Heap in level order', [2, 5, 4, 1], { 1: 'parent', 3: 'new child' }),
      ),
      step(
        'Swap with 5',
        '1 is smaller than 5, so swap them.',
        'Only the new value and its ancestors can need fixing.',
        row('Heap in level order', [2, 1, 4, 5], { 0: 'parent', 1: 'moving up' }),
      ),
      step(
        'Swap with 2',
        '1 is smaller than 2, so swap once more. The root is now 1.',
        'Reading the minimum is now one root lookup. Insertion followed a path up the tree.',
        row('Heap in level order', [1, 2, 4, 5], { 0: 'minimum' }),
      ),
    ],
  },
  matrix: {
    title: 'Read a grid using row and column',
    goal: 'Visit every cell in [[1, 2], [3, 4]] in row order.',
    steps: [
      step(
        'Read row 0',
        'grid[0][0] is 1 and grid[0][1] is 2.',
        'The first index picks the row; the second picks a position inside that row.',
        row('Row 0', [1, 2], { 0: 'column 0', 1: 'column 1' }),
        row('Row 1', [3, 4]),
      ),
      step(
        'Read row 1',
        'grid[1][0] is 3 and grid[1][1] is 4.',
        'After the first row ends, move to the start of the next row.',
        row('Row 0', [1, 2]),
        row('Row 1', [3, 4], { 0: 'column 0', 1: 'column 1' }),
      ),
      step(
        'Finish the traversal',
        'The visit order is 1, 2, 3, 4.',
        'Two rows times two columns means four cells to visit.',
        row('Visit order', [1, 2, 3, 4]),
      ),
    ],
  },
  bits: {
    title: 'Compare one bit position at a time',
    goal: 'Apply AND, OR, and XOR to 5 (0101) and 3 (0011).',
    steps: [
      step(
        'Line up the bits',
        'The place values are 8, 4, 2, 1. So 0101 is 4 + 1 = 5.',
        'Bits in the same column represent the same place value.',
        row('5 in binary', [0, 1, 0, 1]),
        row('3 in binary', [0, 0, 1, 1]),
      ),
      step(
        'AND: both must be 1',
        '0101 & 0011 = 0001, which is 1.',
        'Only the rightmost position has a 1 in both inputs.',
        row('AND result', [0, 0, 0, 1], { 3: 'both 1' }),
      ),
      step(
        'OR: either may be 1',
        '0101 | 0011 = 0111, which is 7.',
        'Keep a 1 wherever at least one input has a 1.',
        row('OR result', [0, 1, 1, 1]),
      ),
      step(
        'XOR: the bits must differ',
        '0101 ^ 0011 = 0110, which is 6.',
        'Equal bits give 0. Different bits give 1.',
        row('XOR result', [0, 1, 1, 0]),
      ),
    ],
  },
  digits: {
    title: 'Read the digits of 123',
    goal: 'Find the digit sum without turning the number into text.',
    steps: [
      step(
        'Take the last digit',
        '123 % 10 = 3. Add 3 to the sum.',
        'Dividing by 10 leaves the final decimal digit as the remainder.',
        row('State', [123, 3], { 0: 'number', 1: 'sum' }),
      ),
      step(
        'Remove that digit',
        'Math.floor(123 / 10) = 12. Then 12 % 10 = 2.',
        'Integer division removes the final digit for a nonnegative integer.',
        row('State', [12, 5], { 0: 'number', 1: 'sum: 3 + 2' }),
      ),
      step(
        'Read the final digit',
        'The remaining number is 1. Add it to get 6.',
        'After removing 1, the number becomes 0 and the loop stops.',
        row('Final sum', [6], { 0: '3 + 2 + 1' }),
      ),
    ],
  },
  palindrome: {
    title: 'Does “level” read the same backward?',
    goal: 'Compare matching positions from the outside inward.',
    setup: 'This example uses plain English letters. JavaScript text with emoji needs extra care.',
    steps: [
      step(
        'Compare the ends',
        'The first and last letters are both l.',
        'If the ends differed, the word could not be a palindrome.',
        row('Letters', ['l', 'e', 'v', 'e', 'l'], { 0: 'left', 4: 'right' }),
      ),
      step(
        'Move inward',
        'The next pair is e and e. They also match.',
        'The outer pair is already checked, so we can ignore it.',
        row('Letters', ['l', 'e', 'v', 'e', 'l'], { 1: 'left', 3: 'right' }),
      ),
      step(
        'Meet in the middle',
        'Only v remains. “level” is a palindrome.',
        'A single middle letter always matches itself.',
        row('Letters', ['l', 'e', 'v', 'e', 'l'], { 2: 'middle' }),
      ),
    ],
  },
  bfs: {
    title: 'Visit nearby nodes first',
    goal: 'Use a queue to visit A, B, C, D in breadth-first order.',
    setup:
      'Edges: A—B, A—C, B—D. Neighbors are considered alphabetically. Mark a node when adding it to the queue.',
    steps: [
      step(
        'Start at A',
        'Mark A and put it in the queue.',
        'Marking when we add a node prevents duplicate queue entries.',
        row('Queue: front to back', ['A']),
      ),
      step(
        'Visit A',
        'Remove A, then add its unvisited neighbors B and C.',
        'Both are one edge away from the start.',
        row('Visited order', ['A']),
        row('Queue', ['B', 'C'], { 0: 'next' }),
      ),
      step(
        'Visit B',
        'Remove B and add D. C stays ahead of D.',
        'A queue finishes the nearer layer before the farther layer.',
        row('Visited order', ['A', 'B']),
        row('Queue', ['C', 'D'], { 0: 'next' }),
      ),
      step(
        'Finish C, then D',
        'The visit order is A, B, C, D. The shortest route to D is A → B → D.',
        'Visit order is not a path: consecutive visited nodes may have no edge between them.',
        row('Visited order', ['A', 'B', 'C', 'D']),
      ),
    ],
  },
  dfs: {
    title: 'Follow one branch before the next',
    goal: 'Visit A, B, D, C using depth-first search.',
    setup: 'Edges: A—B, A—C, B—D. Neighbors are considered alphabetically.',
    steps: [
      step(
        'Start at A',
        'Mark A as visited and follow its first unvisited neighbor B.',
        'Visited marks stop us from returning forever along the same edges.',
        row('Visit order', ['A']),
      ),
      step(
        'Go deeper through B',
        'Mark B and follow its unvisited neighbor D.',
        'DFS finishes this branch before considering C.',
        row('Visit order', ['A', 'B']),
      ),
      step(
        'Reach D and return',
        'D has no unvisited neighbors. Return to B, then A.',
        'The call stack remembers where each unfinished search should resume.',
        row('Visit order', ['A', 'B', 'D']),
      ),
      step(
        'Visit C',
        'Back at A, visit the remaining neighbor C. The order is A, B, D, C.',
        'DFS explores reachability; it does not guarantee a shortest path.',
        row('Visit order', ['A', 'B', 'D', 'C']),
      ),
    ],
  },
  tree: {
    title: 'One tree, three visit orders',
    goal: 'See where the root appears in each depth-first traversal.',
    setup: 'Tree: root 2, left child 1, right child 3. Each child is a leaf.',
    steps: [
      step(
        'Preorder: root first',
        'Visit the root, then left, then right: 2, 1, 3.',
        'Preorder is useful when a parent must be handled before its children.',
        row('Visit order', [2, 1, 3], { 0: 'root first' }),
      ),
      step(
        'Inorder: root between children',
        'Visit left, then root, then right: 1, 2, 3.',
        'This order is sorted here because this is a binary search tree.',
        row('Visit order', [1, 2, 3], { 1: 'root in middle' }),
      ),
      step(
        'Postorder: root last',
        'Visit left, then right, then root: 1, 3, 2.',
        'Postorder is useful when the parent answer needs both child answers.',
        row('Visit order', [1, 3, 2], { 2: 'root last' }),
      ),
    ],
  },
  backtracking: {
    title: 'Build subsets of [1, 2]',
    goal: 'Try a choice, explore it, then undo it.',
    steps: [
      step(
        'Start empty',
        'Record []. Then choose 1.',
        'The empty subset is a valid answer too.',
        row('Current subset', ['1'], { 0: 'chosen' }),
      ),
      step(
        'Explore the choice',
        'Record [1]. Choose 2 and record [1, 2].',
        'Move only to later positions so the same subset is not generated in a different order.',
        row('Current subset', [1, 2], { 1: 'chosen' }),
      ),
      step(
        'Undo the choices',
        'Remove 2, then remove 1. We are back at [].',
        'Undoing restores the state needed to explore the next branch.',
        row('Current subset', ['empty']),
      ),
      step(
        'Try the next branch',
        'Choose 2 and record [2]. The four answers are [], [1], [1, 2], [2].',
        'Every value has two choices: include it or leave it out.',
        row('All subsets', ['[]', '[1]', '[1, 2]', '[2]']),
      ),
    ],
  },
  bubbleSort: {
    title: 'Bubble sort: compare neighbors',
    goal: 'Sort [3, 1, 2] from smallest to largest.',
    steps: [
      step(
        'Compare 3 and 1',
        '3 is larger than 1, so swap them.',
        'Each comparison puts the larger of the two values on the right.',
        row('After swap', [1, 3, 2], { 0: 'swapped', 1: 'swapped' }),
      ),
      step(
        'Compare 3 and 2',
        'Swap again. The array becomes [1, 2, 3].',
        'After a full pass, the largest remaining value has reached the end.',
        row('After swap', [1, 2, 3], { 2: 'in final place' }),
      ),
      step(
        'Check the remaining pair',
        '1 and 2 are already in order. No swaps are needed.',
        'A pass with no swaps tells us the array is sorted.',
        row('Sorted array', [1, 2, 3]),
      ),
    ],
  },
  insertionSort: {
    title: 'Insertion sort: grow a sorted left side',
    goal: 'Sort [3, 1, 2] by inserting one item at a time.',
    steps: [
      step(
        'Treat the first item as sorted',
        'The left side [3] is already sorted.',
        'A one-item list cannot be out of order.',
        row('Array', [3, 1, 2], { 0: 'sorted part' }),
      ),
      step(
        'Insert 1',
        'Shift 3 right and place 1 before it.',
        'We make space before inserting the next value.',
        row('Array', [1, 3, 2], { 0: 'sorted part', 1: 'sorted part' }),
      ),
      step(
        'Insert 2',
        'Shift 3 right and place 2 between 1 and 3.',
        'The sorted part now includes every item.',
        row('Sorted array', [1, 2, 3]),
      ),
    ],
  },
  selectionSort: {
    title: 'Selection sort: choose the next smallest',
    goal: 'Sort [3, 1, 2] by filling positions from left to right.',
    steps: [
      step(
        'Find the smallest value',
        'Scan [3, 1, 2]. The smallest value is 1.',
        'We must check the whole remaining part before choosing its minimum.',
        row('Array', [3, 1, 2], { 1: 'minimum' }),
      ),
      step(
        'Fill the first position',
        'Swap 1 with 3. The first position is now final.',
        'Later work only needs the part to the right.',
        row('Array', [1, 3, 2], { 0: 'final' }),
      ),
      step(
        'Fill the second position',
        'The smallest of [3, 2] is 2. Swap it into position 1.',
        'Only one item remains after this swap, so the sort is complete.',
        row('Sorted array', [1, 2, 3]),
      ),
    ],
  },
  mergeSort: {
    title: 'Merge sort: split, then combine',
    goal: 'Sort [4, 1, 3, 2].',
    steps: [
      step(
        'Split into halves',
        'Split [4, 1, 3, 2] into [4, 1] and [3, 2].',
        'Each half is a smaller instance of the same sorting problem.',
        row('Left half', [4, 1]),
        row('Right half', [3, 2]),
      ),
      step(
        'Sort each half',
        'Split down to single values, then merge into [1, 4] and [2, 3].',
        'Single values are already sorted. Merging repeatedly chooses the smaller front value.',
        row('Sorted left', [1, 4]),
        row('Sorted right', [2, 3]),
      ),
      step(
        'Merge the sorted halves',
        'Choose 1, then 2, then 3, then the remaining 4.',
        'Only the two front values need comparison at each choice.',
        row('Sorted array', [1, 2, 3, 4]),
      ),
    ],
  },
  quickSort: {
    title: 'Quicksort: place a pivot',
    goal: 'Sort [3, 1, 2] using the last value as the pivot.',
    steps: [
      step(
        'Choose pivot 2',
        'Compare each earlier value with 2.',
        'Partitioning groups smaller values before the pivot and larger values after it.',
        row('Array', [3, 1, 2], { 2: 'pivot' }),
      ),
      step(
        'Move 1 to the left group',
        '1 is smaller than 2. Swap it with 3.',
        'The left group now contains the values known to be smaller than the pivot.',
        row('Array', [1, 3, 2], { 0: 'smaller', 2: 'pivot' }),
      ),
      step(
        'Place the pivot',
        'Swap 2 with 3 to get [1, 2, 3].',
        'The pivot is in its final position. Both remaining parts contain only one item.',
        row('Sorted array', [1, 2, 3], { 1: 'pivot placed' }),
      ),
    ],
  },
  heapSort: {
    title: 'Heapsort: move the maximum to the end',
    goal: 'Sort [2, 1, 3] using a max-heap.',
    steps: [
      step(
        'Build a max-heap',
        'Rearrange the values to [3, 1, 2].',
        'The largest value is at the root, index 0.',
        row('Heap in level order', [3, 1, 2], { 0: 'maximum' }),
      ),
      step(
        'Move 3 to the end',
        'Swap the first and last values: [2, 1, 3]. Exclude 3 from the heap.',
        'The largest value is now in its final sorted position.',
        row('Array', [2, 1, 3], { 0: 'heap root', 2: 'sorted' }),
      ),
      step(
        'Move 2 to its final place',
        'The remaining heap is [2, 1]. Swap them to get [1, 2, 3].',
        'Shrinking the heap grows the sorted part from right to left.',
        row('Sorted array', [1, 2, 3]),
      ),
    ],
  },
  countingSort: {
    title: 'Counting sort: count each value',
    goal: 'Sort the small nonnegative integers [2, 1, 2, 0].',
    steps: [
      step(
        'Count occurrences',
        '0 appears once, 1 appears once, and 2 appears twice.',
        'A small value range lets us use the values as count-array indices.',
        row('Counts', [1, 1, 2], { 0: 'value 0', 1: 'value 1', 2: 'value 2' }),
      ),
      step(
        'Read counts in value order',
        'Write one 0, one 1, and two 2s.',
        'Reading counts from smallest value to largest produces sorted values.',
        row('Sorted values', [0, 1, 2, 2]),
      ),
      step(
        'Know this version’s limit',
        'This trace sorts bare numbers. Sorting records stably needs output positions as well.',
        'Counts alone do not remember the original order of records with equal keys.',
        row('Output', [0, 1, 2, 2]),
      ),
    ],
  },
  shellSort: {
    title: 'Shell sort: reduce the gap',
    goal: 'Sort [4, 3, 2, 1] using gaps 2, then 1.',
    steps: [
      step(
        'Sort positions two apart',
        'Sort [4, 2] at positions 0 and 2, and [3, 1] at positions 1 and 3.',
        'Each gap-separated group gets an insertion-sort pass.',
        row('After gap 2', [2, 1, 4, 3]),
      ),
      step(
        'Reduce the gap to 1',
        'Insert 1 before 2, and 3 before 4.',
        'Gap 1 is an ordinary insertion-sort pass over the whole array.',
        row('After gap 1', [1, 2, 3, 4]),
      ),
      step(
        'Finish sorted',
        'The result is [1, 2, 3, 4].',
        'The gap sequence affects performance; Shell sort has no single bound for all gap choices.',
        row('Sorted array', [1, 2, 3, 4]),
      ),
    ],
  },
  linearSearch: {
    title: 'Check one item at a time',
    goal: 'Find 7 in [4, 9, 7]. The input does not need to be sorted.',
    steps: [
      step(
        'Check index 0',
        '4 is not 7. Continue.',
        'Without sorted order, we cannot rule out any later value.',
        row('Array', [4, 9, 7], { 0: 'current' }),
      ),
      step(
        'Check index 1',
        '9 is not 7. Continue.',
        'A larger value does not let us stop in an unsorted array.',
        row('Array', [4, 9, 7], { 1: 'current' }),
      ),
      step(
        'Check index 2',
        '7 matches. Return index 2.',
        'If the end were reached with no match, we would return -1.',
        row('Array', [4, 9, 7], { 2: 'found' }),
      ),
    ],
  },
  euclid: {
    title: 'Euclid: keep the same common divisor',
    goal: 'Find gcd(1071, 462) using remainders.',
    steps: [
      {
        title: 'Divide the larger number',
        explanation: '1071 = 2 × 462 + 147. Replace (1071, 462) with (462, 147).',
        reason:
          'A number divides both original values exactly if it divides the smaller value and the remainder.',
        rows: [
          {
            label: 'Pair',
            cells: [
              {
                value: '462',
              },
              {
                value: '147',
              },
            ],
          },
        ],
      },
      {
        title: 'Repeat with the smaller pair',
        explanation: '462 = 3 × 147 + 21. Keep (147, 21).',
        reason: 'The nonzero remainder is smaller than the divisor, so the problem shrinks.',
        rows: [
          {
            label: 'Pair',
            cells: [
              {
                value: '147',
              },
              {
                value: '21',
              },
            ],
          },
        ],
      },
      {
        title: 'Stop at remainder zero',
        explanation: '147 = 7 × 21 + 0. The last nonzero divisor is 21.',
        reason:
          '21 divides both original numbers. The common divisors were preserved at every step.',
        rows: [
          {
            label: 'GCD',
            cells: [
              {
                value: '21',
              },
            ],
          },
        ],
      },
    ],
  },
  dijkstra: {
    title: 'Dijkstra: settle the nearest vertex',
    goal: 'Directed edges: A→B cost 2, A→C cost 5, B→C cost 1. Start at A.',
    steps: [
      {
        title: 'Start with the source',
        explanation: 'A has distance 0. B and C have unknown distance ∞.',
        reason: 'A reaches itself without taking an edge.',
        rows: [
          {
            label: 'Distances',
            cells: [
              {
                value: 'A: 0',
              },
              {
                value: 'B: ∞',
              },
              {
                value: 'C: ∞',
              },
            ],
          },
        ],
      },
      {
        title: 'Settle A',
        explanation: 'Relax A→B and A→C: B becomes 2 and C becomes 5.',
        reason: 'Relax means keep the smaller of the old distance and this new route.',
        rows: [
          {
            label: 'Distances',
            cells: [
              {
                value: 'A: 0 settled',
              },
              {
                value: 'B: 2',
              },
              {
                value: 'C: 5',
              },
            ],
          },
        ],
      },
      {
        title: 'Settle B',
        explanation: 'B is the nearest unsettled vertex. Route A→B→C costs 2 + 1 = 3.',
        reason: 'All edges are nonnegative, so a farther unsettled vertex cannot improve B.',
        rows: [
          {
            label: 'Distances',
            cells: [
              {
                value: 'A: 0',
              },
              {
                value: 'B: 2 settled',
              },
              {
                value: 'C: 3',
              },
            ],
          },
        ],
      },
      {
        title: 'Settle C',
        explanation: 'The shortest route to C is A→B→C with total cost 3.',
        reason:
          'Do not finalize a vertex when it is merely discovered; wait until its minimum distance is settled.',
        rows: [
          {
            label: 'Result',
            cells: [
              {
                value: 'A → B → C',
              },
              {
                value: 'cost 3',
              },
            ],
          },
        ],
      },
    ],
  },
  bellmanFord: {
    title: 'Bellman–Ford: improve every reachable edge',
    goal: 'Edges in scan order: C→B cost −4, A→B cost 2, A→C cost 5.',
    steps: [
      {
        title: 'Initialize',
        explanation: 'Start A at 0; B and C at ∞.',
        reason: 'Only paths starting at A can improve a distance.',
        rows: [
          {
            label: 'Distances',
            cells: [
              {
                value: 'A: 0',
              },
              {
                value: 'B: ∞',
              },
              {
                value: 'C: ∞',
              },
            ],
          },
        ],
      },
      {
        title: 'First full pass',
        explanation: 'Skip C→B because C is not yet reachable. Then set B to 2 and C to 5.',
        reason: 'An edge processed early may need another pass after its source improves.',
        rows: [
          {
            label: 'Distances',
            cells: [
              {
                value: 'A: 0',
              },
              {
                value: 'B: 2',
              },
              {
                value: 'C: 5',
              },
            ],
          },
        ],
      },
      {
        title: 'Second full pass',
        explanation: 'C→B now offers 5 − 4 = 1, which improves B.',
        reason: 'With three vertices, a simple shortest path uses at most two edges.',
        rows: [
          {
            label: 'Distances',
            cells: [
              {
                value: 'A: 0',
              },
              {
                value: 'B: 1',
              },
              {
                value: 'C: 5',
              },
            ],
          },
        ],
      },
      {
        title: 'Check for a negative cycle',
        explanation: 'One extra scan makes no improvement, so the reachable distances are final.',
        reason:
          'An improvement after V−1 full passes signals a negative cycle reachable from the source.',
        rows: [
          {
            label: 'Result',
            cells: [
              {
                value: 'A → C → B',
              },
              {
                value: 'cost 1',
              },
            ],
          },
        ],
      },
    ],
  },
  kruskal: {
    title: 'Kruskal: join different components',
    goal: 'Undirected edges: AB=1, BC=2, AC=3, CD=4. Find a minimum spanning tree.',
    steps: [
      {
        title: 'Start with separate groups',
        explanation: 'Sort edges by weight: AB, BC, AC, CD.',
        reason: 'The next candidate is always the cheapest remaining edge.',
        rows: [
          {
            label: 'Components',
            cells: [
              {
                value: 'A',
              },
              {
                value: 'B',
              },
              {
                value: 'C',
              },
              {
                value: 'D',
              },
            ],
          },
        ],
      },
      {
        title: 'Accept AB, then BC',
        explanation: 'AB joins A and B. BC then joins their group with C.',
        reason: 'Each accepted edge connects two different components.',
        rows: [
          {
            label: 'Components',
            cells: [
              {
                value: 'A B C',
              },
              {
                value: 'D',
              },
            ],
          },
        ],
      },
      {
        title: 'Reject AC',
        explanation: 'A and C are already connected through B.',
        reason: 'Adding AC would create the cycle A–B–C–A.',
        rows: [
          {
            label: 'Accepted edges',
            cells: [
              {
                value: 'AB: 1',
              },
              {
                value: 'BC: 2',
              },
            ],
          },
        ],
      },
      {
        title: 'Accept CD',
        explanation: 'Join D to the other vertices. Total weight is 1 + 2 + 4 = 7.',
        reason:
          'A connected graph with four vertices needs three tree edges. For disconnected input, the result is a forest.',
        rows: [
          {
            label: 'Tree',
            cells: [
              {
                value: 'AB',
              },
              {
                value: 'BC',
              },
              {
                value: 'CD',
              },
              {
                value: 'total 7',
              },
            ],
          },
        ],
      },
    ],
  },
  cycleDetection: {
    title: 'Find a directed cycle',
    goal: 'Edges A→B, B→C, C→B. Track the current DFS path.',
    steps: [
      {
        title: 'Enter A',
        explanation: 'Mark A as active, then follow its edge to B.',
        reason: 'Active means a call is still waiting on the current search path.',
        rows: [
          {
            label: 'Active path',
            cells: [
              {
                value: 'A',
              },
            ],
          },
        ],
      },
      {
        title: 'Enter B and C',
        explanation: 'Follow B→C while B remains active.',
        reason: 'Do not mark B finished until its descendants have been processed.',
        rows: [
          {
            label: 'Active path',
            cells: [
              {
                value: 'A',
              },
              {
                value: 'B',
              },
              {
                value: 'C',
              },
            ],
          },
        ],
      },
      {
        title: 'Meet an active vertex',
        explanation: 'C points to B, which is already on this active path.',
        reason:
          'The path B→C plus C→B closes a directed cycle. A link to a finished vertex would not by itself prove a cycle.',
        rows: [
          {
            label: 'Cycle',
            cells: [
              {
                value: 'B → C → B',
              },
            ],
          },
        ],
      },
    ],
  },
  pascal: {
    title: 'Build Pascal’s triangle',
    goal: 'Start at row 0 and compute each new row from the previous row.',
    steps: [
      {
        title: 'Row 0',
        explanation: 'Start with one value: 1.',
        reason: 'Every row begins and ends with 1.',
        rows: [
          {
            label: 'Row 0',
            cells: [
              {
                value: '1',
              },
            ],
          },
        ],
      },
      {
        title: 'Rows 1 and 2',
        explanation: 'Row 1 is [1, 1]. The inner value of row 2 is 1 + 1 = 2.',
        reason: 'Each inner cell adds its two parents from the row above.',
        rows: [
          {
            label: 'Row 2',
            cells: [
              {
                value: '1',
              },
              {
                value: '2',
              },
              {
                value: '1',
              },
            ],
          },
        ],
      },
      {
        title: 'Row 3',
        explanation: 'The inner values are 1 + 2 = 3 and 2 + 1 = 3.',
        reason: 'Use the previous row, not partially updated values from this row.',
        rows: [
          {
            label: 'Row 3',
            cells: [
              {
                value: '1',
              },
              {
                value: '3',
              },
              {
                value: '3',
              },
              {
                value: '1',
              },
            ],
          },
        ],
      },
      {
        title: 'Row 4',
        explanation: 'The center is 3 + 3 = 6.',
        reason:
          'The entry at position k in row n counts ways to choose k items from n distinct items.',
        rows: [
          {
            label: 'Row 4',
            cells: [
              {
                value: '1',
              },
              {
                value: '4',
              },
              {
                value: '6',
              },
              {
                value: '4',
              },
              {
                value: '1',
              },
            ],
          },
        ],
      },
    ],
  },
  sieve: {
    title: 'Sieve: mark composite numbers',
    goal: 'Find primes up to 20. Neither 0 nor 1 is prime.',
    steps: [
      {
        title: 'Keep 2; cross out its larger multiples',
        explanation: 'Mark 4, 6, 8, 10, 12, 14, 16, 18, 20 as composite.',
        reason: 'Start at 2²; smaller positive multiples contain no new composite to mark.',
        rows: [
          {
            label: 'Still possible',
            cells: [
              {
                value: '2',
              },
              {
                value: '3',
              },
              {
                value: '5',
              },
              {
                value: '7',
              },
              {
                value: '9',
              },
              {
                value: '11',
              },
              {
                value: '13',
              },
              {
                value: '15',
              },
              {
                value: '17',
              },
              {
                value: '19',
              },
            ],
          },
        ],
      },
      {
        title: 'Keep 3; start at 9',
        explanation: 'Mark 9 and 15. The other multiples in range were already crossed out.',
        reason: 'Multiples below 3² have a smaller factor already processed.',
        rows: [
          {
            label: 'Still possible',
            cells: [
              {
                value: '2',
              },
              {
                value: '3',
              },
              {
                value: '5',
              },
              {
                value: '7',
              },
              {
                value: '11',
              },
              {
                value: '13',
              },
              {
                value: '17',
              },
              {
                value: '19',
              },
            ],
          },
        ],
      },
      {
        title: 'Stop after checking candidates through √20',
        explanation: 'The next unmarked candidate is 5, and 5² exceeds 20.',
        reason: 'Every composite number has a factor at most its square root.',
        rows: [
          {
            label: 'Primes',
            cells: [
              {
                value: '2',
              },
              {
                value: '3',
              },
              {
                value: '5',
              },
              {
                value: '7',
              },
              {
                value: '11',
              },
              {
                value: '13',
              },
              {
                value: '17',
              },
              {
                value: '19',
              },
            ],
          },
        ],
      },
    ],
  },
  newtonRoot: {
    title: 'Newton: refine a square-root estimate',
    goal: 'Estimate √9. Use next = (guess + 9 / guess) / 2, starting at 5.',
    steps: [
      {
        title: 'Begin above the root',
        explanation: 'The first estimate is 5; its square is 25.',
        reason: 'For positive input, start with a positive guess to avoid division by zero.',
        rows: [
          {
            label: 'Guess',
            cells: [
              {
                value: '5',
              },
            ],
          },
        ],
      },
      {
        title: 'Average guess and reciprocal estimate',
        explanation: '(5 + 9/5) / 2 = 3.4.',
        reason: 'The update comes from the tangent of f(x) = x² − 9.',
        rows: [
          {
            label: 'Guess',
            cells: [
              {
                value: '3.4',
              },
            ],
          },
        ],
      },
      {
        title: 'Repeat',
        explanation: '(3.4 + 9/3.4) / 2 ≈ 3.02353. Another step gives about 3.00009.',
        reason: 'The change becomes smaller near the root.',
        rows: [
          {
            label: 'Guesses',
            cells: [
              {
                value: '3.02353',
              },
              {
                value: '3.00009',
              },
            ],
          },
        ],
      },
      {
        title: 'Stop by tolerance',
        explanation:
          'Return an approximation when the change is small enough, with an iteration limit.',
        reason:
          'Floating-point estimates need a tolerance; exact equality is not a general stopping rule. Handle input 0 separately.',
        rows: [
          {
            label: 'Result',
            cells: [
              {
                value: 'approximately 3',
              },
            ],
          },
        ],
      },
    ],
  },
  kmeans: {
    title: 'k-means: assign, then average',
    goal: 'One-dimensional points [1, 2, 8, 9], with two initial centers at 1 and 8.',
    steps: [
      {
        title: 'Assign each point',
        explanation: '1 and 2 are closer to center 1. 8 and 9 are closer to center 8.',
        reason: 'Compare distance to each current center, with a defined tie-breaking rule.',
        rows: [
          {
            label: 'Groups',
            cells: [
              {
                value: '[1, 2]',
              },
              {
                value: '[8, 9]',
              },
            ],
          },
        ],
      },
      {
        title: 'Move each center to its mean',
        explanation: 'The first center becomes 1.5; the second becomes 8.5.',
        reason: 'The mean minimizes the sum of squared distances within a fixed group.',
        rows: [
          {
            label: 'Centers',
            cells: [
              {
                value: '1.5',
              },
              {
                value: '8.5',
              },
            ],
          },
        ],
      },
      {
        title: 'Assign again',
        explanation: 'Every point stays in the same group.',
        reason: 'No assignments change, so this run has converged.',
        rows: [
          {
            label: 'Groups',
            cells: [
              {
                value: '[1, 2]',
              },
              {
                value: '[8, 9]',
              },
            ],
          },
        ],
      },
      {
        title: 'Understand the limit',
        explanation: 'Different starting centers can lead to different local results.',
        reason:
          'State how you choose k, initialize centers, handle an empty group, and stop. Convergence does not guarantee a global optimum.',
        rows: [
          {
            label: 'Result',
            cells: [
              {
                value: 'centers 1.5 and 8.5',
              },
            ],
          },
        ],
      },
    ],
  },
  avlRotation: {
    title: 'AVL: repair a left-heavy chain',
    goal: 'Insert keys 30, 20, 10 into an empty binary search tree.',
    steps: [
      {
        title: 'Insert 30 and 20',
        explanation: '30 is the root, and 20 is its left child.',
        reason: 'Each left-subtree key must be smaller than its parent key.',
        rows: [
          {
            label: 'Tree',
            cells: [
              {
                value: 'root 30',
              },
              {
                value: 'left 20',
              },
            ],
          },
        ],
      },
      {
        title: 'Insert 10',
        explanation: '10 becomes the left child of 20. The root has a left-left imbalance.',
        reason: 'The left and right subtree heights at 30 now differ by 2.',
        rows: [
          {
            label: 'Chain',
            cells: [
              {
                value: '30 →left 20 →left 10',
              },
            ],
          },
        ],
      },
      {
        title: 'Rotate right at 30',
        explanation: '20 becomes the root; 10 stays left, and 30 becomes right.',
        reason: 'A rotation changes parent links but keeps the in-order sequence 10, 20, 30.',
        rows: [
          {
            label: 'Balanced tree',
            cells: [
              {
                value: 'left 10',
              },
              {
                value: 'root 20',
              },
              {
                value: 'right 30',
              },
            ],
          },
        ],
      },
      {
        title: 'Update heights',
        explanation: 'Recompute the old root’s height, then the new root’s height.',
        reason:
          'A left-right imbalance needs two rotations; one right rotation is not the answer to every case.',
        rows: [
          {
            label: 'Balance factors',
            cells: [
              {
                value: '10: 0',
              },
              {
                value: '20: 0',
              },
              {
                value: '30: 0',
              },
            ],
          },
        ],
      },
    ],
  },
  fenwickUpdate: {
    title: 'Fenwick tree: update the responsible ranges',
    goal: 'Use one-based tree positions for values [2, 4, 1, 3]. Add 5 to input position 3.',
    steps: [
      {
        title: 'Know the stored ranges',
        explanation: 'tree[1]=2, tree[2]=6, tree[3]=1, tree[4]=10.',
        reason: 'tree[i] stores the range ending at i with length lowbit(i).',
        rows: [
          {
            label: 'Tree',
            cells: [
              {
                value: '2',
              },
              {
                value: '6',
              },
              {
                value: '1',
              },
              {
                value: '10',
              },
            ],
          },
        ],
      },
      {
        title: 'Update position 3',
        explanation: 'Add 5 to tree[3], changing it from 1 to 6.',
        reason: 'lowbit(3)=1. The next responsible position is 3+1=4.',
        rows: [
          {
            label: 'Tree',
            cells: [
              {
                value: '2',
              },
              {
                value: '6',
              },
              {
                value: '6',
              },
              {
                value: '10',
              },
            ],
          },
        ],
      },
      {
        title: 'Update position 4',
        explanation: 'Add 5 to tree[4], changing it from 10 to 15.',
        reason: 'lowbit(4)=4. The next position is 8, outside this tree, so stop.',
        rows: [
          {
            label: 'Tree',
            cells: [
              {
                value: '2',
              },
              {
                value: '6',
              },
              {
                value: '6',
              },
              {
                value: '15',
              },
            ],
          },
        ],
      },
      {
        title: 'Query the first three values',
        explanation: 'Read tree[3]=6, then move to 3−lowbit(3)=2 and read tree[2]=6. Total 12.',
        reason: 'These disjoint ranges cover exactly positions 1 through 3.',
        rows: [
          {
            label: 'Prefix sum',
            cells: [
              {
                value: '2 + 4 + 6 = 12',
              },
            ],
          },
        ],
      },
    ],
  },
  hanoi: {
    title: 'Hanoi: move three disks',
    goal: 'Disk 1 is smallest. Move the stack from peg A to peg C, using B.',
    steps: [
      {
        title: 'Initial state',
        explanation: 'A holds disks 3, 2, 1 from bottom to top.',
        reason: 'Only the top disk can move, and it cannot land on a smaller disk.',
        rows: [
          {
            label: 'Pegs',
            cells: [
              {
                value: 'A: 3,2,1',
              },
              {
                value: 'B: empty',
              },
              {
                value: 'C: empty',
              },
            ],
          },
        ],
      },
      {
        title: 'Moves 1 and 2',
        explanation: 'Move disk 1 A→C, then disk 2 A→B.',
        reason: 'The smallest disk must move away before disk 2 can leave A.',
        rows: [
          {
            label: 'Pegs',
            cells: [
              {
                value: 'A: 3',
              },
              {
                value: 'B: 2',
              },
              {
                value: 'C: 1',
              },
            ],
          },
        ],
      },
      {
        title: 'Move 3',
        explanation: 'Move disk 1 C→B, placing it on disk 2.',
        reason: 'The two smaller disks are now together on the spare peg.',
        rows: [
          {
            label: 'Pegs',
            cells: [
              {
                value: 'A: 3',
              },
              {
                value: 'B: 2,1',
              },
              {
                value: 'C: empty',
              },
            ],
          },
        ],
      },
      {
        title: 'Move 4',
        explanation: 'Move disk 3 A→C.',
        reason: 'Both smaller disks are out of the way.',
        rows: [
          {
            label: 'Pegs',
            cells: [
              {
                value: 'A: empty',
              },
              {
                value: 'B: 2,1',
              },
              {
                value: 'C: 3',
              },
            ],
          },
        ],
      },
      {
        title: 'Moves 5 and 6',
        explanation: 'Move disk 1 B→A, then disk 2 B→C.',
        reason: 'Rebuild the smaller stack above disk 3.',
        rows: [
          {
            label: 'Pegs',
            cells: [
              {
                value: 'A: 1',
              },
              {
                value: 'B: empty',
              },
              {
                value: 'C: 3,2',
              },
            ],
          },
        ],
      },
      {
        title: 'Move 7',
        explanation: 'Move disk 1 A→C. The transfer is complete.',
        reason: 'The recurrence T(n)=2T(n−1)+1 gives 2³−1=7 moves for this three-peg task.',
        rows: [
          {
            label: 'Pegs',
            cells: [
              {
                value: 'A: empty',
              },
              {
                value: 'B: empty',
              },
              {
                value: 'C: 3,2,1',
              },
            ],
          },
        ],
      },
    ],
  },
  knightChoices: {
    title: 'Knight’s tour: explore legal choices',
    goal: 'Use zero-based (row, column) positions on an 8 × 8 board. This shows the search rule, not a complete tour.',
    steps: [
      {
        title: 'Start at (0, 0)',
        explanation: 'Mark (0, 0) visited. Its legal first moves are (1, 2) and (2, 1).',
        reason:
          'A knight changes one coordinate by 2 and the other by 1; reject positions outside the board.',
        rows: [
          {
            label: 'Path',
            cells: [
              {
                value: '(0, 0)',
              },
            ],
          },
        ],
      },
      {
        title: 'Try (1, 2)',
        explanation: 'Append (1, 2) and mark it visited.',
        reason: 'Every candidate must also be unvisited; a legal move alone is not enough.',
        rows: [
          {
            label: 'Path',
            cells: [
              {
                value: '(0, 0)',
              },
              {
                value: '(1, 2)',
              },
            ],
          },
        ],
      },
      {
        title: 'Explore and undo',
        explanation:
          'If a branch cannot visit every remaining square, unmark its last square and try another candidate.',
        reason: 'Undoing exactly the last choice restores the state for the next branch.',
        rows: [
          {
            label: 'Choice rule',
            cells: [
              {
                value: 'choose',
              },
              {
                value: 'explore',
              },
              {
                value: 'undo',
              },
            ],
          },
        ],
      },
      {
        title: 'Check completion',
        explanation:
          'A full tour visits 64 different squares. A closed tour also needs a legal move back to the start.',
        reason: 'Visiting 64 squares is different from merely returning to the start.',
        rows: [
          {
            label: 'Success condition',
            cells: [
              {
                value: '64 distinct positions',
              },
            ],
          },
        ],
      },
    ],
  },
  combinationsRepeat: {
    title: 'Choose with repetition',
    goal: 'Choose two scoops from flavors A, B, C. Order does not matter, and repeats are allowed.',
    steps: [
      {
        title: 'Choose the first flavor A',
        explanation: 'The second can be A, B, or C: AA, AB, AC.',
        reason: 'Keeping choices in nondecreasing order prevents counting BA again after AB.',
        rows: [
          {
            label: 'Groups',
            cells: [
              {
                value: 'AA',
              },
              {
                value: 'AB',
              },
              {
                value: 'AC',
              },
            ],
          },
        ],
      },
      {
        title: 'Choose the first flavor B',
        explanation: 'The second can now be B or C: BB, BC.',
        reason: 'A is skipped here because that unordered pair was already included.',
        rows: [
          {
            label: 'New groups',
            cells: [
              {
                value: 'BB',
              },
              {
                value: 'BC',
              },
            ],
          },
        ],
      },
      {
        title: 'Choose the first flavor C',
        explanation: 'Only CC remains. There are six groups in total.',
        reason: 'Choosing r items from n types with repetition gives C(n+r−1, r). Here C(4,2)=6.',
        rows: [
          {
            label: 'All groups',
            cells: [
              {
                value: 'AA',
              },
              {
                value: 'AB',
              },
              {
                value: 'AC',
              },
              {
                value: 'BB',
              },
              {
                value: 'BC',
              },
              {
                value: 'CC',
              },
            ],
          },
        ],
      },
    ],
  },
} satisfies Record<string, Walkthrough>;

export type WalkthroughName = keyof typeof examples;
export const walkthroughs: Record<WalkthroughName, Walkthrough> = examples;
