import { getRandom } from "./array";

export type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Code = [Digit, Digit, Digit, Digit];
export type Position = 0 | 1 | 2 | 3;
export enum Hint {
  NONE = "❌",
  CORRECT = "✅",
  CLOSE = "🟧",
}
export type Hints = [Hint, Hint, Hint, Hint];

export interface DigitInfo {
  digit: Digit;
  correctPositions: Position[];
  possiblePositions: Position[];
}

export const isCorrect = (hints: Hints): boolean =>
  hints.every((h) => h === Hint.CORRECT);

export const generateDigitInfo = (): DigitInfo[] =>
  ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as Digit[]).map((digit) => ({
    correctPositions: [],
    possiblePositions: [0, 1, 2, 3],
    digit,
  }));

export const canSolve = (info: DigitInfo[]): boolean => {
  const correctPositions: Position[] = [];
  for (const digitInfo of info) {
    if (digitInfo.correctPositions.length > 0) {
      correctPositions.push(...digitInfo.correctPositions);
    }
  }
  return correctPositions.length === 4;
};

export const hasDigit = (info: DigitInfo): boolean =>
  info.correctPositions.length > 0 ||
  (info.possiblePositions.length > 0 && info.possiblePositions.length < 4);

export const couldHaveDigit = (info: DigitInfo): boolean =>
  info.correctPositions.length > 0 || info.possiblePositions.length > 0;

export const getPossibleDigits = (
  info: DigitInfo[],
  position: Position
): Digit[] => {
  const uncalledDigits: Digit[] = [];
  const calledDigits: Digit[] = [];
  for (const digitInfo of info) {
    if (digitInfo.correctPositions.includes(position)) {
      return [digitInfo.digit];
    }
    if (
      couldHaveDigit(digitInfo) &&
      digitInfo.possiblePositions.includes(position)
    ) {
      if (digitInfo.correctPositions.length === 0) {
        uncalledDigits.push(digitInfo.digit);
      } else {
        calledDigits.push(digitInfo.digit);
      }
    }
  }
  return [...uncalledDigits, ...calledDigits];
};

export const applyGuess = (
  info: DigitInfo[],
  guess: Code,
  hints: Hints
): DigitInfo[] => {
  for (const [position, digit] of guess.entries()) {
    const digitInfo = info[digit];
    switch (hints[position]) {
      case Hint.CORRECT: {
        digitInfo.correctPositions.push(position as Position);
        digitInfo.possiblePositions = digitInfo.possiblePositions.filter(
          (p) => p !== position
        );
        break;
      }
      case Hint.CLOSE: {
        digitInfo.possiblePositions = digitInfo.possiblePositions.filter(
          (p) => p !== position
        );
        break;
      }
      case Hint.NONE: {
        digitInfo.correctPositions = [];
        digitInfo.possiblePositions = [];
        break;
      }
    }
  }
  const confirmedDigits: Digit[] = [];
  for (const digitInfo of info) {
    if (confirmedDigits.length === 4) {
      digitInfo.correctPositions = [];
      digitInfo.possiblePositions = [];
    } else if (hasDigit(digitInfo)) {
      confirmedDigits.push(digitInfo.digit);
    }
  }
  return info;
};

export const generateGuess = (info: DigitInfo[], guessIndex: number): Code => {
  if (guessIndex === 0) {
    return [0, 1, 2, 3];
  }
  if (guessIndex === 1) {
    return [4, 5, 6, 7];
  }
  const guess: Digit[] = guessIndex === 2 ? [8, 9] : [];
  while (guess.length < 4) {
    const position = guess.length as Position;
    const possibilities = getPossibleDigits(info, position);
    guess[position] = (() => {
      for (const digit of possibilities) {
        if (!guess.includes(digit)) {
          return digit;
        }
      }
      return getRandom(possibilities);
    })();
  }
  return guess as Code;
};
