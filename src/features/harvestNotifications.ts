import {
  CropStatus,
  farmIdState,
  FarmStatus,
  farmStatusState,
  harvestAll,
} from "~/api/farmrpg/apis/farm";
import { Feature, FeatureSetting, SettingValues } from "../utils/feature";
import {
  Handler,
  NotificationId,
  registerNotificationHandler,
  removeNotification,
  sendNotification,
} from "~/utils/notifications";
import { Page } from "~/utils/page";
import { SettingId } from "~/utils/settings";
import { toUrl } from "~/api/farmrpg/utils/requests";

const SETTING_HARVEST_NOTIFICATIONS: FeatureSetting = {
  id: SettingId.HARVEST_NOTIFICATIONS,
  title: "Farm: Harvest Notifications",
  description: `
    Show notification when crops are ready to harvest
  `,
  type: "boolean",
  defaultValue: true,
};

const SETTING_HARVEST_POPUP: FeatureSetting = {
  id: SettingId.HARVEST_POPUP,
  title: "Farm: Harvest Popup",
  description: `
    Show popup on Farm page when crops are harvested with the harvest results including bonuses</br>
    (popup is always shown if havesting from other pages via the notification)
  `,
  type: "boolean",
  defaultValue: true,
};

const SETTING_EMPTY_NOTIFICATIONS: FeatureSetting = {
  id: SettingId.FIELD_EMPTY_NOTIFICATIONS,
  title: "Farm: Empty Notifications",
  description: `
    Show notification when fields are empty
  `,
  type: "boolean",
  defaultValue: true,
};

registerNotificationHandler(Handler.HARVEST, harvestAll);

const renderFields = async (
  settings: SettingValues,
  state: FarmStatus | undefined
): Promise<void> => {
  const farmId = await farmIdState.get();
  if (!state) {
    return;
  }
  if (
    state.status === CropStatus.EMPTY &&
    settings[SettingId.FIELD_EMPTY_NOTIFICATIONS]
  ) {
    sendNotification({
      class: "btnorange",
      id: NotificationId.FIELD,
      text: "Fields are empty!",
      href: toUrl(Page.FARM, new URLSearchParams({ id: String(farmId) })),
      excludePages: [Page.FARM],
    });
  } else if (
    state.status === CropStatus.READY &&
    settings[SettingId.HARVEST_NOTIFICATIONS]
  ) {
    const farmUrl = toUrl(
      Page.FARM,
      new URLSearchParams({ id: String(farmId) })
    );
    sendNotification({
      class: "btngreen",
      id: NotificationId.FIELD,
      text: "Crops are ready!",
      href: farmUrl,
      actions: [
        { text: "View", href: farmUrl },
        {
          text: "Harvest",
          handler: Handler.HARVEST,
        },
      ],
      excludePages: [Page.FARM],
    });
  } else {
    removeNotification(NotificationId.FIELD);
  }
};

export const fieldNotifications: Feature = {
  settings: [
    SETTING_HARVEST_NOTIFICATIONS,
    SETTING_HARVEST_POPUP,
    SETTING_EMPTY_NOTIFICATIONS,
  ],
  onInitialize: (settings) => {
    farmStatusState.onUpdate((state) => renderFields(settings, state));
  },
};
