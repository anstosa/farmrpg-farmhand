import { Feature, FeatureSetting } from "../utils/feature";
import { getData, setData, SettingId } from "~/utils/settings";
import { getListByTitle, Page } from "~/utils/page";
import { TEXT_GRAY } from "~/utils/theme";

const SETTING_QUEST_TAGGING: FeatureSetting = {
  id: SettingId.QUEST_TAGGING,
  title: "Quest: Tagging",
  description: `Mark requests as high or low priority`,
  type: "boolean",
  defaultValue: true,
};

interface Quest {
  element: HTMLElement;
  id: string;
  isLow: boolean;
  isStarred: boolean;
  title: string;
}

const renderQuests = async (): Promise<void> => {
  const { starred, low } = await getData<{ starred: string[]; low: string[] }>(
    SETTING_QUEST_TAGGING,
    { starred: [], low: [] }
  );
  const list = getListByTitle(/Active Requests/);
  if (!list) {
    return;
  }
  const quests: Quest[] = [];
  for (const element of list.querySelectorAll("li")) {
    const id = element
      .querySelector("a")
      ?.getAttribute("href")
      ?.split("?id=")[1];
    if (!id) {
      continue;
    }
    const title =
      element.querySelector(".item-title strong")?.textContent || "";
    const isLow = low.includes(id);
    const isStarred = starred.includes(id);
    quests.push({ element, id, isLow, isStarred, title });
    const progress =
      element.querySelector<HTMLSpanElement>(".progressbar span");
    if (progress) {
      progress.style.backgroundColor = isStarred ? "gold" : "#007aff";
    }
    element.querySelector(".item-media")?.setAttribute(
      "style",
      `
        opacity: ${isLow ? 0.65 : 1};
        filter: grayscale(${isLow ? 100 : 0}%)
      `
    );
    element.querySelector(".item-inner")?.setAttribute(
      "style",
      `
        opacity: ${isLow ? 0.65 : 1};
        filter: grayscale(${isLow ? 100 : 0}%)
      `
    );
    element.remove();
    element.querySelector(".fh-quest-buttons")?.remove();
    const buttons = document.createElement("div");
    buttons.className = "fh-quest-buttons";
    buttons.style.height = "45px";
    buttons.style.display = "flex";
    buttons.style.flexDirection = "column";
    buttons.style.alignItems = "center";
    buttons.style.justifyContent = "space-between";
    buttons.style.marginRight = "15px";
    const starButton = document.createElement("i");
    starButton.className = "fas fa-fw fa-star";
    starButton.style.color = isStarred ? "gold" : TEXT_GRAY;
    starButton.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (starred.includes(id)) {
        starred.splice(starred.indexOf(id), 1);
      } else {
        starred.push(id);
      }
      await setData(SETTING_QUEST_TAGGING, { starred, low });
      renderQuests();
    });
    const lowButton = document.createElement("i");
    lowButton.className = "fas fa-fw fa-chevron-down";
    lowButton.style.color = isLow ? "#007aff" : TEXT_GRAY;
    lowButton.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (low.includes(id)) {
        low.splice(low.indexOf(id), 1);
      } else {
        low.push(id);
      }
      await setData(SETTING_QUEST_TAGGING, { starred, low });
      renderQuests();
    });
    buttons.append(starButton);
    buttons.append(lowButton);
    element.querySelector(".item-content")?.prepend(buttons);
  }
  quests.sort((a, b) => {
    if (a.isStarred && !b.isStarred) {
      return -1;
    }
    if (!a.isStarred && b.isStarred) {
      return 1;
    }
    if (a.isLow && !b.isLow) {
      return 1;
    }
    if (!a.isLow && b.isLow) {
      return -1;
    }
    return a.title.localeCompare(b.title);
  });
  for (const quest of quests) {
    list.append(quest.element);
  }
};

export const questTagging: Feature = {
  settings: [SETTING_QUEST_TAGGING],
  onPageLoad: (settings, page) => {
    // make sure setting is enabled
    if (!settings[SettingId.QUEST_TAGGING]) {
      return;
    }

    // make sure we're on the quests page
    if (page !== Page.QUESTS) {
      return;
    }

    // load quests
    renderQuests();
  },
};
