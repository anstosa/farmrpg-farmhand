import { Feature, FeatureSetting } from "./feature";
import { Page } from "~/utils/page";

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
    if (page !== Page.LOCKSMITH) {
      return;
    }
    if (!settings[SETTING_MAX_CONTAINERS.id].value) {
      return;
    }

    // get buttons
    const buttons =
      document.querySelectorAll<HTMLButtonElement>("button.lsmaxqty");
    setTimeout(() => {
      for (const button of buttons) {
        button.click();
      }
    }, 150);
  },
};
