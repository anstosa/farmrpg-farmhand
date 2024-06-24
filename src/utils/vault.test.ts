import {
  applyGuess,
  Code,
  generateDigitInfo,
  generateGuess,
  Hint,
  Hints,
  isCorrect,
} from "./vault";

const guessCount: number[] = [];

/* eslint-disable no-nested-ternary */
const getHints = (code: Code, guess: Code): Hints => [
  code[0] === guess[0]
    ? Hint.CORRECT
    : code.includes(guess[0])
    ? Hint.CLOSE
    : Hint.NONE,
  code[1] === guess[1]
    ? Hint.CORRECT
    : code.includes(guess[1])
    ? Hint.CLOSE
    : Hint.NONE,
  code[2] === guess[2]
    ? Hint.CORRECT
    : code.includes(guess[2])
    ? Hint.CLOSE
    : Hint.NONE,
  code[3] === guess[3]
    ? Hint.CORRECT
    : code.includes(guess[3])
    ? Hint.CLOSE
    : Hint.NONE,
];
/* eslint-enable no-nested-ternary */

const runTest = (index: number): number => {
  console.log();
  console.log(
    `TEST RUN ${index.toString().padStart(3, " ")} =================`
  );
  const code = [
    Math.floor(Math.random() * 9),
    Math.floor(Math.random() * 9),
    Math.floor(Math.random() * 9),
    Math.floor(Math.random() * 9),
  ] as Code;
  let info = generateDigitInfo();

  const guesses: Code[] = [];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const guess = generateGuess(info, guesses.length);
    guesses.push(guess);
    const hints = getHints(code, guess);
    if (isCorrect(hints)) {
      break;
    }
    info = applyGuess(info, guess, hints);
    if (guesses.length > 100) {
      break;
    }
  }
  if (guesses.length <= 5) {
    console.log(`✅ Solved in ${guesses.length} guesses`);
  } else {
    console.log(`❌ Solved in ${guesses.length} guesses...`);
    for (const [, guess] of guesses.entries()) {
      console.log(
        `   ${guess.join(" ").trim()} (${getHints(code, guess).join(" ")})`
      );
    }
  }
  return guesses.length;
};

while (guessCount.length < 100) {
  guessCount.push(runTest(guessCount.length + 1));
}

const average = guessCount.reduce((a, b) => a + b, 0) / guessCount.length;

console.log();
console.log(
  `${
    average <= 5 ? "✅" : "❌"
  } Solved 100 codes in average of ${average} guesses!`
);
