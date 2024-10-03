import {
  collectAll,
  KitchenStatus,
  kitchenStatusState,
  OvenStatus,
} from "~/api/farmrpg/kitchen";
import { Feature, FeatureSetting, Settings } from "./feature";
import {
  Handler,
  NotificationId,
  registerNotificationHandler,
  removeNotification,
  sendNotification,
} from "~/utils/notifications";
import { Page } from "~/utils/page";
import { toUrl } from "~/api/state";

const SETTING_COMPLETE_NOTIFICATIONS: FeatureSetting = {
  id: "harvestNotifications",
  title: "Kitchen: Meals ready notification",
  description: `
    Show notification when meals are ready to collect
  `,
  type: "boolean",
  defaultValue: true,
};

const SETTING_ATTENTION_NOTIFICATIONS: FeatureSetting = {
  id: "attentionNotifications",
  title: "Kitchen: Ovens attention notification",
  description: `
    Show notification when ovens need attention
  `,
  type: "boolean",
  defaultValue: true,
};

const SETTING_ATTENTION_VERBOSE: FeatureSetting = {
  id: "attentionNotificationsVerbose",
  title: "Kitchen: Ovens attention notification (all actions)",
  description: `
    Show notifications when any oven needs attention for any action
    (normally only shows when all three actions are available for all ovens)
  `,
  type: "boolean",
  defaultValue: false,
};

const SETTING_EMPTY_NOTIFICATIONS: FeatureSetting = {
  id: "emptyNotifications",
  title: "Kitchen: Ovens empty notification",
  description: `
    Show notification when ovens are empty
  `,
  type: "boolean",
  defaultValue: true,
};

registerNotificationHandler(Handler.COLLECT_MEALS, collectAll);

const renderOvens = async (
  settings: Settings,
  state: KitchenStatus | undefined
): Promise<void> => {
  if (!state) {
    return;
  }
  if (
    state.status === OvenStatus.EMPTY &&
    settings[SETTING_EMPTY_NOTIFICATIONS.id].value
  ) {
    sendNotification({
      class: "btnorange",
      id: NotificationId.OVEN,
      text: "Ovens are empty!",
      href: toUrl(Page.KITCHEN, new URLSearchParams()),
    });
  } else if (
    state.status === OvenStatus.ATTENTION &&
    settings[SETTING_ATTENTION_NOTIFICATIONS.id].value
  ) {
    const state = await kitchenStatusState.get();
    if (settings[SETTING_ATTENTION_VERBOSE.id].value || state?.allReady) {
      sendNotification({
        class: "btnorange",
        id: NotificationId.OVEN,
        text: "Ovens need attention",
        href: toUrl(Page.KITCHEN, new URLSearchParams()),
      });
    }
  } else if (
    state.status === OvenStatus.READY &&
    settings[SETTING_COMPLETE_NOTIFICATIONS.id].value
  ) {
    sendNotification({
      class: "btngreen",
      id: NotificationId.OVEN,
      text: "Meals are ready!",
      href: toUrl(Page.KITCHEN, new URLSearchParams()),
      actions: [
        { text: "View", href: toUrl(Page.KITCHEN, new URLSearchParams()) },
        {
          text: "Collect",
          handler: Handler.COLLECT_MEALS,
        },
      ],
    });
  } else {
    removeNotification(NotificationId.OVEN);
  }
};

export const kitchenNotifications: Feature = {
  settings: [
    SETTING_COMPLETE_NOTIFICATIONS,
    SETTING_ATTENTION_NOTIFICATIONS,
    SETTING_ATTENTION_VERBOSE,
    SETTING_EMPTY_NOTIFICATIONS,
  ],
  onInitialize: (settings) => {
    kitchenStatusState.onUpdate((state) => renderOvens(settings, state));
  },
};
