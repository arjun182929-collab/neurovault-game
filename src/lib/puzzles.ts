export type PuzzleType = 'logic' | 'pattern' | 'memory' | 'fake_answer' | 'hidden_ui' | 'reverse_thinking';
export type Difficulty = 'easy' | 'hard' | 'extreme' | 'insane' | 'impossible';

export interface PuzzleOption {
  id: string;
  label: string;
  value: string;
  isCorrect: boolean;
  isTrap?: boolean;
}

export interface MemoryItem {
  id: string;
  emoji: string;
  position: number;
}

export interface HiddenElement {
  id: string;
  type: 'button' | 'swipe' | 'shake' | 'long_press' | 'triple_tap';
  position: { x: number; y: number };
  size: number;
  hint: string;
}

export interface Puzzle {
  id: number;
  level: number;
  type: PuzzleType;
  difficulty: Difficulty;
  title: string;
  question: string;
  options?: PuzzleOption[];
  correctAnswer?: string;
  hint: string;
  timeLimit: number;
  memoryItems?: MemoryItem[];
  memoryDisplayTime?: number;
  hiddenElements?: HiddenElement[];
  reverseLogic?: string;
  patternSequence?: string[];
  patternAnswer?: string;
  explanation?: string;
  fakeAnswerIndex?: number;
}

export const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; color: string; glow: string; levelRange: [number, number] }> = {
  easy: { label: 'Easy', color: 'text-green-400', glow: 'shadow-green-500/20', levelRange: [1, 10] },
  hard: { label: 'Hard', color: 'text-yellow-400', glow: 'shadow-yellow-500/20', levelRange: [11, 30] },
  extreme: { label: 'Extreme', color: 'text-orange-400', glow: 'shadow-orange-500/20', levelRange: [31, 60] },
  insane: { label: 'Insane', color: 'text-red-400', glow: 'shadow-red-500/20', levelRange: [61, 100] },
  impossible: { label: 'Impossible Vault', color: 'text-purple-400', glow: 'shadow-purple-500/20', levelRange: [101, 150] },
};

export const PUZZLES: Puzzle[] = [
  // ===== EASY (1-10) =====
  // Level 1 - Logic
  {
    id: 1, level: 1, type: 'logic', difficulty: 'easy',
    title: 'First Step',
    question: 'If all Bloops are Razzies, and all Razzies are Lazzies, are all Bloops definitely Lazzies?',
    options: [
      { id: 'a', label: 'A', value: 'Yes, definitely', isCorrect: true },
      { id: 'b', label: 'B', value: 'Not necessarily', isCorrect: false },
      { id: 'c', label: 'C', value: 'Only some Bloops', isCorrect: false },
      { id: 'd', label: 'D', value: 'Cannot be determined', isCorrect: false },
    ],
    hint: 'Think about transitive logic - if A→B and B→C...',
    timeLimit: 30,
    explanation: 'This is a classic syllogism. If Bloops ⊆ Razzies and Razzies ⊆ Lazzies, then Bloops ⊆ Lazzies by transitivity.',
  },
  // Level 2 - Pattern
  {
    id: 2, level: 2, type: 'pattern', difficulty: 'easy',
    title: 'Number Sense',
    question: 'What comes next in the sequence?\n2, 4, 8, 16, ?',
    options: [
      { id: 'a', label: 'A', value: '24', isCorrect: false },
      { id: 'b', label: 'B', value: '30', isCorrect: false },
      { id: 'c', label: 'C', value: '32', isCorrect: true },
      { id: 'd', label: 'D', value: '28', isCorrect: false },
    ],
    hint: 'Each number is multiplied by the same value.',
    timeLimit: 20,
    explanation: 'The sequence doubles each time: 2×2=4, 4×2=8, 8×2=16, 16×2=32.',
  },
  // Level 3 - Fake Answer
  {
    id: 3, level: 3, type: 'fake_answer', difficulty: 'easy',
    title: 'Don\'t Be Fooled',
    question: 'A farmer has 17 sheep. All but 9 die. How many sheep does the farmer have left?',
    options: [
      { id: 'a', label: 'A', value: '8', isCorrect: false, isTrap: true },
      { id: 'b', label: 'B', value: '0', isCorrect: false, isTrap: true },
      { id: 'c', label: 'C', value: '9', isCorrect: true },
      { id: 'd', label: 'D', value: '17', isCorrect: false, isTrap: true },
    ],
    hint: 'Read carefully: "All but 9 die" means...',
    timeLimit: 15,
    explanation: '"All but 9 die" means 9 survive! The math is a distractor.',
  },
  // Level 4 - Reverse Thinking
  {
    id: 4, level: 4, type: 'reverse_thinking', difficulty: 'easy',
    title: 'Flip It',
    question: 'Which button should you NOT press to continue?',
    reverseLogic: 'Press the correct answer button - but since it says NOT, the actual correct action is to press the answer that IS correct.',
    options: [
      { id: 'a', label: 'A', value: 'Press me to lose', isCorrect: true },
      { id: 'b', label: 'B', value: 'Don\'t press this', isCorrect: false },
      { id: 'c', label: 'C', value: 'Skip this one', isCorrect: false },
      { id: 'd', label: 'D', value: 'Wrong button', isCorrect: false },
    ],
    hint: 'The question tells you NOT to press the correct answer. So you MUST press it to pass.',
    timeLimit: 20,
    explanation: 'Reverse psychology! "NOT press" the correct answer means you SHOULD press it.',
  },
  // Level 5 - Logic
  {
    id: 5, level: 5, type: 'logic', difficulty: 'easy',
    title: 'Age Puzzle',
    question: 'Tom is 5 years older than Jerry. In 3 years, Tom will be twice as old as Jerry. How old is Jerry now?',
    options: [
      { id: 'a', label: 'A', value: '1', isCorrect: false },
      { id: 'b', label: 'B', value: '2', isCorrect: true },
      { id: 'c', label: 'C', value: '3', isCorrect: false },
      { id: 'd', label: 'D', value: '4', isCorrect: false },
    ],
    hint: 'Set up: T = J + 5 and T + 3 = 2(J + 3)',
    timeLimit: 45,
    explanation: 'T = J + 5, T + 3 = 2J + 6 → J + 5 + 3 = 2J + 6 → J + 8 = 2J + 6 → J = 2.',
  },
  // Level 6 - Pattern
  {
    id: 6, level: 6, type: 'pattern', difficulty: 'easy',
    title: 'Shape Logic',
    question: 'What comes next?\n△ ○ △ △ ○ △ △ △ ○ ?',
    options: [
      { id: 'a', label: 'A', value: '△', isCorrect: true },
      { id: 'b', label: 'B', value: '○', isCorrect: false },
      { id: 'c', label: 'C', value: '□', isCorrect: false },
      { id: 'd', label: 'D', value: '◇', isCorrect: false },
    ],
    hint: 'Count the triangles between each circle.',
    timeLimit: 25,
    explanation: 'Pattern: 1△, ○, 2△, ○, 3△, ○, 4△... Next is △.',
  },
  // Level 7 - Memory
  {
    id: 7, level: 7, type: 'memory', difficulty: 'easy',
    title: 'Flash Recall',
    question: 'Memorize the sequence, then answer.',
    memoryItems: [
      { id: '1', emoji: '🧠', position: 0 },
      { id: '2', emoji: '⚡', position: 1 },
      { id: '3', emoji: '🔮', position: 2 },
      { id: '4', emoji: '💎', position: 3 },
    ],
    memoryDisplayTime: 3000,
    options: [
      { id: 'a', label: 'A', value: '🧠⚡🔮💎', isCorrect: true },
      { id: 'b', label: 'B', value: '⚡🧠💎🔮', isCorrect: false },
      { id: 'c', label: 'C', value: '🧠🔮⚡💎', isCorrect: false },
      { id: 'd', label: 'D', value: '💎⚡🔮🧠', isCorrect: false },
    ],
    hint: 'First was a brain, second was lightning...',
    timeLimit: 30,
    explanation: 'The sequence was: 🧠⚡🔮💎',
  },
  // Level 8 - Fake Answer
  {
    id: 8, level: 8, type: 'fake_answer', difficulty: 'easy',
    title: 'Math Trap',
    question: 'If you have 6 apples and take away 4, how many do you have?',
    options: [
      { id: 'a', label: 'A', value: '2', isCorrect: false, isTrap: true },
      { id: 'b', label: 'B', value: '4', isCorrect: true },
      { id: 'c', label: 'C', value: '6', isCorrect: false, isTrap: true },
      { id: 'd', label: 'D', value: '10', isCorrect: false },
    ],
    hint: '"Take away 4" - who has the 4 apples now?',
    timeLimit: 15,
    explanation: 'YOU took 4 apples, so YOU have 4. Classic word trick!',
  },
  // Level 9 - Hidden UI
  {
    id: 9, level: 9, type: 'hidden_ui', difficulty: 'easy',
    title: 'Find It',
    question: 'The answer is hidden somewhere on this screen. Look carefully.',
    hiddenElements: [
      { id: 'h1', type: 'button', position: { x: 75, y: 80 }, size: 40, hint: 'Check the bottom-right corner...' },
    ],
    correctAnswer: 'h1',
    hint: 'Not everything is visible at first glance...',
    timeLimit: 30,
    explanation: 'A hidden button was in the bottom-right corner!',
  },
  // Level 10 - Logic
  {
    id: 10, level: 10, type: 'logic', difficulty: 'easy',
    title: 'Gatekeeper',
    question: 'You reach two doors. One leads to freedom, one to doom. Two guards: one always lies, one always tells truth. You can ask ONE guard ONE question.\n\nWhat do you ask?',
    options: [
      { id: 'a', label: 'A', value: '"Which door leads to freedom?"', isCorrect: false },
      { id: 'b', label: 'B', value: '"What would the other guard say?"', isCorrect: false },
      { id: 'c', label: 'C', value: '"If I asked the other guard which door is safe, what would they say?" → Then pick the OPPOSITE', isCorrect: true },
      { id: 'd', label: 'D', value: '"Are you the truthful guard?"', isCorrect: false },
    ],
    hint: 'You need to account for both the liar and the truth-teller simultaneously.',
    timeLimit: 60,
    explanation: 'By asking what the OTHER guard would say, both guards point to the wrong door. Truth-teller truthfully reports the liar\'s lie. Liar lies about the truth-teller\'s truth. Either way, pick the opposite door!',
  },

  // ===== HARD (11-30) =====
  // Level 11 - Pattern
  {
    id: 11, level: 11, type: 'pattern', difficulty: 'hard',
    title: 'Code Breaker',
    question: 'Decode: 8 → 5, 15 → 6, 23 → 5, 42 → ?',
    options: [
      { id: 'a', label: 'A', value: '6', isCorrect: true },
      { id: 'b', label: 'B', value: '8', isCorrect: false },
      { id: 'c', label: 'C', value: '4', isCorrect: false },
      { id: 'd', label: 'D', value: '7', isCorrect: false },
    ],
    hint: 'Sum the digits of the number.',
    timeLimit: 30,
    explanation: '4 + 2 = 6. The answer is the sum of the digits: 8→8, 1+5=6, 2+3=5, 4+2=6.',
  },
  // Level 12 - Logic
  {
    id: 12, level: 12, type: 'logic', difficulty: 'hard',
    title: 'Island Logic',
    question: 'On an island, knights always tell truth, knaves always lie. A says "We are both knaves."\n\nWhat is A?',
    options: [
      { id: 'a', label: 'A', value: 'Knight', isCorrect: false },
      { id: 'b', label: 'B', value: 'Knave', isCorrect: true },
      { id: 'c', label: 'C', value: 'Could be either', isCorrect: false },
      { id: 'd', label: 'D', value: 'Not enough info', isCorrect: false },
    ],
    hint: 'If A were a knight, could the statement "We are both knaves" be true?',
    timeLimit: 45,
    explanation: 'A knight can\'t say "I am a knave" (that\'s a paradox). So A must be a knave. Since A\'s statement "We are BOTH knaves" is a lie, B must be a knight.',
  },
  // Level 13 - Memory
  {
    id: 13, level: 13, type: 'memory', difficulty: 'hard',
    title: 'Matrix Flash',
    question: 'Memorize the grid, then answer which symbol was at position (2,3).',
    memoryItems: [
      { id: '1', emoji: '🔥', position: 0 },
      { id: '2', emoji: '❄️', position: 1 },
      { id: '3', emoji: '🌊', position: 2 },
      { id: '4', emoji: '⚡', position: 3 },
      { id: '5', emoji: '🌙', position: 4 },
      { id: '6', emoji: '☀️', position: 5 },
      { id: '7', emoji: '🍄', position: 6 },
      { id: '8', emoji: '🎯', position: 7 },
      { id: '9', emoji: '💀', position: 8 },
    ],
    memoryDisplayTime: 2500,
    options: [
      { id: 'a', label: 'A', value: '🌊', isCorrect: false },
      { id: 'b', label: 'B', value: '⚡', isCorrect: true },
      { id: 'c', label: 'C', value: '🔥', isCorrect: false },
      { id: 'd', label: 'D', value: '🎯', isCorrect: false },
    ],
    hint: 'Grid is 3x3. Position (2,3) = row 2, column 3.',
    timeLimit: 25,
    explanation: 'Row 2: 🌊⚡🌙. Column 3 = ⚡.',
  },
  // Level 14 - Fake Answer
  {
    id: 14, level: 14, type: 'fake_answer', difficulty: 'hard',
    title: 'Speed Trap',
    question: 'A train leaves City A at 60 mph. Another leaves City B at 40 mph. Cities are 200 miles apart. They meet after 2 hours. How far from City A do they meet?',
    options: [
      { id: 'a', label: 'A', value: '100 miles', isCorrect: false, isTrap: true },
      { id: 'b', label: 'B', value: '120 miles', isCorrect: true },
      { id: 'c', label: 'C', value: '80 miles', isCorrect: false, isTrap: true },
      { id: 'd', label: 'D', value: '150 miles', isCorrect: false },
    ],
    hint: 'Distance = speed × time. For the train from City A...',
    timeLimit: 30,
    explanation: 'Train from A: 60 mph × 2 hrs = 120 miles. The "100 miles" is a trap (halfway point) that ignores different speeds.',
  },
  // Level 15 - Reverse Thinking
  {
    id: 15, level: 15, type: 'reverse_thinking', difficulty: 'hard',
    title: 'Opposite Day',
    question: 'In a world where "true" means "false" and "false" means "true", which statement is TRUE?',
    reverseLogic: 'You need to find a statement that is false in normal logic, making it "true" in the reversed world.',
    options: [
      { id: 'a', label: 'A', value: '1 + 1 = 2', isCorrect: false },
      { id: 'b', label: 'B', value: '1 + 1 = 3', isCorrect: true },
      { id: 'c', label: 'C', value: 'The sky is blue', isCorrect: false },
      { id: 'd', label: 'D', value: 'Water is wet', isCorrect: false },
    ],
    hint: 'In the reversed world, false statements become true...',
    timeLimit: 25,
    explanation: 'In the reversed world, false = true. "1 + 1 = 3" is false normally, so it\'s TRUE in reversed world.',
  },
  // Level 16 - Pattern
  {
    id: 16, level: 16, type: 'pattern', difficulty: 'hard',
    title: 'Fibonacci Twist',
    question: 'What\'s next? 1, 1, 2, 3, 5, 8, 13, ?',
    options: [
      { id: 'a', label: 'A', value: '18', isCorrect: false },
      { id: 'b', label: 'B', value: '20', isCorrect: false },
      { id: 'c', label: 'C', value: '21', isCorrect: true },
      { id: 'd', label: 'D', value: '26', isCorrect: false },
    ],
    hint: 'Each number is the sum of the previous two.',
    timeLimit: 20,
    explanation: '8 + 13 = 21. Fibonacci sequence!',
  },
  // Level 17 - Hidden UI
  {
    id: 17, level: 17, type: 'hidden_ui', difficulty: 'hard',
    title: 'Shake to Reveal',
    question: 'The exit is hidden. Try shaking the screen (or triple-click the question mark).',
    hiddenElements: [
      { id: 'h2', type: 'shake', position: { x: 50, y: 50 }, size: 60, hint: 'This one responds to rapid clicks...' },
    ],
    correctAnswer: 'h2',
    hint: 'Sometimes the answer responds to how you interact, not what you click.',
    timeLimit: 40,
    explanation: 'Triple-clicking the question mark revealed the hidden answer!',
  },
  // Level 18 - Logic
  {
    id: 18, level: 18, type: 'logic', difficulty: 'hard',
    title: 'Einstein\'s Riddle Lite',
    question: '5 houses in a row. The green house is immediately to the right of the white house. If white is house 2, which house is green?',
    options: [
      { id: 'a', label: 'A', value: 'House 1', isCorrect: false },
      { id: 'b', label: 'B', value: 'House 3', isCorrect: true },
      { id: 'c', label: 'C', value: 'House 4', isCorrect: false },
      { id: 'd', label: 'D', value: 'House 5', isCorrect: false },
    ],
    hint: '"Immediately to the right" means the very next house.',
    timeLimit: 30,
    explanation: 'White is house 2. "Immediately to the right" = house 3. Green = house 3.',
  },
  // Level 19 - Memory
  {
    id: 19, level: 19, type: 'memory', difficulty: 'hard',
    title: 'Color Sequence',
    question: 'Watch the colors, then pick the correct order.\n\n🔴 🟢 🔵 🟡 🟣',
    memoryItems: [
      { id: '1', emoji: '🔴', position: 0 },
      { id: '2', emoji: '🟢', position: 1 },
      { id: '3', emoji: '🔵', position: 2 },
      { id: '4', emoji: '🟡', position: 3 },
      { id: '5', emoji: '🟣', position: 4 },
      { id: '6', emoji: '🟠', position: 5 },
    ],
    memoryDisplayTime: 2000,
    options: [
      { id: 'a', label: 'A', value: '🔴🟢🔵🟡🟣🟠', isCorrect: false },
      { id: 'b', label: 'B', value: '🟢🔴🔵🟡🟠🟣', isCorrect: true },
      { id: 'c', label: 'C', value: '🔴🔵🟢🟡🟣🟠', isCorrect: false },
      { id: 'd', label: 'D', value: '🔴🟢🔵🟡🟠🟣', isCorrect: false },
    ],
    hint: 'Red and Green were swapped compared to what you might expect...',
    timeLimit: 20,
    explanation: 'The actual order was 🟢🔴🔵🟡🟠🟣, not the initial display!',
  },
  // Level 20 - Fake Answer
  {
    id: 20, level: 20, type: 'fake_answer', difficulty: 'hard',
    title: 'Calendar Trap',
    question: 'Some months have 30 days, some have 31. How many months have 28 days?',
    options: [
      { id: 'a', label: 'A', value: '1', isCorrect: false, isTrap: true },
      { id: 'b', label: 'B', value: 'Only February', isCorrect: false, isTrap: true },
      { id: 'c', label: 'C', value: '12', isCorrect: true },
      { id: 'd', label: 'D', value: 'Depends on leap year', isCorrect: false, isTrap: true },
    ],
    hint: 'Does ANY month NOT have at least 28 days?',
    timeLimit: 15,
    explanation: 'ALL 12 months have at least 28 days! Classic misdirection.',
  },

  // ===== EXTREME (21-30) =====
  // Level 21 - Pattern
  {
    id: 21, level: 21, type: 'pattern', difficulty: 'extreme',
    title: 'Binary Decode',
    question: 'Decode the binary pattern:\n\n01, 10, 11, 100, 101, ?',
    options: [
      { id: 'a', label: 'A', value: '110', isCorrect: true },
      { id: 'b', label: 'B', value: '111', isCorrect: false },
      { id: 'c', label: 'C', value: '1000', isCorrect: false },
      { id: 'd', label: 'D', value: '011', isCorrect: false },
    ],
    hint: 'These are binary representations of a well-known sequence.',
    timeLimit: 35,
    explanation: 'Binary: 1, 2, 3, 4, 5, 6. The answer is 6 in binary = 110.',
  },
  // Level 22 - Logic
  {
    id: 22, level: 22, type: 'logic', difficulty: 'extreme',
    title: 'Three Gods',
    question: 'Three beings: one always true, one always false, one random. They answer "da" or "ja" but you don\'t know which means yes/no.\n\nHow many questions to identify all three?',
    options: [
      { id: 'a', label: 'A', value: '2', isCorrect: false },
      { id: 'b', label: 'B', value: '3', isCorrect: true },
      { id: 'c', label: 'C', value: '4', isCorrect: false },
      { id: 'd', label: 'D', value: '5', isCorrect: false },
    ],
    hint: 'This is George Boolos\' famous "Hardest Logic Puzzle Ever".',
    timeLimit: 60,
    explanation: 'It\'s solvable in exactly 3 questions using counterfactual questions that work regardless of language ambiguity.',
  },
  // Level 23 - Reverse Thinking
  {
    id: 23, level: 23, type: 'reverse_thinking', difficulty: 'extreme',
    title: 'Mirror Mind',
    question: 'I am the beginning of eternity, the end of time and space. I am the start of every end, and the end of every race.\n\nBUT I am NOT the letter "e". What am I?',
    reverseLogic: 'The classic riddle answer is "e" - but the puzzle explicitly excludes it. Think of what else fits.',
    options: [
      { id: 'a', label: 'A', value: 'The letter "e"', isCorrect: false },
      { id: 'b', label: 'B', value: 'Nothing exists', isCorrect: false },
      { id: 'c', label: 'C', value: 'The concept of "nothing" / void', isCorrect: true },
      { id: 'd', label: 'D', value: 'Time itself', isCorrect: false },
    ],
    hint: 'The classic answer is excluded. What\'s a deeper philosophical answer?',
    timeLimit: 45,
    explanation: 'The void/nothingness also fits: beginning of eternity (before time), end of all things. The twist is rejecting the obvious "e".',
  },
  // Level 24 - Memory
  {
    id: 24, level: 24, type: 'memory', difficulty: 'extreme',
    title: 'Matrix Overload',
    question: 'Memorize this 4x4 grid (3 seconds), then answer.',
    memoryItems: [
      { id: '1', emoji: '🔥', position: 0 }, { id: '2', emoji: '💎', position: 1 },
      { id: '3', emoji: '🌊', position: 2 }, { id: '4', emoji: '⚡', position: 3 },
      { id: '5', emoji: '🌙', position: 4 }, { id: '6', emoji: '🔥', position: 5 },
      { id: '7', emoji: '🎯', position: 6 }, { id: '8', emoji: '💎', position: 7 },
      { id: '9', emoji: '⚡', position: 8 }, { id: '10', emoji: '🌊', position: 9 },
      { id: '11', emoji: '🌙', position: 10 }, { id: '12', emoji: '🎯', position: 11 },
      { id: '13', emoji: '💎', position: 12 }, { id: '14', emoji: '🔥', position: 13 },
      { id: '15', emoji: '⚡', position: 14 }, { id: '16', emoji: '🌊', position: 15 },
    ],
    memoryDisplayTime: 3000,
    options: [
      { id: 'a', label: 'A', value: 'What was at (3,2)? → 🔥', isCorrect: true },
      { id: 'b', label: 'B', value: 'What was at (3,2)? → 💎', isCorrect: false },
      { id: 'c', label: 'C', value: 'What was at (3,2)? → ⚡', isCorrect: false },
      { id: 'd', label: 'D', value: 'What was at (3,2)? → 🌙', isCorrect: false },
    ],
    hint: 'Row 3, Column 2.',
    timeLimit: 20,
    explanation: 'Row 3: 🔥🎯💎. Column 2 = 🔥.',
  },
  // Level 25 - Hidden UI
  {
    id: 25, level: 25, type: 'hidden_ui', difficulty: 'extreme',
    title: 'The Invisible Door',
    question: 'There is no obvious button here. The answer is in the darkness.',
    hiddenElements: [
      { id: 'h3', type: 'button', position: { x: 10, y: 15 }, size: 30, hint: 'Top-left area... look for a faint outline.' },
    ],
    correctAnswer: 'h3',
    hint: 'The darkness hides things. Move your cursor slowly near the edges.',
    timeLimit: 45,
    explanation: 'An almost invisible button in the top-left corner!',
  },
  // Level 26 - Fake Answer
  {
    id: 26, level: 26, type: 'fake_answer', difficulty: 'extreme',
    title: 'Probability Paradox',
    question: 'You have 3 boxes. One has a prize. You pick Box 1. The host opens Box 3 (empty). Should you switch to Box 2?',
    options: [
      { id: 'a', label: 'A', value: 'It doesn\'t matter (50/50)', isCorrect: false, isTrap: true },
      { id: 'b', label: 'B', value: 'Yes, switch (2/3 chance to win)', isCorrect: true },
      { id: 'c', label: 'C', value: 'No, stay (your first pick is better)', isCorrect: false, isTrap: true },
      { id: 'd', label: 'D', value: 'It depends on the host', isCorrect: false },
    ],
    hint: 'This is the Monty Hall problem. The host\'s action gives you information.',
    timeLimit: 30,
    explanation: 'Monty Hall! Switching gives you 2/3 probability of winning. Your initial pick had 1/3 chance. The host eliminating one door concentrates the remaining 2/3 probability on the other door.',
  },
  // Level 27 - Logic
  {
    id: 27, level: 27, type: 'logic', difficulty: 'extreme',
    title: 'Poison and Wine',
    question: 'You have 1000 bottles of wine, 1 is poisoned. Poison takes exactly 1 hour to kill. You have 10 test strips that change color if poison is present. You have 1 hour.\n\nCan you find the poisoned bottle?',
    options: [
      { id: 'a', label: 'A', value: 'No, impossible in 1 hour', isCorrect: false },
      { id: 'b', label: 'B', value: 'Yes, using binary encoding', isCorrect: true },
      { id: 'c', label: 'C', value: 'Only if we\'re lucky', isCorrect: false },
      { id: 'd', label: 'D', value: 'Yes, test 100 at a time', isCorrect: false },
    ],
    hint: '2^10 = 1024 > 1000. Binary representation of bottle numbers...',
    timeLimit: 60,
    explanation: 'Assign each bottle a 10-bit binary number. Strip i tests bottles where bit i = 1. After 1 hour, the color pattern of strips reveals the exact bottle (as its binary representation).',
  },
  // Level 28 - Pattern
  {
    id: 28, level: 28, type: 'pattern', difficulty: 'extreme',
    title: 'Look-and-Say',
    question: 'What\'s the next in the Look-and-Say sequence?\n\n1, 11, 21, 1211, ?',
    options: [
      { id: 'a', label: 'A', value: '111221', isCorrect: true },
      { id: 'b', label: 'B', value: '1231', isCorrect: false },
      { id: 'c', label: 'C', value: '131221', isCorrect: false },
      { id: 'd', label: 'D', value: '12211', isCorrect: false },
    ],
    hint: '"Look and say" the previous number aloud: one 1, two 1s, one 2 one 1...',
    timeLimit: 40,
    explanation: '1211 → "one 1, one 2, two 1s" → 111221.',
  },
  // Level 29 - Reverse Thinking
  {
    id: 29, level: 29, type: 'reverse_thinking', difficulty: 'extreme',
    title: 'Liar\'s Paradox',
    question: 'A person says "I am lying right now." If the statement is true, they\'re lying (contradiction). If false, they\'re telling the truth (contradiction).\n\nWhich option best describes this?',
    reverseLogic: 'This is the classic Liar\'s Paradox. There\'s no binary answer - you need meta-cognition.',
    options: [
      { id: 'a', label: 'A', value: 'The statement is true', isCorrect: false },
      { id: 'b', label: 'B', value: 'The statement is false', isCorrect: false },
      { id: 'c', label: 'C', value: 'It\'s an undecidable paradox - neither true nor false', isCorrect: true },
      { id: 'd', label: 'D', value: 'The person doesn\'t exist', isCorrect: false },
    ],
    hint: 'Can a statement reference its own truth value and be consistent?',
    timeLimit: 45,
    explanation: 'The Liar\'s Paradox is self-referential and undecidable in classical logic. Gödel used similar ideas in his incompleteness theorems.',
  },
  // Level 30 - All Types Mix
  {
    id: 30, level: 30, type: 'logic', difficulty: 'extreme',
    title: 'The Gauntlet',
    question: 'A prison has 100 cells. Initially all locked. Guard 1 toggles all. Guard 2 toggles multiples of 2. Guard 3 toggles multiples of 3... Guard 100 toggles cell 100.\n\nHow many cells are UNLOCKED at the end?',
    options: [
      { id: 'a', label: 'A', value: '10', isCorrect: true },
      { id: 'b', label: 'B', value: '50', isCorrect: false, isTrap: true },
      { id: 'c', label: 'C', value: '25', isCorrect: false },
      { id: 'd', label: 'D', value: '1', isCorrect: false, isTrap: true },
    ],
    hint: 'A cell is toggled once for each of its factors. When is the toggle count odd?',
    timeLimit: 60,
    explanation: 'Only cells with ODD number of factors are unlocked = perfect squares! √100 = 10. There are 10 perfect squares from 1² to 10².',
  },

  // ===== INSANE (31-40) =====
  // Level 31
  {
    id: 31, level: 31, type: 'pattern', difficulty: 'insane',
    title: 'Oeis Hunter',
    question: 'Find the pattern: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, ?',
    options: [
      { id: 'a', label: 'A', value: '87', isCorrect: false },
      { id: 'b', label: 'B', value: '89', isCorrect: true },
      { id: 'c', label: 'C', value: '76', isCorrect: false },
      { id: 'd', label: 'D', value: '91', isCorrect: false },
    ],
    hint: 'This is a famous sequence where each number is the sum of two before it.',
    timeLimit: 15,
    explanation: 'Fibonacci: 34 + 55 = 89.',
  },
  // Level 32
  {
    id: 32, level: 32, type: 'fake_answer', difficulty: 'insane',
    title: 'Infinite Hotel',
    question: 'Hilbert\'s Hotel is full. A new guest arrives. Can the hotel accommodate them without kicking anyone out?',
    options: [
      { id: 'a', label: 'A', value: 'No, it\'s full', isCorrect: false, isTrap: true },
      { id: 'b', label: 'B', value: 'Yes, move guest n to room n+1', isCorrect: true },
      { id: 'c', label: 'C', value: 'Only if the hotel is infinite in width', isCorrect: false },
      { id: 'd', label: 'D', value: 'Yes, by adding a new wing', isCorrect: false },
    ],
    hint: 'What if every guest moves to the next room number?',
    timeLimit: 30,
    explanation: 'In an infinite hotel, move guest from room n to room n+1. Room 1 becomes free. Infinity + 1 = infinity!',
  },
  // Level 33
  {
    id: 33, level: 33, type: 'reverse_thinking', difficulty: 'insane',
    title: 'Self-Reference',
    question: 'Which of these statements creates a paradox?\n\nA: "This statement is false."\nB: "This statement is true."\nC: Both A and B\nD: Neither creates a paradox',
    reverseLogic: 'Think about which statement can be consistently assigned a truth value.',
    options: [
      { id: 'a', label: 'A', value: 'Statement A only', isCorrect: true },
      { id: 'b', label: 'B', value: 'Statement B only', isCorrect: false },
      { id: 'c', label: 'C', value: 'Both A and B', isCorrect: false },
      { id: 'd', label: 'D', value: 'Neither', isCorrect: false },
    ],
    hint: 'Can statement B consistently be true? Can A?',
    timeLimit: 30,
    explanation: 'A creates the Liar\'s Paradox (if true→false, if false→true). B can consistently be true (no paradox).',
  },
  // Level 34
  {
    id: 34, level: 34, type: 'logic', difficulty: 'insane',
    title: 'Blue Eyes',
    question: 'An island has 100 blue-eyed people, 100 brown-eyed. They can see others\' eyes but not their own. No communication. If someone knows their eye color, they leave at midnight.\n\nOn day 101, who leaves?',
    options: [
      { id: 'a', label: 'A', value: 'Nobody (they can\'t figure it out)', isCorrect: false },
      { id: 'b', label: 'B', value: 'All blue-eyed people leave', isCorrect: true },
      { id: 'c', label: 'C', value: 'All brown-eyed people leave', isCorrect: false },
      { id: 'd', label: 'D', value: 'Everyone leaves', isCorrect: false, isTrap: true },
    ],
    hint: 'Start with 1 blue-eyed person, then 2, then 3... What happens inductively?',
    timeLimit: 90,
    explanation: 'With common knowledge, by induction: if there were n blue-eyed people, they\'d leave on day n. 100 blue-eyed people leave on day 100. Brown-eyed realize on day 101, leave day 102.',
  },
  // Level 35
  {
    id: 35, level: 35, type: 'hidden_ui', difficulty: 'insane',
    title: 'Ghost Protocol',
    question: 'The answer exists between dimensions. Move your mouse in a circle three times over the puzzle area to reveal it.',
    hiddenElements: [
      { id: 'h4', type: 'long_press', position: { x: 50, y: 50 }, size: 80, hint: 'Patience... circle movements reveal hidden truths.' },
    ],
    correctAnswer: 'h4',
    hint: 'Some puzzles require patience and specific interaction patterns.',
    timeLimit: 60,
    explanation: 'Circular mouse movements in the puzzle area triggered the hidden reveal!',
  },
  // Level 36
  {
    id: 36, level: 36, type: 'memory', difficulty: 'insane',
    title: 'Human CPU',
    question: 'Memorize: ADD 3, MULTIPLY BY 2, SUBTRACT 5. Starting number: 7. What\'s the result?',
    memoryItems: [
      { id: '1', emoji: '➕3', position: 0 },
      { id: '2', emoji: '✖️2', position: 1 },
      { id: '3', emoji: '➖5', position: 2 },
      { id: '4', emoji: '🔢7', position: 3 },
    ],
    memoryDisplayTime: 2000,
    options: [
      { id: 'a', label: 'A', value: '15', isCorrect: true },
      { id: 'b', label: 'B', value: '12', isCorrect: false },
      { id: 'c', label: 'C', value: '13', isCorrect: false },
      { id: 'd', label: 'D', value: '17', isCorrect: false },
    ],
    hint: '7 + 3 = ? → × 2 = ? → - 5 = ?',
    timeLimit: 25,
    explanation: '7 + 3 = 10, 10 × 2 = 20, 20 - 5 = 15.',
  },
  // Level 37
  {
    id: 37, level: 37, type: 'pattern', difficulty: 'insane',
    title: 'Prime Spiral',
    question: 'What\'s the 7th prime number?',
    options: [
      { id: 'a', label: 'A', value: '13', isCorrect: false },
      { id: 'b', label: 'B', value: '15', isCorrect: false },
      { id: 'c', label: 'C', value: '17', isCorrect: true },
      { id: 'd', label: 'D', value: '19', isCorrect: false },
    ],
    hint: 'Primes: 2, 3, 5, 7, 11, 13, ?',
    timeLimit: 15,
    explanation: '7th prime: 2, 3, 5, 7, 11, 13, 17.',
  },
  // Level 38
  {
    id: 38, level: 38, type: 'fake_answer', difficulty: 'insane',
    title: 'Coin Flip',
    question: 'I flip a fair coin 10 times and get heads every time. What\'s the probability the next flip is heads?',
    options: [
      { id: 'a', label: 'A', value: '1/1024 (very unlikely)', isCorrect: false, isTrap: true },
      { id: 'b', label: 'B', value: '1/2 (50%)', isCorrect: true },
      { id: 'c', label: 'C', value: 'Much less than 50% (due to streak)', isCorrect: false, isTrap: true },
      { id: 'd', label: 'D', value: 'Much more than 50% (hot streak)', isCorrect: false, isTrap: true },
    ],
    hint: 'The Gambler\'s Fallacy strikes again...',
    timeLimit: 20,
    explanation: 'Coins have no memory! Each flip is independent. The probability is always 50%. Past results don\'t affect future flips.',
  },
  // Level 39
  {
    id: 39, level: 39, type: 'logic', difficulty: 'insane',
    title: 'Halting Problem',
    question: 'Can you write a program that determines if ANY given program will eventually stop (halt) or run forever?',
    options: [
      { id: 'a', label: 'A', value: 'Yes, with enough computing power', isCorrect: false, isTrap: true },
      { id: 'b', label: 'B', value: 'No, it\'s mathematically impossible', isCorrect: true },
      { id: 'c', label: 'C', value: 'Yes, but only for simple programs', isCorrect: false },
      { id: 'd', label: 'D', value: 'It depends on the programming language', isCorrect: false },
    ],
    hint: 'Turing proved this in 1936...',
    timeLimit: 30,
    explanation: 'Alan Turing proved the Halting Problem is undecidable. No universal halting checker can exist. This is a foundational result in computer science.',
  },
  // Level 40
  {
    id: 40, level: 40, type: 'reverse_thinking', difficulty: 'insane',
    title: 'Ship of Theseus',
    question: 'If you replace every plank of a ship one by one, is it still the same ship? Now use the old planks to build another ship. Which is the ORIGINAL Ship of Theseus?',
    reverseLogic: 'There\'s no objectively correct answer - but which answer reveals the deepest understanding?',
    options: [
      { id: 'a', label: 'A', value: 'The rebuilt ship (same materials)', isCorrect: false },
      { id: 'b', label: 'B', value: 'Neither — identity is an illusion', isCorrect: true },
      { id: 'c', label: 'C', value: 'The continuously repaired ship', isCorrect: false },
      { id: 'd', label: 'D', value: 'Both are equally the original', isCorrect: false },
    ],
    hint: 'Think about what makes something the "same" thing over time.',
    timeLimit: 45,
    explanation: 'The Ship of Theseus paradox challenges the concept of identity. The deepest answer is that persistent identity itself may be an illusion — a concept our minds impose on continuous change.',
  },

  // ===== IMPOSSIBLE VAULT (41-50) =====
  // Level 41
  {
    id: 41, level: 41, type: 'logic', difficulty: 'impossible',
    title: 'Berry Paradox',
    question: '"The smallest positive integer not definable in under sixty letters."\n\nBut that definition is itself under 60 letters. What happens?',
    options: [
      { id: 'a', label: 'A', value: 'The integer is 42', isCorrect: false },
      { id: 'b', label: 'B', value: 'It\'s a self-referential paradox — no such integer exists consistently', isCorrect: true },
      { id: 'c', label: 'C', value: 'The definition is invalid', isCorrect: false },
      { id: 'd', label: 'D', value: 'It depends on the language', isCorrect: false },
    ],
    hint: 'Can a definition define the thing it claims is undefinable?',
    timeLimit: 60,
    explanation: 'Berry\'s Paradox: the definition contradicts itself. If such an integer exists, the definition defines it in under 60 letters, making it definable — contradicting the claim. This relates to Gödel\'s incompleteness.',
  },
  // Level 42
  {
    id: 42, level: 42, type: 'pattern', difficulty: 'impossible',
    title: 'Collatz Conjecture',
    question: 'Start with any positive integer. If even, divide by 2. If odd, multiply by 3 and add 1. Repeat.\n\nWhat always happens (conjectured but unproven)?',
    options: [
      { id: 'a', label: 'A', value: 'It reaches 0', isCorrect: false },
      { id: 'b', label: 'B', value: 'It reaches 1 (then cycles 4→2→1)', isCorrect: true },
      { id: 'c', label: 'C', value: 'It grows to infinity', isCorrect: false },
      { id: 'd', label: 'D', value: 'It depends on the starting number', isCorrect: false },
    ],
    hint: 'Try it: 6→3→10→5→16→8→4→2→1...',
    timeLimit: 45,
    explanation: 'The Collatz Conjecture: every positive integer eventually reaches 1, then cycles 4→2→1→4... Despite being simple to state, it remains UNSOLVED by mathematicians!',
  },
  // Level 43
  {
    id: 43, level: 43, type: 'memory', difficulty: 'impossible',
    title: 'Rain Man',
    question: 'Memorize these 8 numbers: 7, 3, 9, 1, 5, 8, 2, 6. Now answer: What is the sum of the 3rd and 7th numbers?',
    memoryItems: [
      { id: '1', emoji: '7️⃣', position: 0 }, { id: '2', emoji: '3️⃣', position: 1 },
      { id: '3', emoji: '9️⃣', position: 2 }, { id: '4', emoji: '1️⃣', position: 3 },
      { id: '5', emoji: '5️⃣', position: 4 }, { id: '6', emoji: '8️⃣', position: 5 },
      { id: '7', emoji: '2️⃣', position: 6 }, { id: '8', emoji: '6️⃣', position: 7 },
    ],
    memoryDisplayTime: 2500,
    options: [
      { id: 'a', label: 'A', value: '11', isCorrect: true },
      { id: 'b', label: 'B', value: '10', isCorrect: false },
      { id: 'c', label: 'C', value: '12', isCorrect: false },
      { id: 'd', label: 'D', value: '8', isCorrect: false },
    ],
    hint: '3rd number was 9, 7th was 2...',
    timeLimit: 20,
    explanation: '3rd = 9, 7th = 2. 9 + 2 = 11.',
  },
  // Level 44
  {
    id: 44, level: 44, type: 'fake_answer', difficulty: 'impossible',
    title: 'Banach-Tarski',
    question: 'Can you decompose a solid sphere into pieces and reassemble them into TWO identical spheres, each the same size as the original?',
    options: [
      { id: 'a', label: 'A', value: 'No, violates conservation of volume', isCorrect: false, isTrap: true },
      { id: 'b', label: 'B', value: 'Yes, mathematically (using the Axiom of Choice)', isCorrect: true },
      { id: 'c', label: 'C', value: 'Only in 4+ dimensions', isCorrect: false },
      { id: 'd', label: 'D', value: 'Only with non-measurable sets', isCorrect: false },
    ],
    hint: 'This is a real mathematical theorem. Volume conservation breaks down with infinite decomposition.',
    timeLimit: 45,
    explanation: 'The Banach-Tarski Paradox is a real theorem! Using the Axiom of Choice, a sphere can be decomposed into finitely many pieces and reassembled into two identical copies. The pieces are non-measurable sets.',
  },
  // Level 45
  {
    id: 45, level: 45, type: 'reverse_thinking', difficulty: 'impossible',
    title: 'Brain in a Vat',
    question: 'You can\'t prove you\'re not a brain in a vat being fed simulated experiences. Given this, what can you KNOW for certain?',
    reverseLogic: 'Descartes\' famous answer is the key.',
    options: [
      { id: 'a', label: 'A', value: 'Nothing can be known for certain', isCorrect: false },
      { id: 'b', label: 'B', value: '"I think, therefore I am" — the act of doubting proves existence of the doubter', isCorrect: true },
      { id: 'c', label: 'C', value: 'Physical reality exists', isCorrect: false },
      { id: 'd', label: 'D', value: 'Other minds exist', isCorrect: false },
    ],
    hint: 'Even if everything is simulated, something must be experiencing the simulation...',
    timeLimit: 45,
    explanation: 'Descartes\' cogito ergo sum: even if all experience is an illusion, the fact that you\'re doubting proves SOMETHING exists to do the doubting. "I think, therefore I am."',
  },
  // Level 46
  {
    id: 46, level: 46, type: 'logic', difficulty: 'impossible',
    title: 'P vs NP',
    question: 'P vs NP asks: can every problem whose solution can be quickly verified also be quickly solved?\n\nWhat is the current status?',
    options: [
      { id: 'a', label: 'A', value: 'Proven that P ≠ NP', isCorrect: false },
      { id: 'b', label: 'B', value: 'Proven that P = NP', isCorrect: false },
      { id: 'c', label: 'C', value: 'Unsolved — one of the 7 Millennium Prize Problems ($1M reward)', isCorrect: true },
      { id: 'd', label: 'D', value: 'Proven to be undecidable', isCorrect: false },
    ],
    hint: 'This is arguably the most important open question in computer science.',
    timeLimit: 30,
    explanation: 'P vs NP remains UNSOLVED despite decades of effort. It\'s a Clay Millennium Prize problem worth $1,000,000. Most experts believe P ≠ NP but no proof exists.',
  },
  // Level 47
  {
    id: 47, level: 47, type: 'hidden_ui', difficulty: 'impossible',
    title: 'The Void',
    question: 'There is nothing here. Or is there? The answer is in the silence.\n\n(Click 5 times in the empty space below to reveal.)',
    hiddenElements: [
      { id: 'h5', type: 'triple_tap', position: { x: 50, y: 65 }, size: 100, hint: 'Persistence in nothingness reveals something...' },
    ],
    correctAnswer: 'h5',
    hint: 'Click repeatedly in the dark void below the text.',
    timeLimit: 60,
    explanation: '5 clicks in the void revealed the hidden truth!',
  },
  // Level 48
  {
    id: 48, level: 48, type: 'pattern', difficulty: 'impossible',
    title: 'Ramanujan\'s Taxi',
    question: 'Ramanujan noted that 1729 is the smallest number expressible as the sum of two cubes in two different ways.\n\n1729 = ? (both ways)',
    options: [
      { id: 'a', label: 'A', value: '1³+12³ and 9³+10³', isCorrect: true },
      { id: 'b', label: 'B', value: '7³+8³ and 5³+12³', isCorrect: false },
      { id: 'c', label: 'C', value: '2³+11³ and 7³+10³', isCorrect: false },
      { id: 'd', label: 'D', value: '1³+12³ and 8³+9³', isCorrect: false },
    ],
    hint: 'Check: 1+1728=1729 and 729+1000=1729.',
    timeLimit: 45,
    explanation: '1729 = 1³ + 12³ = 1 + 1728 = 1729, and 1729 = 9³ + 10³ = 729 + 1000 = 1729. The "taxicab number" Ta(2)!',
  },
  // Level 49
  {
    id: 49, level: 49, type: 'fake_answer', difficulty: 'impossible',
    title: 'Simpson\'s Paradox',
    question: 'Hospital A has 90% survival rate. Hospital B has 80%. But for BOTH mild and severe cases separately, Hospital B is better.\n\nHow is this possible?',
    options: [
      { id: 'a', label: 'A', value: 'The numbers are wrong — this can\'t happen', isCorrect: false, isTrap: true },
      { id: 'b', label: 'B', value: 'Simpson\'s Paradox — different case distributions can reverse aggregate conclusions', isCorrect: true },
      { id: 'c', label: 'C', value: 'Hospital A cheats on their statistics', isCorrect: false },
      { id: 'd', label: 'D', value: 'This only happens with small samples', isCorrect: false },
    ],
    hint: 'Think about weighted averages and how case mix affects overall rates.',
    timeLimit: 45,
    explanation: 'Simpson\'s Paradox: A treats mostly mild cases (high survival), B treats mostly severe cases (lower survival). B is actually better for each category, but the aggregate reverses due to different case distributions.',
  },
  // Level 50
  {
    id: 50, level: 50, type: 'reverse_thinking', difficulty: 'impossible',
    title: 'The Ultimate Question',
    question: 'You\'ve reached Level 50 — The Vault\'s deepest secret.\n\nIf everything in this game was designed to trick you, is THIS question also a trick?\n\nSelect the answer that proves you truly understand:',
    reverseLogic: 'Meta-puzzle: the game has been about recognizing tricks. What does the final answer teach you?',
    options: [
      { id: 'a', label: 'A', value: 'Every puzzle was a trick — including this one', isCorrect: false },
      { id: 'b', label: 'B', value: 'The real puzzle was learning to question everything, including yourself', isCorrect: true },
      { id: 'c', label: 'C', value: 'There is no right answer', isCorrect: false },
      { id: 'd', label: 'D', value: '42', isCorrect: false },
    ],
    hint: 'Look at everything you\'ve learned... What was the game really teaching you?',
    timeLimit: 120,
    explanation: 'Think harder. Fail faster. Solve the impossible.\n\nThe real vault was the skills you unlocked along the way. 🧠',
  },
];

export function getPuzzleByLevel(level: number): Puzzle | undefined {
  return PUZZLES.find(p => p.level === level);
}

export function getPuzzlesByDifficulty(difficulty: Difficulty): Puzzle[] {
  return PUZZLES.filter(p => p.difficulty === difficulty);
}

export function getDailyChallenge(): Puzzle {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const index = dayOfYear % PUZZLES.length;
  return PUZZLES[index];
}
