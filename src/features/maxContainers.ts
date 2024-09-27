import { debounce } from "~/utils/debounce";
import { Feature, FeatureSetting } from "./feature";
import { getCurrentPage, Page } from "~/utils/page";

export const SETTING_MAX_CONTAINERS: FeatureSetting = {
  id: "maxContainers",
  title: "Locksmith: Max containers",
  description: "Open max containers by default (instead of 1)",
  type: "boolean",
  defaultValue: true,
};

export const maxContainers: Feature = {
  settings: [SETTING_MAX_CONTAINERS],
  onPageLoad: (settings, page) => {
    if (!settings[SETTING_MAX_CONTAINERS.id].value) {
      return;
    }
    if (page !== Page.LOCKSMITH) {
      return;
    }
    const currentPage = getCurrentPage();
    if (!currentPage) {
      return;
    }
    const observer = new MutationObserver(
      debounce(() => {
        // get inputs
        const inputs = document.querySelectorAll<HTMLInputElement>(
          "input.qty[type='number']"
        );
        // if we only have 1 input, we can't be sure whether the user or the app changed it
        if (inputs.length <= 1) {
          return;
        }
        // if any of them are not 1, the app didn't do it
        if ([...inputs].some((input) => ["0", "1"].includes(input.value))) {
          return;
        }
        // get buttons
        const buttons =
          document.querySelectorAll<HTMLButtonElement>("button.lsmaxqty");
        for (const button of buttons) {
          button.click();
        }
      })
    );
    observer.observe(currentPage, { childList: true, subtree: true });
  },
};
