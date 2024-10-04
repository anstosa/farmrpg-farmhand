import { autocomplete } from "./utils/autocomplete";
import { autocompleteItems } from "./features/autocompleteItems";
import { autocompleteUsers } from "./features/autocompleteUsers";
import { banker } from "./features/banker";
import { buddyFarm } from "~/features/buddyfarm";
import { chatNav } from "./features/chatNav";
import { cleanupExplore } from "./features/cleanupExplore";
import { cleanupHome } from "./features/cleanupHome";
import { collapseItemImage } from "./features/collapseItemImage";
import { compactSilver } from "./features/compactSilver";
import { compressChat } from "./features/compressChat";
import { confirmations } from "./utils/confirmation";
import { customNavigation } from "./features/customNavigation";
import { dismissableChatBanners } from "./features/dismissableChatBanners";
import { exploreFirst } from "./features/exploreFirst";
import { farmhandSettings, getSettings } from "./features/farmhandSettings";
import { fieldNotifications } from "./features/harvestNotifications";
import { fishinInBarrel } from "./features/fishInBarrel";
import { fleaMarket } from "./features/fleaMarket";
import { getCurrentPage, getPage } from "~/utils/page";
import { highlightSelfInChat } from "./features/highlightSelfInChat";
import { improvedInputs } from "./features/improvedInputs";
import { kitchenNotifications } from "./features/kitchenNotifications";
import { linkifyQuickCraft } from "./features/linkifyQuickCraft";
import { mailboxNotifications } from "./features/mailboxNotifications";
import { maxContainers } from "./features/maxContainers";
import { maxCows } from "./features/maxCows";
import { maxPigs } from "./features/maxPigs";
import { mealNotifications } from "./features/mealNotifications";
import { miner } from "./features/miner";
import { moveUpdateToTop } from "./features/moveUpdateToTop";
import { navigationStyle } from "./features/compressNavigation";
import { notifications } from "./utils/notifications";
import { perkManagment } from "./features/perkManagement";
import { petNotifications } from "./features/petNotifications";
import { popups } from "./utils/popup";
import { queryInterceptors, urlMatches, watchQueries } from "./api/state";
import { questCollapse } from "./features/questCollapse";
import { quests } from "./features/quests";
import { quicksellSafely } from "./features/quickSellSafely";
import { vaultSolver } from "./features/vaultSolver";
import { versionManager } from "./features/versionManager";

export const FEATURES = [
  // internal
  notifications,
  confirmations,
  popups,
  autocomplete,
  versionManager,

  // UI
  improvedInputs,

  // home
  cleanupHome,
  moveUpdateToTop,

  // kitchen
  kitchenNotifications,
  mealNotifications,

  // farm,
  fieldNotifications,
  maxPigs,
  maxCows,

  // flea market
  fleaMarket,

  // items
  buddyFarm,
  collapseItemImage,
  quicksellSafely,
  linkifyQuickCraft,
  exploreFirst,

  // quests
  quests,
  questCollapse,
  compactSilver,

  // bank
  banker,

  // mailbox
  mailboxNotifications,

  // pets
  petNotifications,

  // vault
  vaultSolver,

  // mining
  miner,

  // locksmith
  maxContainers,

  // fishing
  fishinInBarrel,

  // explore
  perkManagment,
  cleanupExplore,

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
  handler:
    | "onPageLoad"
    | "onChatLoad"
    | "onMenuLoad"
    | "onQuestLoad"
    | "onNotificationLoad",
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

  // initialize
  const settings = await getSettings(FEATURES);
  for (const { onInitialize } of FEATURES) {
    if (onInitialize) {
      onInitialize(settings);
    }
  }

  // run any interceptors for the first page
  const currentPage = getCurrentPage();
  if (currentPage) {
    for (const [state, interceptor] of queryInterceptors) {
      const url = window.location.href.replace("/index.php#!", "");
      if (urlMatches(url, ...interceptor.match)) {
        const previous = await state.get({ doNotFetch: true });
        interceptor.callback(settings, state, previous, {
          headers: new Headers(),
          ok: true,
          redirected: false,
          status: 200,
          statusText: "OK",
          type: "default",
          url,
          text: () => Promise.resolve(currentPage.innerHTML),
          json: () => Promise.resolve({}),
          formData: () => Promise.resolve(new FormData()),
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
          blob: () => Promise.resolve(new Blob([])),
        });
      }
    }
  }

  await watchQueries(settings);

  // double watches because the page and nav load at different times but
  // separating the handlers makes everything harder
  watchSubtree(".view-main .pages", "onPageLoad", ".page");
  watchSubtree(".view-main .navbar", "onPageLoad", ".navbar-inner");
  watchSubtree(".view-main .pages", "onNotificationLoad", ".page > .button");
  // watch quest popup
  watchSubtree(".view-main .toolbar", "onQuestLoad");
  // watch menu
  watchSubtree(".view-left", "onMenuLoad");
  // watch desktop and mobile versions of chat
  watchSubtree("#mobilechatpanel", "onChatLoad");
  watchSubtree("#desktopchatpanel", "onChatLoad");
})();
