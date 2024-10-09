import { Feature, FeatureSetting } from "../utils/feature";
import { getData, setData, SettingId } from "~/utils/settings";
import { Page } from "~/utils/page";

interface questCollapseData {
  questCollapse: boolean;
}

const SETTING_QUEST_COLLAPSE: FeatureSetting = {
  id: SettingId.QUEST_COLLAPSE,
  title: "Quest: Global collapse status",
  description:
    "Remember the quest details collapse status globally instead of per-quest",
  type: "boolean",
  defaultValue: true,
};

export const questCollapse: Feature = {
  settings: [SETTING_QUEST_COLLAPSE],
  onPageLoad: async (settings, page) => {
    // make sure setting is enabled
    if (!settings[SettingId.QUEST_COLLAPSE]) {
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
    const questCollapse = await getData<questCollapseData>(
      SettingId.QUEST_COLLAPSE,
      {
        questCollapse: true,
      }
    );
    link.addEventListener("click", () => {
      setTimeout(() => {
        setData(SettingId.QUEST_COLLAPSE, {
          questCollapse: !accordion.classList.contains(
            "accordion-item-expanded"
          ),
        });
      }, 500);
    });
    if (isCollapsed && !questCollapse) {
      accordion.classList.add("accordion-item-expanded");
    }
    if (!isCollapsed && questCollapse) {
      accordion.classList.remove("accordion-item-expanded");
    }
  },
};
