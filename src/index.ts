import { autocomplete } from "./utils/autocomplete";
import { autocompleteItems } from "./features/autocompleteItems";
import { autocompleteUsers } from "./features/autocompleteUsers";
import { banker } from "./features/banker";
import { buddyFarm } from "~/features/buddyfarm";
import { compressChat } from "./features/compressChat";
import { customNavigation } from "./features/customNavigation";
import { dismissableChatBanners } from "./features/dismissableChatBanners";
import { farmhandSettings, getSettings } from "./features/farmhandSettings";
import { getPage, Page } from "~/utils/page";
import { highlightSelfInChat } from "./features/highlightSelfInChat";
import { navigationStyle } from "./features/compressNavigation";
import { notifications } from "./utils/notifications";
import { perkManagment } from "./features/perkManagement";

const FEATURES = [
  // internal
  notifications,
  autocomplete,

  // almanac
  buddyFarm,

  // bank
  banker,

  // explore
  perkManagment,

  // chat
  compressChat,
  dismissableChatBanners,
  highlightSelfInChat,
  autocompleteItems,
  autocompleteUsers,

  // nav
  navigationStyle,
  customNavigation,

  // settings
  farmhandSettings,
];

const onPageChange = async (
  page: Page | undefined,
  parameters: URLSearchParams
): Promise<void> => {
  const settings = await getSettings(FEATURES);
  for (const { onPageChange } of FEATURES) {
    if (onPageChange) {
      onPageChange(settings, page, parameters);
    }
  }
};

// eslint-disable-next-line unicorn/prefer-top-level-await
(async function () {
  // eslint-disable-next-line unicorn/prefer-module
  "use strict";
  console.info("STARTING Farmhand by Ansel Santosa");

  // initialize
  const settings = await getSettings(FEATURES);
  for (const { onInitialize } of FEATURES) {
    if (onInitialize) {
      onInitialize(settings);
    }
  }

  const pages = document.querySelector(".view-main .pages");
  if (!pages) {
    console.error("Pages not found");
    return;
  }
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      // only respond to tree changes
      if (mutation.type !== "childList") {
        continue;
      }
      // ignore removals
      if (mutation.addedNodes.length === 0) {
        continue;
      }
      const [page, parameters] = getPage();
      console.debug("Page Load", page, parameters);
      onPageChange(page, parameters);
    }
  });
  observer.observe(pages, { childList: true });
})();
