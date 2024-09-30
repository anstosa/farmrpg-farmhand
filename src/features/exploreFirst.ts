import { Feature, FeatureSetting } from "./feature";
import { getCardByTitle, getTitle, Page } from "~/utils/page";

export const SETTING_EXPLORE_FIRST: FeatureSetting = {
  id: "collapseItem",
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
    if (!settings[SETTING_EXPLORE_FIRST.id].value) {
      return;
    }

    moveSectionUp("Exploring");
    moveSectionUp("Fishing");
    moveSectionUp("Mining");
  },
};
