import { BACKGROUND_DARK, BORDER_GRAY } from "~/utils/theme";
import { Feature, FeatureSetting } from "../utils/feature";
import { playerMailboxState } from "~/api/farmrpg/apis/userMailboxes";
import { SettingId } from "~/utils/settings";
import { userState } from "~/api/farmrpg/apis/users";

const SETTING_CHAT_MAILBOX_STATS: FeatureSetting = {
  id: SettingId.CHAT_MAILBOX_STATS,
  title: "Chat: Mailbox Size",
  description: "Show mailbox Size next to usernames in chat",
  type: "boolean",
  defaultValue: true,
};

const openInfoPopup = async (userElement: HTMLAnchorElement): Promise<void> => {
  const formatter = new Intl.NumberFormat();
  closeInfoPopups();
  const username = userElement.textContent;
  if (!username) {
    return;
  }
  userElement.classList.add("fh-mailbox-info-loading");
  const user = await userState.get({ query: username });
  const mailbox = await playerMailboxState.get({ query: username });
  if (userElement.dataset.popup !== "open") {
    userElement.classList.remove("fh-mailbox-info-loading");
    return;
  }
  if (!user || !mailbox) {
    userElement.classList.remove("fh-mailbox-info-loading");
    return;
  }
  const wrapper = userElement.parentElement;
  if (!wrapper) {
    userElement.classList.remove("fh-mailbox-info-loading");
    return;
  }
  wrapper.style.position = "relative";
  const infoPopup = document.createElement("div");
  infoPopup.classList.add("fh-mailbox-info");
  infoPopup.style.display = "flex";
  infoPopup.style.flexDirection = "column";
  infoPopup.style.alignItems = "start";
  infoPopup.style.gap = "5px";
  infoPopup.style.padding = "5px";
  infoPopup.style.position = "absolute";
  infoPopup.style.backgroundColor = BACKGROUND_DARK;
  infoPopup.style.borderWidth = "1px";
  infoPopup.style.borderStyle = "solid";
  infoPopup.style.borderColor = BORDER_GRAY;
  infoPopup.style.top = "15px";
  infoPopup.style.left = "0px";
  infoPopup.style.zIndex = "9999";
  infoPopup.style.width = "200px";
  infoPopup.style.fontWeight = "normal";
  infoPopup.style.whiteSpace = "normal";
  infoPopup.style.pointerEvents = "none";
  infoPopup.innerHTML = `
    <div><strong>Mailbox:</strong> ${formatter.format(mailbox.capacity)}</div>
    <div><strong>Looking For:</strong> ${mailbox.lookingFor}</div>
    <div><strong>Bio:</strong> ${user.bio}</div>
  `;
  // eslint-disable-next-line require-atomic-updates
  userElement.classList.remove("fh-mailbox-info-loading");
  userElement.after(infoPopup);
};

const closeInfoPopups = (): void => {
  for (const popup of document.querySelectorAll(".fh-mailbox-info")) {
    popup.remove();
  }
};

export const chatMailboxStats: Feature = {
  settings: [SETTING_CHAT_MAILBOX_STATS],
  onInitialize: (settings) => {
    if (!settings[SettingId.CHAT_MAILBOX_STATS]) {
      return;
    }
    document.head.insertAdjacentHTML(
      "beforeend",
      `
        <style>
          .chip-label {
            overflow: visible !important;
          }
          .fh-mailbox-info-loading::before {
            content: "(loading...) ";
            font-size: 10px;
            color: white;
          }
        </style>
      `
    );
  },
  onChatLoad: (settings) => {
    // make sure setting is enabled
    if (!settings[SettingId.CHAT_MAILBOX_STATS]) {
      return;
    }
    const users = document.querySelectorAll<HTMLAnchorElement>(
      `.chip a[href^='profile.php']`
    );
    for (const userElement of users) {
      if (userElement?.dataset.initialized) {
        continue;
      }
      userElement.addEventListener("mouseover", () => {
        userElement.dataset.popup = "open";
        openInfoPopup(userElement);
      });
      let timer: NodeJS.Timeout;
      userElement.addEventListener("touchstart", () => {
        userElement.dataset.popup = "open";
        timer = setTimeout(() => {
          openInfoPopup(userElement);
          userElement.dataset.ignoreClick = "true";
        }, 500);
      });
      userElement.addEventListener("touchend", () => {
        clearTimeout(timer);
      });
      userElement.addEventListener("mouseout", () => {
        userElement.dataset.popup = "closed";
        closeInfoPopups();
      });
      userElement.addEventListener("click", (event) => {
        if (userElement.dataset.ignoreClick) {
          event.preventDefault();
          delete userElement.dataset.ignoreClick;
        }
      });
      userElement.addEventListener("contextmenu", (event) => {
        if (userElement.dataset.ignoreClick) {
          event.preventDefault();
          delete userElement.dataset.ignoreClick;
        }
      });
    }
  },
};
