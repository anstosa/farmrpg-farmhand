import { Feature, FeatureSetting } from "./feature";
import { Page } from "~/utils/page";

export const SETTING_QUEST_COLLAPSE: FeatureSetting = {
  id: "questCollapse",
  title: "Quest: Global collapse status",
  description:
    "Remember the quest details collapse status globally instead of per-quest",
  type: "boolean",
  defaultValue: true,
};

export const questCollapse: Feature = {
  settings: [SETTING_QUEST_COLLAPSE],
  onPageLoad: (settings, page) => {
    // make sure setting is enabled
    if (!settings[SETTING_QUEST_COLLAPSE.id].value) {
      return;
    }

    // make sure we're on a quest page
    if (page !== Page.QUEST) {
      return;
    }

    // find accordion item
    const accordion = document.querySelector(".accordion-helprequest");
    if (!accordion) {
      console.error("Item header not found");
      return;
    }

    const isCollapsed = !accordion.classList.contains(
      "accordion-item-expanded"
    );
    const link = accordion.querySelector("a");
    if (!link) {
      return;
    }
    link.addEventListener("click", () => {
      setTimeout(() => {
        localStorage.questCollapse = !accordion.classList.contains(
          "accordion-item-expanded"
        );
      }, 500);
    });
    if (isCollapsed && localStorage.questCollapse === "false") {
      accordion.classList.add("accordion-item-expanded");
    }
    if (!isCollapsed && localStorage.questCollapse === "true") {
      accordion.classList.remove("accordion-item-expanded");
    }
  },
};
