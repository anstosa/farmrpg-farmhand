import {
  collectMailbox,
  MailboxState,
  mailboxState,
} from "~/api/farmrpg/apis/mail";
import { Feature } from "../utils/feature";
import {
  Handler,
  NotificationId,
  registerNotificationHandler,
  removeNotification,
  sendNotification,
} from "~/utils/notifications";
import { Page } from "~/utils/page";
import { toUrl } from "~/api/farmrpg/utils/requests";

registerNotificationHandler(Handler.COLLECT_MAIL, collectMailbox);

const renderNotification = async (state?: MailboxState): Promise<void> => {
  state = state ?? (await mailboxState.get());
  if (!state) {
    return;
  }
  let mailboxCount = 0;
  for (const mail of state.contents) {
    mailboxCount += mail.count;
  }
  if (!state || state.contents.length === 0) {
    removeNotification(NotificationId.MAILBOX);
    return;
  }

  sendNotification({
    class: "btnpurple",
    id: NotificationId.MAILBOX,
    text: `Mailbox is ready! (${mailboxCount} / ${state.size})`,
    href: toUrl(Page.POST_OFFICE),
    replacesHref: `${Page.POST_OFFICE}.php`,
    actions: [
      {
        text: "View",
        href: toUrl(Page.POST_OFFICE),
      },
      {
        text: "Collect",
        handler: Handler.COLLECT_MAIL,
      },
    ],
    excludePages: [Page.POST_OFFICE],
  });
};

export const mailboxNotifications: Feature = {
  onInitialize: () => {
    mailboxState.onUpdate((state) => renderNotification(state));
  },
  onNotificationLoad: () => {
    const mailboxNotification = document.querySelector(
      `a[href="${Page.POST_OFFICE}.php"].button.btnpurple`
    );
    if (mailboxNotification) {
      renderNotification();
    }
  },
};
