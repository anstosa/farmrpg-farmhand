import {
  BUTTON_GREEN_BACKGROUND,
  BUTTON_GREEN_BORDER,
  TEXT_WHITE,
} from "~/utils/theme";
import { Feature, FeatureSetting } from "./feature";
import { getCurrentPage, Page } from "~/utils/page";

const SETTING_MINER: FeatureSetting = {
  id: "miner",
  title: "Mining: Auto Miner",
  description: "Adds button to take the next suggested action",
  type: "boolean",
  defaultValue: true,
};

const SETTING_MINER_EXPLOSIVES: FeatureSetting = {
  id: "minerExplosives",
  title: "Mining: Use Explosives",
  description: "Use explosives as suggested action",
  type: "boolean",
  defaultValue: true,
};

const SETTING_MINER_BOMBS: FeatureSetting = {
  id: "minerBombs",
  title: "Mining: Use Bombs",
  description: "Use bombs as suggested action",
  type: "boolean",
  defaultValue: false,
};

type Status =
  | "miss"
  | "hit"
  | "discovered"
  | "trap"
  | "extra"
  | "xp"
  | "unknown"
  | "unexplored";

const getStatus = (cell: HTMLElement): Status => {
  if (!cell.classList.contains("marked")) {
    return "unexplored";
  }
  const icon = cell.firstElementChild;
  if (!icon) {
    return "unknown";
  }
  if (icon.tagName === "IMG") {
    return "discovered";
  }
  if (icon.getAttribute("style")?.includes("color:yellow")) {
    return "miss";
  }
  if (cell.getAttribute("style")?.includes("background-color:#cc0000;")) {
    return "trap";
  }
  if (icon.getAttribute("style")?.includes("color:black")) {
    return "hit";
  }
  if (icon.classList.contains("fa-pickaxe")) {
    return "extra";
  }
  if (icon.classList.contains("fa-sparkles")) {
    return "xp";
  }
  return "unknown";
};

interface Cell {
  isMarked: boolean;
  status: Status;
  element: HTMLElement;
  x: number;
  y: number;
  isCandidate?: boolean;
  isNextToHit?: boolean;
  isInlineWithHit?: boolean;
  candidateDirectionCount?: number;
}

const getCellAt = (board: Cell[][], x: number, y: number): Cell | undefined => {
  const rowIndex = y - 1;
  if (rowIndex < 0 || rowIndex >= board.length) {
    return undefined;
  }
  const columnIndex = x - 1;
  if (columnIndex < 0 || columnIndex >= board[rowIndex].length) {
    return undefined;
  }
  return board[rowIndex][columnIndex];
};

const fillHints = (board: Cell[][]): void => {
  const cells = board.flat();
  // mark candidates
  for (const cell of cells) {
    if (cell.status !== "unexplored") {
      cell.isCandidate = false;
      continue;
    }
    let hasDirection = false;
    const left = getCellAt(board, cell.x - 1, cell.y);
    if (left && ["unexplored", "hit"].includes(left.status)) {
      hasDirection = true;
    }
    const right = getCellAt(board, cell.x + 1, cell.y);
    if (right && ["unexplored", "hit"].includes(right.status)) {
      hasDirection = true;
    }
    const up = getCellAt(board, cell.x, cell.y - 1);
    if (up && ["unexplored", "hit"].includes(up.status)) {
      hasDirection = true;
    }
    const down = getCellAt(board, cell.x, cell.y + 1);
    if (down && ["unexplored", "hit"].includes(down.status)) {
      hasDirection = true;
    }
    cell.isCandidate = hasDirection;
  }
  // count candidate directions
  for (const cell of cells) {
    if (!cell.isCandidate) {
      continue;
    }
    let candidateDirectionCount = 0;
    const left = getCellAt(board, cell.x - 1, cell.y);
    if (left?.isCandidate) {
      candidateDirectionCount++;
    }
    const right = getCellAt(board, cell.x + 1, cell.y);
    if (right?.isCandidate) {
      candidateDirectionCount++;
    }
    const up = getCellAt(board, cell.x, cell.y - 1);
    if (up?.isCandidate) {
      candidateDirectionCount++;
    }
    const down = getCellAt(board, cell.x, cell.y + 1);
    if (down?.isCandidate) {
      candidateDirectionCount++;
    }
    cell.candidateDirectionCount = candidateDirectionCount;
  }
  // mark next to hits
  for (const cell of cells) {
    if (cell.status !== "hit") {
      continue;
    }
    const left = getCellAt(board, cell.x - 1, cell.y);
    const isLeftCandidate = left && left.isCandidate;
    const isLeftHit = left && left.status === "hit";
    const right = getCellAt(board, cell.x + 1, cell.y);
    const isRightCandidate = right && right.isCandidate;
    const isRightHit = right && right.status === "hit";
    const top = getCellAt(board, cell.x, cell.y - 1);
    const isTopCandidate = top && top.isCandidate;
    const isTopHit = top && top.status === "hit";
    const bottom = getCellAt(board, cell.x, cell.y + 1);
    const isBottomCandidate = bottom && bottom.isCandidate;
    const isBottomHit = bottom && bottom.status === "hit";

    if (left && isLeftCandidate) {
      left.isNextToHit = true;
      if (isRightHit) {
        left.isInlineWithHit = true;
      }
    }
    if (right && isRightCandidate) {
      right.isNextToHit = true;
      if (isLeftHit) {
        right.isInlineWithHit = true;
      }
    }
    if (top && isTopCandidate) {
      top.isNextToHit = true;
      if (isBottomHit) {
        top.isInlineWithHit = true;
      }
    }
    if (bottom && isBottomCandidate) {
      bottom.isNextToHit = true;
      if (isTopHit) {
        bottom.isInlineWithHit = true;
      }
    }
  }
};

const tryCell = (cell: Cell): void => {
  cell.element.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
};

export const miner: Feature = {
  settings: [SETTING_MINER, SETTING_MINER_EXPLOSIVES, SETTING_MINER_BOMBS],
  onPageLoad: (settings, page) => {
    if (page !== Page.MINING) {
      return;
    }

    if (!settings[SETTING_MINER.id].value) {
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
      // try again if no attempts left
      const tryAgainButton =
        currentPage.querySelector<HTMLButtonElement>(".resetlevelbtn");
      const attemptsLeft = Number(
        currentPage.querySelector<HTMLSpanElement>("#attempts")?.textContent ??
          "1"
      );
      if (attemptsLeft === 0 && tryAgainButton) {
        tryAgainButton.click();
        return;
      }
      // go to next level if available
      const nextLevelButton =
        currentPage.querySelector<HTMLAnchorElement>(".nextlevelbtn");
      if (nextLevelButton && nextLevelButton.style.display !== "none") {
        nextLevelButton.click();
        return;
      }
      // use explosives if available
      const explosivesButton = currentPage.querySelector<HTMLDivElement>(
        ".useexplosivebtn:not(.disabled)"
      );
      if (explosivesButton) {
        explosivesButton.click();
        return;
      }
      // otherwise use pickaxe
      const picks = currentPage.querySelector<HTMLSpanElement>("#pickaxes");
      if (!picks) {
        return;
      }
      const pickCount = Number(
        picks.textContent?.trim().replaceAll(",", "") || "0"
      );
      // no picks, make more
      if (!pickCount) {
        picks.click();
      }

      // get boared state
      const board: Cell[][] = [];
      const cells = currentPage.querySelectorAll<HTMLElement>(".checkCell");
      const size = Math.sqrt(cells.length);
      for (let rowIndex = 0; rowIndex < size; rowIndex++) {
        board.push([]);
        for (let columnIndex = 0; columnIndex < size; columnIndex++) {
          const cell = cells[rowIndex * size + columnIndex];
          board[rowIndex].push({
            element: cell,
            isMarked: cell.classList.contains("marked"),
            x: Number(cell.dataset.x),
            y: Number(cell.dataset.y),
            status: getStatus(cell),
          });
        }
      }
      // fill in deductions
      fillHints(board);
      // get candidates
      const candidates = board.flat().filter((cell) => cell.isCandidate);
      // get inline with hits first
      const inlineWithHits = candidates.filter((cell) => cell.isInlineWithHit);
      // if there are any, click the first one
      if (inlineWithHits.length > 0) {
        tryCell(inlineWithHits[0]);
        return;
      }
      // get candidates next to hits
      const nextToHits = candidates.filter((cell) => cell.isNextToHit);
      // if there are any, click the first one
      if (nextToHits.length > 0) {
        tryCell(nextToHits[0]);
        return;
      }
      // click the most promising candidate
      const first4DirectionCandidate = candidates.find(
        (cell) => cell.candidateDirectionCount === 4
      );
      if (first4DirectionCandidate) {
        tryCell(first4DirectionCandidate);
        return;
      }

      const first3DirectionCandidate = candidates.find(
        (cell) => cell.candidateDirectionCount === 3
      );
      if (first3DirectionCandidate) {
        tryCell(first3DirectionCandidate);
        return;
      }

      const first2DirectionCandidate = candidates.find(
        (cell) => cell.candidateDirectionCount === 2
      );
      if (first2DirectionCandidate) {
        tryCell(first2DirectionCandidate);
        return;
      }

      // pick a random 1 direction candidate
      tryCell(candidates[Math.floor(Math.random() * candidates.length) || 0]);
    });
    currentPage.append(magicButton);
  },
};
