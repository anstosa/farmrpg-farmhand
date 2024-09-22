import { Feature } from "./feature";
import { getCurrentPage, getTitle, Page } from "~/utils/page";
import { SETTING_MAX_ANIMALS } from "./maxPigs";

export const maxCows: Feature = {
  onPageLoad: (settings, page) => {
    if (page !== Page.PASTURE) {
      return;
    }
    if (!settings[SETTING_MAX_ANIMALS.id].value) {
      return;
    }
    const currentPage = getCurrentPage();

    // max buy cows
    (() => {
      const pigTitle = getTitle(/Cows/);
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
