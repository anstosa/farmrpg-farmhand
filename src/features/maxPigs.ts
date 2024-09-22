import { Feature, FeatureSetting } from "./feature";
import { getCurrentPage, getTitle, Page } from "~/utils/page";

export const SETTING_MAX_ANIMALS: FeatureSetting = {
  id: "maxAnimals",
  title: "Farm: Buy Max Animals",
  description: "Buy max animals by default (instead of 1)",
  type: "boolean",
  defaultValue: true,
};

export const maxPigs: Feature = {
  settings: [SETTING_MAX_ANIMALS],
  onPageLoad: (settings, page) => {
    if (page !== Page.PIG_PEN) {
      return;
    }
    if (!settings[SETTING_MAX_ANIMALS.id].value) {
      return;
    }
    const currentPage = getCurrentPage();

    // max buy pigs
    (() => {
      const pigTitle = getTitle(/Pigs/);
      const match = pigTitle?.textContent?.match(/(\d+) \/ (\d+)/);
      if (!match) {
        return;
      }
      const [_, current, max] = match;
      if (!current || !max) {
        return;
      }
      const maxBuy = Number(max) - Number(current);
      const buyField = currentPage?.querySelector<HTMLInputElement>(".addamt");
      if (!buyField) {
        return;
      }
      buyField.value = maxBuy.toString();
    })();

    // max slaughter
    (() => {
      const slaughterSelector =
        currentPage?.querySelector<HTMLSelectElement>(".levelid");
      if (!slaughterSelector) {
        return;
      }
      if (slaughterSelector.options.length > 1) {
        slaughterSelector.selectedIndex = 1;
      }
      const match =
        slaughterSelector.options[1].textContent?.match(/\((\d+)\)/);
      if (!match) {
        return;
      }
      const maxSlaughter = Number(match[1]);
      const amountField =
        currentPage?.querySelector<HTMLInputElement>(".levelamt");
      if (!amountField) {
        return;
      }
      amountField.value = maxSlaughter.toString();
    })();
  },
};
