import {
  activatePerkSet,
  getActivityPerksSet,
  getPerkSets,
  PerkActivity,
  PerkSet,
} from "~/utils/farmrpgApi";
import { Feature, FeatureSetting } from "./feature";
import {
  Notification,
  removeNotification,
  sendNotification,
} from "~/utils/notifications";
import { Page } from "~/utils/page";

export const SETTING_PERK_MANAGER: FeatureSetting = {
  id: "perkManager",
  title: "Manage Perks",
  description: `
    1. Save your default perks set as "Default"<br>
    2. Save perks for "Crafting", "Fishing", "Exploring" activities<br>
    3. Activity perk sets will automatically be enabled for those activities and reverted to "Default" after
  `,
  type: "boolean",
  defaultValue: true,
};

const state: { currentPerkSet?: PerkSet; perkSets: PerkSet[] } = {
  perkSets: [],
};

const getNotification = (activity?: PerkActivity): Notification<never> => ({
  class: "btnorange",
  id: `activeperks`,
  text: `${activity} perks activated`,
});

export const perkManagment: Feature = {
  settings: [SETTING_PERK_MANAGER],
  onInitialize: async (settings) => {
    if (!settings[SETTING_PERK_MANAGER.id].value) {
      return;
    }
    state.perkSets = await getPerkSets();
  },
  onPageChange: async (settings, page) => {
    // make sure the setting is enabled
    if (!settings[SETTING_PERK_MANAGER.id].value) {
      return;
    }

    const defaultPerks = await getActivityPerksSet(PerkActivity.DEFAULT);

    // make sure we have a default perk set
    if (!defaultPerks) {
      console.warn("Default perk set not found");
      return;
    }

    const craftingPerks = await getActivityPerksSet(PerkActivity.CRAFTING);
    if (craftingPerks && page === Page.WORKSHOP) {
      await activatePerkSet(craftingPerks);
      sendNotification(getNotification(PerkActivity.CRAFTING));
      return;
    }

    if (craftingPerks) {
      const quickcraftButton =
        document.querySelector<HTMLButtonElement>(".quickcraftbtn");
      if (quickcraftButton) {
        quickcraftButton.style.display = "none";
        const proxyButton = document.createElement("button");
        proxyButton.classList.add("button");
        proxyButton.classList.add("btngreen");
        proxyButton.style.height = "28px;";
        proxyButton.textContent = "CRAFT";
        proxyButton.addEventListener("click", async () => {
          await activatePerkSet(craftingPerks);
          sendNotification(getNotification(PerkActivity.CRAFTING));
          quickcraftButton.click();
          await activatePerkSet(defaultPerks);
          removeNotification(getNotification());
        });
        quickcraftButton.parentElement?.insertBefore(
          proxyButton,
          quickcraftButton
        );
      }
    }

    const fishingPerks = await getActivityPerksSet(PerkActivity.FISHING);
    if (fishingPerks && page === Page.FISHING) {
      await activatePerkSet(fishingPerks);
      sendNotification(getNotification(PerkActivity.FISHING));
      return;
    }

    const exploringPerks = await getActivityPerksSet(PerkActivity.EXPLORING);
    if (exploringPerks && page === Page.AREA) {
      await activatePerkSet(exploringPerks);
      sendNotification(getNotification(PerkActivity.EXPLORING));
      return;
    }

    const sellingPerks = await getActivityPerksSet(PerkActivity.SELLING);
    if (sellingPerks && page === Page.FARMERS_MARKET) {
      await activatePerkSet(sellingPerks);
      sendNotification(getNotification(PerkActivity.SELLING));
      return;
    }

    if (sellingPerks) {
      const quicksellButton = document.querySelector<HTMLButtonElement>(
        ".quicksellbtn, .quicksellbtnnc"
      );
      if (quicksellButton) {
        quicksellButton.style.display = "none";
        const proxyButton = document.createElement("button");
        proxyButton.classList.add("button");
        proxyButton.classList.add("btngreen");
        proxyButton.style.height = "28px;";
        proxyButton.textContent = "SELL";
        proxyButton.addEventListener("click", async () => {
          await activatePerkSet(sellingPerks);
          sendNotification(getNotification(PerkActivity.SELLING));
          quicksellButton.click();
          await activatePerkSet(defaultPerks);
          removeNotification(getNotification());
        });
        quicksellButton.parentElement?.insertBefore(
          proxyButton,
          quicksellButton
        );
      }
    }

    const friendshipPerks = await getActivityPerksSet(PerkActivity.WHEEL);
    if (
      friendshipPerks &&
      (page === Page.FRIENDSHIP || page === Page.MAILBOX)
    ) {
      await activatePerkSet(friendshipPerks);
      sendNotification(getNotification(PerkActivity.FRIENDSHIP));
      return;
    }

    if (friendshipPerks) {
      const quickgiveButton =
        document.querySelector<HTMLButtonElement>(".quickgivebtn");
      if (quickgiveButton) {
        quickgiveButton.style.display = "none";
        const proxyButton = document.createElement("button");
        proxyButton.classList.add("button");
        proxyButton.classList.add("btngreen");
        proxyButton.style.height = "28px;";
        proxyButton.textContent = "GIVE";
        proxyButton.addEventListener("click", async () => {
          await activatePerkSet(friendshipPerks);
          sendNotification(getNotification(PerkActivity.FRIENDSHIP));
          quickgiveButton.click();
          await activatePerkSet(defaultPerks);
          removeNotification(getNotification());
        });
        quickgiveButton.parentElement?.insertBefore(
          proxyButton,
          quickgiveButton
        );
      }
    }

    const templePerks = await getActivityPerksSet(PerkActivity.TEMPLE);
    if (templePerks && page === Page.TEMPLE) {
      await activatePerkSet(templePerks);
      sendNotification(getNotification(PerkActivity.TEMPLE));
      return;
    }

    const locksmithPerks = await getActivityPerksSet(PerkActivity.LOCKSMITH);
    if (locksmithPerks && page === Page.LOCKSMITH) {
      await activatePerkSet(locksmithPerks);
      sendNotification(getNotification(PerkActivity.LOCKSMITH));
      return;
    }

    const wheelPerks = await getActivityPerksSet(PerkActivity.WHEEL);
    if (wheelPerks && page === Page.WHEEL) {
      await activatePerkSet(wheelPerks);
      sendNotification(getNotification(PerkActivity.WHEEL));
      return;
    }

    activatePerkSet(defaultPerks);
    removeNotification(getNotification());
  },
};
