import { Feature, FeatureSetting } from "../utils/feature";
import { getCurrentPage, Page } from "~/utils/page";
import { SettingId } from "~/utils/settings";

const SETTING_QUICKSELL_SAFELY: FeatureSetting = {
  id: SettingId.QUICKSELL_SAFELY,
  title: "Item: Safe Quick Sell",
  description:
    "If item is locked, also lock the Quick Sell and Quick Give buttons",
  type: "boolean",
  defaultValue: true,
};

export type QuicksellCallback = (event: MouseEvent) => Promise<boolean>;

const state: { onQuicksellClick: QuicksellCallback[] } = {
  onQuicksellClick: [],
};

export const onQuicksellClick = (callback: QuicksellCallback): void => {
  state.onQuicksellClick.push(callback);
};

export const quicksellSafely: Feature = {
  settings: [SETTING_QUICKSELL_SAFELY],
  onPageLoad: (settings, page) => {
    // make sure we're on the right page
    if (page !== Page.ITEM) {
      return;
    }

    const isSafetyOn = settings[SettingId.QUICKSELL_SAFELY];
    const lockButton =
      getCurrentPage()?.querySelector<HTMLButtonElement>(".lockbtn");
    const unlockButton =
      getCurrentPage()?.querySelector<HTMLButtonElement>(".unlockbtn");
    const isLocked = unlockButton && !lockButton;

    const quicksellButton = getCurrentPage()?.querySelector<HTMLButtonElement>(
      ".quicksellbtn, .quicksellbtnnc"
    );
    if (quicksellButton && !quicksellButton.style.display) {
      quicksellButton.style.display = "none";
      const proxyButton = document.createElement("button");
      proxyButton.classList.add("button");
      proxyButton.classList.add(isSafetyOn && isLocked ? "btnred" : "btngreen");
      proxyButton.style.height = "28px;";
      if (!isSafetyOn || !isLocked) {
        proxyButton.textContent = "SELL";
      }
      if (isSafetyOn && isLocked) {
        const lock = document.createElement("i");
        lock.classList.add("f7-icons");
        lock.style.fontSize = "17px";
        lock.textContent = "unlock_fill";
        proxyButton.append(lock);
      }
      proxyButton.addEventListener("click", async (event) => {
        if (isSafetyOn && isLocked) {
          unlockButton.click();
          return;
        }
        for (const callback of state.onQuicksellClick) {
          if (!(await callback(event))) {
            return;
          }
        }
        quicksellButton.click();
      });
      quicksellButton.parentElement?.insertBefore(proxyButton, quicksellButton);
    }
    const quickgiveButton =
      getCurrentPage()?.querySelector<HTMLButtonElement>(".quickgivebtn");
    if (quickgiveButton && !quickgiveButton.style.display) {
      quickgiveButton.style.display = "none";
      const proxyButton = document.createElement("button");
      proxyButton.classList.add("button");
      proxyButton.classList.add(isSafetyOn && isLocked ? "btnred" : "btngreen");
      proxyButton.style.height = "28px;";
      if (!isSafetyOn || !isLocked) {
        proxyButton.textContent = "GIVE";
      }
      if (isSafetyOn && isLocked) {
        const lock = document.createElement("i");
        lock.classList.add("f7-icons");
        lock.style.fontSize = "17px";
        lock.textContent = "unlock_fill";
        proxyButton.append(lock);
      }
      proxyButton.addEventListener("click", async (event) => {
        if (isSafetyOn && isLocked) {
          unlockButton.click();
          return;
        }
        for (const callback of state.onQuicksellClick) {
          if (!(await callback(event))) {
            return;
          }
        }
        quickgiveButton.click();
      });
      quickgiveButton.parentElement?.insertBefore(proxyButton, quickgiveButton);
    }
  },
};
