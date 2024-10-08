import { Feature } from "./feature";
import { getCurrentPage } from "~/utils/page";
import { isObject } from "./object";

const KEY_NOTIFICATIONS = "notifications";

export enum NotificationId {
  FIELD = "field",
  MAILBOX = "mailbox",
  MEAL = "meal",
  OVEN = "oven",
  PERKS = "perks",
  PETS = "pets",
  UPDATE = "update",
}

export enum Handler {
  CHANGES = "updateChanges",
  COLLECT_MAIL = "collectMail",
  COLLECT_MEALS = "collectMeals",
  COLLECT_PETS = "collectPets",
  HARVEST = "harvest",
  UPDATE = "update",
}

interface TextNotification<T> {
  class?: string;
  id: NotificationId;
  text: string;
  data?: T;
  replacesHref?: string;
  actions?: NotificationAction[];
  excludePages?: string[];
}

interface BaseNotificationAction {
  text: string;
}

interface HandlerNotificationAction extends BaseNotificationAction {
  handler: Handler;
}

interface LinkNotificationAction extends BaseNotificationAction {
  href: string;
}

type NotificationAction = HandlerNotificationAction | LinkNotificationAction;

const isHandlerNotificationAction = (
  action: NotificationAction
): action is HandlerNotificationAction => "handler" in action;

interface LinkNotification<T> extends TextNotification<T> {
  href: string;
}

interface HandlerNotification<T> extends TextNotification<T> {
  handler: Handler;
}

export type Notification<T> =
  | LinkNotification<T>
  | HandlerNotification<T>
  | TextNotification<T>;

const isHandlerNotification = <T>(
  notification: Notification<T>
): notification is HandlerNotification<T> => "handler" in notification;

const isLinkNotification = <T>(
  notification: Notification<T>
): notification is LinkNotification<T> => "href" in notification;

const isTextNotification = <T>(
  notification: Notification<T>
): notification is TextNotification<T> =>
  !isHandlerNotification(notification) && !isLinkNotification(notification);

type NotificationHandler = (notification: Notification<any>) => void;

const state: { notifications: Notification<any>[] } = {
  notifications: [],
};

const notificationHandlers = new Map<Handler, NotificationHandler>();

export const registerNotificationHandler = (
  handlerName: Handler,
  handler: (notification: Notification<any>) => void
): void => {
  notificationHandlers.set(handlerName, handler);
};

export const sendNotification = <T>(notification: Notification<T>): void => {
  state.notifications = [
    ...state.notifications.filter(({ id }) => id !== notification.id),
    notification,
  ];
  renderNotifications(true);
};

export const removeNotification = (
  notification: Notification<any> | Notification<any>["id"]
): void => {
  const notificationId = isObject(notification)
    ? notification.id
    : notification;
  state.notifications = state.notifications.filter(
    ({ id }) => id !== notificationId
  );
  renderNotifications();
};

const renderNotifications = (force: boolean = false): void => {
  const pageContent = getCurrentPage()?.querySelector(".page-content");
  if (!pageContent) {
    console.error("Page content not found");
    return;
  }

  // remove existing notifications
  const notifications = pageContent.querySelectorAll(".fh-notification");
  if (!force && notifications.length === state.notifications.length) {
    return;
  }
  for (const notification of notifications) {
    notification.remove();
  }

  // add new notifications
  for (const notification of state.notifications.toSorted(
    (a, b) => a.id.localeCompare(b.id) || 0
  )) {
    const currentPage = getCurrentPage();

    // skip notifications that are excluded from the current page
    if (notification.excludePages?.includes(currentPage?.dataset.page ?? "")) {
      return;
    }

    // replace native notification if relevant
    if (notification.replacesHref) {
      const link = currentPage?.querySelector<HTMLAnchorElement>(
        `a[href="${notification.replacesHref}"]`
      );
      if (link?.classList?.contains("button")) {
        link.remove();
      }
      if (link?.parentElement?.classList?.contains("button")) {
        link.parentElement.remove();
      }
    }

    const notificationElement = document.createElement(
      isTextNotification(notification) ? "span" : "a"
    );
    notificationElement.classList.add("button");
    notificationElement.classList.add("fh-notification");
    notificationElement.style.cursor = isTextNotification(notification)
      ? "default"
      : "pointer";
    if (notification.class) {
      notificationElement.classList.add(notification.class);
    }
    notificationElement.textContent = notification.text;
    if (isHandlerNotification(notification)) {
      notificationElement.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const handler = notificationHandlers.get(notification.handler);
        if (handler) {
          await handler(notification);
        } else {
          console.error(`Handler not found: ${notification.handler}`);
        }
        removeNotification(notification);
        renderNotifications();
      });
    } else if (isLinkNotification(notification)) {
      notificationElement.setAttribute("href", notification.href);
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

      if (isHandlerNotificationAction(action)) {
        actionElement.addEventListener("click", async (event) => {
          actionElement.textContent = "Loading...";
          event.preventDefault();
          event.stopPropagation();
          const handler = notificationHandlers.get(action.handler);
          if (handler) {
            await handler(notification);
          } else {
            console.error(`Handler not found: ${action.handler}`);
          }
          renderNotifications();
        });
      } else {
        actionElement.href = action.href;
      }
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
  onPageLoad: () => {
    setTimeout(renderNotifications, 500);
  },
};
