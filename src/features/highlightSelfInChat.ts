import {
  ALERT_YELLOW_BACKGROUND,
  ALERT_YELLOW_BORDER,
  TEXT_WARNING,
} from "~/utils/theme";
import { Feature, FeatureSetting } from "./feature";

export const SETTING_CHAT_HIGHLIGHT_SELF: FeatureSetting = {
  id: "highlightSelfInChat",
  title: "Highlight self in chat",
  description: "Highlight messages in chat where you are @mentioned",
  type: "boolean",
  defaultValue: true,
};

export const highlightSelfInChat: Feature = {
  settings: [SETTING_CHAT_HIGHLIGHT_SELF],
  onInitialize: (settings) => {
    // make sure setting is enabled
    if (!settings[SETTING_CHAT_HIGHLIGHT_SELF.id].value) {
      return;
    }

    const username = document.querySelector("#logged_in_username")?.textContent;
    if (!username) {
      console.error("Could not find username");
      return;
    }

    const chatWatcher = new MutationObserver(() => {
      const tags = document.querySelectorAll<HTMLAnchorElement>(
        `span a[href='profile.php?user_name=${username}']`
      );
      for (const tag of tags) {
        tag.style.color = TEXT_WARNING;
        const message = tag.parentElement?.parentElement;
        if (!message) {
          console.error("Could not find message");
          continue;
        }
        message.style.backgroundColor = ALERT_YELLOW_BACKGROUND;
        message.style.border = `1px solid ${ALERT_YELLOW_BORDER}`;
      }
    });

    const mobileChat = document.querySelector("#mobilechatpanel");
    if (!mobileChat) {
      console.error("Could not find mobile panel");
      return;
    }

    const desktopChat = document.querySelector("#desktopchatpanel");
    if (!desktopChat) {
      console.error("Could not find desktop panel");
      return;
    }

    chatWatcher.observe(mobileChat, { childList: true, subtree: true });
    chatWatcher.observe(desktopChat, { childList: true, subtree: true });
  },
};
