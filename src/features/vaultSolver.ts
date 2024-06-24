import {
  applyGuess,
  Code,
  Digit,
  generateDigitInfo,
  generateGuess,
  Hint,
  Hints,
  Position,
} from "~/utils/vault";
import { Feature } from "./feature";
import { Page } from "~/utils/page";

export const vaultSolver: Feature = {
  onPageLoad: (settings, page) => {
    if (page !== Page.VAULT) {
      return;
    }

    const input = document.querySelector<HTMLInputElement>("#vaultcode");
    if (!input) {
      console.error("Input not found");
      return;
    }
    let info = generateDigitInfo();
    const guessElements = document.querySelectorAll("[data-page='crack'] .row");
    const guesses: Code[] = [];
    for (const [, guessElement] of guessElements.entries()) {
      const digitElements =
        guessElement.querySelectorAll<HTMLDivElement>(".col-25");
      if (digitElements.length > 0) {
        const guess: Code = [0, 0, 0, 0];
        const hints: Hints = [Hint.NONE, Hint.NONE, Hint.NONE, Hint.NONE];
        for (const [position, digitElement] of digitElements.entries()) {
          guess[position as Position] = Number(
            digitElement.textContent?.slice(-1)
          ) as Digit;
          hints[position as Position] =
            // eslint-disable-next-line no-nested-ternary
            digitElement.dataset.type === "B"
              ? Hint.CORRECT
              : digitElement.dataset.type === "Y"
              ? Hint.CLOSE
              : Hint.NONE;
        }
        guesses.push(guess);
        info = applyGuess(info, guess, hints);
      }
    }
    input.value = generateGuess(info, guesses.length).join("");
  },
};
