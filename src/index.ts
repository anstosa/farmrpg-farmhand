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

const FEATURES = [
  // internal
  notifications,
  autocomplete,

  // almanac
  buddyFarm,

  // bank
  banker,

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

  // listen for location changes
  let oldHref = document.location.href;
  const { body } = document;
  const observer = new MutationObserver(() => {
    if (oldHref !== document.location.href) {
      oldHref = document.location.href;
      const [page, parameters] = getPage();
      console.debug("Page Change", page, parameters);
      onPageChange(page, parameters);
    }
  });
  observer.observe(body, { childList: true, subtree: true });

  // process first page
  setTimeout(() => onPageChange(...getPage()));
})();
