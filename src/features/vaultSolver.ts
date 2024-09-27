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
import {
  BUTTON_GREEN_BACKGROUND,
  BUTTON_GREEN_BORDER,
  TEXT_WHITE,
} from "~/utils/theme";
import { Feature, FeatureSetting } from "./feature";
import { getCurrentPage, Page } from "~/utils/page";

const SETTING_VAULT_SOLVER: FeatureSetting = {
  id: "vaultSolver",
  title: "Vault: Auto Solver",
  description: "Auto-fill solution suggestions in the vault input box",
  type: "boolean",
  defaultValue: true,
};

export const vaultSolver: Feature = {
  settings: [SETTING_VAULT_SOLVER],
  onPageLoad: (settings, page) => {
    if (page !== Page.VAULT) {
      return;
    }

    if (!settings[SETTING_VAULT_SOLVER.id].value) {
      return;
    }

    const currentPage = getCurrentPage();
    if (!currentPage) {
      return;
    }

    const magicButton = document.createElement("div");
    magicButton.style.position = "absolute";
    magicButton.style.right = "20px";
    magicButton.style.bottom = "80px";
    magicButton.style.cursor = "pointer";
    magicButton.style.zIndex = "999999";
    magicButton.style.height = "60px";
    magicButton.style.width = "60px";
    magicButton.style.borderRadius = "100%";
    magicButton.style.backgroundColor = BUTTON_GREEN_BACKGROUND;
    magicButton.style.borderWidth = "2px";
    magicButton.style.borderColor = BUTTON_GREEN_BORDER;
    magicButton.style.borderStyle = "solid";
    magicButton.style.color = TEXT_WHITE;
    magicButton.style.display = "flex";
    magicButton.style.justifyContent = "center";
    magicButton.style.alignItems = "center";
    magicButton.innerHTML = `<i class="fa fa-wand-sparkles fa-2x fa-fw" />`;
    magicButton.addEventListener("click", () => {
      // click new vault button if available
      const newVaultButton =
        currentPage.querySelector<HTMLButtonElement>(".resetbtn");
      if (newVaultButton) {
        newVaultButton.click();
        return;
      }
      // click more guesses button if available
      const moreTriesButton =
        currentPage.querySelector<HTMLButtonElement>(".moretriesbtn");
      if (moreTriesButton) {
        moreTriesButton.click();
      }
      // otherwise, submit the current guess
      currentPage.querySelector<HTMLButtonElement>(".vcbtn")?.click();
    });
    currentPage.append(magicButton);

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
