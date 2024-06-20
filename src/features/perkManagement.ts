import {
  activatePerkSet,
  getActivityPerksSet,
  PerkActivity,
} from "~/api/farmrpg/perks";
import { Feature, FeatureSetting } from "./feature";
import { getCurrentPage, Page } from "~/utils/page";
import {
  Notification,
  removeNotification,
  sendNotification,
} from "~/utils/notifications";
import { onQuicksellClick } from "./quickSellSafely";

export const SETTING_PERK_MANAGER: FeatureSetting = {
  id: "perkManager",
  title: "Perks: Auto manage",
  description: `
    1. Save your default perks set as "Default"<br>
    2. Save perks for "Crafting", "Fishing", "Exploring", "Selling", "Friendship", "Temple", "Locksmish", or "Wheel" activities<br>
    3. Activity perk sets will automatically be enabled for those activities and reverted to "Default" after
  `,
  type: "boolean",
  defaultValue: true,
};

const KEY_NOTIFICATIONS = "activeperks";

const getNotification = (activity: PerkActivity): Notification<never> => ({
  class: "btnorange",
  id: KEY_NOTIFICATIONS,
  text: `${activity} perks activated`,
});

export const perkManagment: Feature = {
  settings: [SETTING_PERK_MANAGER],
  onPageLoad: async (settings, page) => {
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
        getCurrentPage()?.querySelector<HTMLButtonElement>(".quickcraftbtn");
      if (quickcraftButton && !quickcraftButton.style.display) {
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
          removeNotification(KEY_NOTIFICATIONS);
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
      onQuicksellClick(async () => {
        await activatePerkSet(sellingPerks);
        sendNotification(getNotification(PerkActivity.SELLING));
        setTimeout(async () => {
          await activatePerkSet(defaultPerks);
          removeNotification(KEY_NOTIFICATIONS);
        }, 1000);
        return true;
      });
    }

    const friendshipPerks = await getActivityPerksSet(PerkActivity.FRIENDSHIP);
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
        getCurrentPage()?.querySelector<HTMLButtonElement>(".quickgivebtn");
      if (quickgiveButton && !quickgiveButton.style.display) {
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
          removeNotification(KEY_NOTIFICATIONS);
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
    removeNotification(KEY_NOTIFICATIONS);
  },
};
