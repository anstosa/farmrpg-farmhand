import { collectPets, petState } from "~/api/farmrpg/pets";
import { Feature } from "./feature";
import {
  Handler,
  NotificationId,
  registerNotificationHandler,
  removeNotification,
  sendNotification,
} from "~/utils/notifications";
import { MailboxContent } from "~/api/farmrpg/mail";
import { Page } from "~/utils/page";
import { toUrl } from "~/api/state";

registerNotificationHandler(Handler.COLLECT_PETS, collectPets);

const renderNotification = async (state?: MailboxContent[]): Promise<void> => {
  state = state ?? (await petState.get());
  if (!state) {
    return;
  }
  let petCount = 0;
  for (const mail of state) {
    petCount += mail.count;
  }
  if (!state || state?.length === 0) {
    removeNotification(NotificationId.PETS);
    return;
  }

  sendNotification({
    class: "btnorange",
    id: NotificationId.PETS,
    text: `Your pets have ${petCount} items ready!`,
    href: toUrl(Page.PETS),
    replacesHref: `${Page.PETS}.php?${new URLSearchParams({
      from: "home",
    }).toString()}`,
    actions: [
      {
        text: "View",
        href: toUrl(Page.PETS),
      },
      {
        text: "Collect",
        handler: Handler.COLLECT_PETS,
      },
    ],
    excludePages: [Page.PETS],
  });
};

export const petNotifications: Feature = {
  onInitialize: () => {
    petState.onUpdate((state) => renderNotification(state));
  },
  onNotificationLoad: () => {
    const petsNotification = document.querySelector(
      `a[href="${Page.PETS}.php?from=home"]`
    );
    if (petsNotification) {
      renderNotification();
    }
  },
};
