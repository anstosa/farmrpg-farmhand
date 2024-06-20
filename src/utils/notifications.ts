import { Feature } from "../features/feature";
import { getCurrentPage } from "~/utils/page";
import { getData, setData } from "../features/farmhandSettings";

const KEY_NOTIFICATIONS = "notifications";

interface BaseNotification {
  class?: string;
  handlerName?: string;
  id: string;
  text: string;
  replacesHref?: string;
  actions?: { text: string; handlerName: string }[];
}

export type Notification<T> = BaseNotification & { data?: T };

type NotificationHandler = (notification: Notification<any>) => void;

const state: { notifications: Notification<any>[] } = {
  notifications: [],
};

const notificationHandlers = new Map<string, NotificationHandler>();

export const registerNotificationHandler = (
  handlerName: string,
  handler: (notification: Notification<any>) => void
): void => {
  notificationHandlers.set(handlerName, handler);
};

export const sendNotification = async <T>(
  notification: Notification<T>
): Promise<void> => {
  state.notifications = [
    ...state.notifications.filter(({ id }) => id !== notification.id),
    notification,
  ];
  await setData(KEY_NOTIFICATIONS, state.notifications);
  renderNotifications();
};

export const removeNotification = async (
  notification: Notification<any> | Notification<any>["id"]
): Promise<void> => {
  const notificationId =
    typeof notification === "string" ? notification : notification.id;
  state.notifications = state.notifications.filter(
    ({ id }) => id !== notificationId
  );
  await setData(KEY_NOTIFICATIONS, state.notifications);
  renderNotifications();
};

const renderNotifications = (): void => {
  const pageContent = getCurrentPage()?.querySelector(".page-content");
  if (!pageContent) {
    console.error("Page content not found");
    return;
  }

  // remove existing notifications
  const notifications = document.querySelectorAll(".fh-notification");
  if (notifications.length === state.notifications.length) {
    return;
  }
  for (const notification of notifications) {
    notification.remove();
  }

  // add new notifications
  for (const notification of state.notifications) {
    if (notification.replacesHref) {
      getCurrentPage()
        ?.querySelector<HTMLAnchorElement>(
          `a[href="${notification.replacesHref}"]`
        )
        ?.remove();
    }
    const notificationElement = document.createElement(
      notification.handlerName ? "a" : "span"
    );
    notificationElement.classList.add("button");
    notificationElement.classList.add("fh-notification");
    notificationElement.style.cursor = notification.handlerName
      ? "pointer"
      : "default";
    if (notification.class) {
      notificationElement.classList.add(notification.class);
    }
    notificationElement.textContent = notification.text;
    if (notification.handlerName) {
      notificationElement.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const handler = notificationHandlers.get(
          notification.handlerName ?? ""
        );
        if (handler) {
          await handler(notification);
        } else {
          console.error(`Handler not found: ${notification.handlerName}`);
        }
        removeNotification(notification);
        renderNotifications();
      });
    }

    for (const action of notification.actions ?? []) {
      notificationElement.append(
        document.createTextNode(
          notification.actions?.indexOf(action) === 0 ? " " : " / "
        )
      );
      const actionElement = document.createElement("a");
      actionElement.classList.add("fh-notification-action");
      actionElement.style.cursor = "pointer";
      actionElement.textContent = action.text;
      actionElement.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const handler = notificationHandlers.get(action.handlerName);
        if (handler) {
          await handler(notification);
        } else {
          console.error(`Handler not found: ${action.handlerName}`);
        }
        renderNotifications();
      });
      notificationElement.append(actionElement);
    }

    if (
      pageContent.firstElementChild?.classList.contains("pull-to-refresh-layer")
    ) {
      pageContent.insertBefore(notificationElement, pageContent.children[1]);
    } else {
      pageContent.prepend(notificationElement);
    }
  }
};

export const notifications: Feature = {
  onInitialize: async () => {
    const savedNotifications = await getData<Notification<any>[]>(
      KEY_NOTIFICATIONS,
      []
    );
    state.notifications = savedNotifications;
  },
  onPageLoad: () => {
    setTimeout(renderNotifications, 500);
  },
};
