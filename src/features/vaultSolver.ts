import {
  applyGuess,
  Code,
  Digit,
  DigitInfo,
  generateDigitInfo,
  generateGuess,
  Hint,
  Hints,
  Position,
} from "~/utils/vault";
import {
  BUTTON_BLUE_STYLES,
  BUTTON_GRAY_STYLES,
  BUTTON_GREEN_BACKGROUND,
  BUTTON_GREEN_BORDER,
  BUTTON_GREEN_STYLES,
  BUTTON_VAULT_BLUE_STYLES,
  BUTTON_VAULT_GRAY_STYLES,
  BUTTON_VAULT_YELLOW_STYLES,
  TEXT_WHITE,
  toCSS,
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

const generateButton = (
  digit: Digit,
  currentCode: string,
  info: DigitInfo[]
): string => {
  const digitInfo = info.find((d) => d.digit === digit);
  const currentPosition = currentCode.length as Position;
  let buttonStyles = BUTTON_VAULT_GRAY_STYLES;
  if (currentPosition > 4) {
    buttonStyles = BUTTON_GRAY_STYLES;
  } else if (digitInfo?.correctPositions.includes(currentPosition)) {
    buttonStyles = BUTTON_VAULT_BLUE_STYLES;
  } else if (digitInfo?.possiblePositions.includes(currentPosition)) {
    buttonStyles = BUTTON_VAULT_YELLOW_STYLES;
  }
  return `
    <button
      data-input="${digit}"
      style="${toCSS(buttonStyles)};"
    >${digit}</button>
  `;
};

const renderKeyboard = (
  input: HTMLInputElement | null,
  info: DigitInfo[]
): void => {
  if (!input) {
    return;
  }
  document.querySelector(".fh-vault-keyboard")?.remove();
  const submitButton = document.querySelector<HTMLAnchorElement>(".vcbtn");
  if (!submitButton) {
    return;
  }
  const keyboard = document.createElement("div");
  keyboard.classList.add("fh-vault-keyboard");
  keyboard.style.display = "grid";
  keyboard.style.gridTemplateColumns = "repeat(3, 1fr)";
  keyboard.style.gap = "15px";
  keyboard.style.padding = "15px";
  keyboard.innerHTML = `
    ${generateButton(1, input.value, info)}
    ${generateButton(2, input.value, info)}
    ${generateButton(3, input.value, info)}
    ${generateButton(4, input.value, info)}
    ${generateButton(5, input.value, info)}
    ${generateButton(6, input.value, info)}
    ${generateButton(7, input.value, info)}
    ${generateButton(8, input.value, info)}
    ${generateButton(9, input.value, info)}
    <button data-input="backspace" style="${toCSS(
      input.value.length === 0 ? BUTTON_GRAY_STYLES : BUTTON_BLUE_STYLES
    )};"><i class="fa fa-fw fa-delete-left"></i></button>
    ${generateButton(0, input.value, info)}
    <button data-input="submit" style="${toCSS(
      input.value.length === 4 ? BUTTON_GREEN_STYLES : BUTTON_GRAY_STYLES
    )};">Submit</button>
  `;
  keyboard.addEventListener("click", (event) => {
    const target = event.target as HTMLButtonElement;
    if (!target.dataset.input) {
      return;
    }
    if (target.dataset.input === "backspace") {
      input.value = input.value.slice(0, -1);
      renderKeyboard(input, info);
      return;
    }
    if (target.dataset.input === "submit") {
      submitButton.click();
      return;
    }
    input.value += target.dataset.input;
    renderKeyboard(input, info);
  });
  submitButton.parentElement?.before(keyboard);
  submitButton.style.display = "none";
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

    const input = document.querySelector<HTMLInputElement>("#vaultcode");
    input?.setAttribute("inputmode", "none");
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
    renderKeyboard(input, info);
    const guess = generateGuess(info, guesses.length).join("");
    if (input) {
      input.value = guess;
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
      // otherwise, submit the suggested guess
      if (input) {
        input.value = guess;
        currentPage.querySelector<HTMLButtonElement>(".vcbtn")?.click();
      }
    });
    currentPage.append(magicButton);
  },
};
