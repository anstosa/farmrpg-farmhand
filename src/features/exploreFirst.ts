import { Feature, FeatureSetting } from "../utils/feature";
import { getCardByTitle, getTitle, Page } from "~/utils/page";
import { SettingId } from "~/utils/settings";

const SETTING_EXPLORE_FIRST: FeatureSetting = {
  id: SettingId.EXPLORE_FIRST,
  title: "Item: Prioritize Explore",
  description: "Move Exploring, Fishing, and Mining above Crafting and Cooking",
  type: "boolean",
  defaultValue: true,
};

const moveSectionUp = (title: string): void => {
  const itemDetailsCard = getCardByTitle("Item Details");
  if (!itemDetailsCard) {
    return;
  }
  const titleElement = getTitle(title);
  const cardElement = titleElement?.nextElementSibling;
  const listElement = cardElement?.nextElementSibling;
  if (listElement) {
    itemDetailsCard.after(listElement);
  }
  if (cardElement) {
    itemDetailsCard.after(cardElement);
  }
  if (titleElement) {
    itemDetailsCard.after(titleElement);
  }
};

export const exploreFirst: Feature = {
  settings: [SETTING_EXPLORE_FIRST],
  onPageLoad: (settings, page) => {
    // make sure we're on the item page
    if (page !== Page.ITEM) {
      return;
    }

    // make sure we're enabled
    if (!settings[SettingId.EXPLORE_FIRST]) {
      return;
    }

    moveSectionUp("Exploring");
    moveSectionUp("Fishing");
    moveSectionUp("Mining");
  },
};
