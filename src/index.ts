import { autocomplete } from "./utils/autocomplete";
import { autocompleteItems } from "./features/autocompleteItems";
import { autocompleteUsers } from "./features/autocompleteUsers";
import { banker } from "./features/banker";
import { buddyFarm } from "~/features/buddyfarm";
import { chatNav } from "./features/chatNav";
import { cleanupHome } from "./features/cleanupHome";
import { collapseItemImage } from "./features/collapseItemImage";
import { compressChat } from "./features/compressChat";
import { confirmations } from "./utils/confirmation";
import { customNavigation } from "./features/customNavigation";
import { dismissableChatBanners } from "./features/dismissableChatBanners";
import { farmhandSettings, getSettings } from "./features/farmhandSettings";
import { fieldNotifications } from "./features/harvestNotifications";
import { fishinInBarrel } from "./features/fishInBarrel";
import { getPage } from "~/utils/page";
import { highlightSelfInChat } from "./features/highlightSelfInChat";
import { kitchenNotifications } from "./features/kitchenNotifications";
import { linkifyQuickCraft } from "./features/linkifyQuickCraft";
import { mealNotifications } from "./features/mealNotifications";
import { moveUpdateToTop } from "./features/moveUpdateToTop";
import { navigationStyle } from "./features/compressNavigation";
import { notifications } from "./utils/notifications";
import { perkManagment } from "./features/perkManagement";
import { popups } from "./utils/popup";
import { quests } from "./features/quests";
import { quicksellSafely } from "./features/quickSellSafely";
import { vaultSolver } from "./features/vaultSolver";
import { versionManager } from "./features/versionManager";
import { watchQueries } from "./api/state";

const FEATURES = [
  // internal
  notifications,
  confirmations,
  popups,
  autocomplete,
  versionManager,

  // home
  cleanupHome,
  moveUpdateToTop,

  // kitchen
  kitchenNotifications,
  mealNotifications,

  // farm,
  fieldNotifications,

  // items
  buddyFarm,
  collapseItemImage,
  quicksellSafely,
  linkifyQuickCraft,

  // quests
  quests,

  // bank
  banker,

  // vault
  vaultSolver,

  // fishing
  fishinInBarrel,

  // explore
  perkManagment,

  // chat
  chatNav,
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

const watchSubtree = (
  selector: string,
  handler: "onPageLoad" | "onChatLoad" | "onMenuLoad" | "onQuestLoad",
  filter?: string
): void => {
  const target = document.querySelector(selector);
  if (!target) {
    console.error(`${selector} not found`);
    return;
  }
  const handle = async (): Promise<void> => {
    const settings = await getSettings(FEATURES);
    const [page, parameters] = getPage();
    // console.debug(`${selector} Load`, page, parameters);
    for (const feature of FEATURES) {
      feature[handler]?.(settings, page, parameters);
    }
  };

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      // only respond to tree changes
      if (mutation.type !== "childList") {
        continue;
      }
      if (mutation.addedNodes.length === 0) {
        continue;
      }
      if (filter) {
        for (const node of mutation.addedNodes) {
          if ((node as HTMLElement).matches?.(filter)) {
            handle();
          }
        }
      } else {
        handle();
      }
    }
  });
  observer.observe(target, { childList: true, subtree: true });
  handle();
};

// eslint-disable-next-line unicorn/prefer-top-level-await
(async function () {
  // eslint-disable-next-line unicorn/prefer-module
  "use strict";
  console.info("STARTING Farmhand by Ansel Santosa");

  await watchQueries();

  // initialize
  const settings = await getSettings(FEATURES);
  for (const { onInitialize } of FEATURES) {
    if (onInitialize) {
      onInitialize(settings);
    }
  }

  // double watches because the page and nav load at different times but
  // separating the handlers makes everything harder
  watchSubtree(".view-main .pages", "onPageLoad", ".page");
  watchSubtree(".view-main .navbar", "onPageLoad", ".navbar-inner");
  // watch quest popup
  watchSubtree(".view-main .toolbar", "onQuestLoad");
  // watch menu
  watchSubtree(".view-left", "onMenuLoad");
  // watch desktop and mobile versions of chat
  watchSubtree("#mobilechatpanel", "onChatLoad");
  watchSubtree("#desktopchatpanel", "onChatLoad");
})();
