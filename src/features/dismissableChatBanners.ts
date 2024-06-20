import { Feature, FeatureSetting } from "./feature";
import { showPopup } from "~/utils/popup";
import { StorageKey } from "~/api/state";

export const SETTING_CHAT_DISMISSABLE_BANNERS: FeatureSetting = {
  id: "dismissableChatBanners",
  title: "Chat: Dismissable Banners",
  description: `
    Adds × in chat banners to dismiss them<br>
    Disable this to show dismissed banners again
  `,
  buttonText: "Reset",
  buttonAction: async () => {
    const keys = await GM.listValues();
    for (const key of keys) {
      if (key.startsWith(StorageKey.CHAT_BANNERS)) {
        await GM.deleteValue(key);
      }
    }
    await showPopup({
      title: "Chat banners reset",
      contentHTML: "Previously dismissed chat banners will be shown again",
    });
  },
  type: "boolean",
  defaultValue: true,
};

// https://stackoverflow.com/a/7616484/714282
const hashBanner = (banner: Element): number => {
  const string = banner.textContent ?? "";
  let hash = 0;
  if (string.length === 0) {
    return hash;
  }
  for (let index = 0; index < string.length; index++) {
    const code = string.codePointAt(index) ?? 0;
    hash = (hash << 5) - hash + code;
    hash = Math.trunc(hash);
  }
  return hash;
};

export const dismissableChatBanners: Feature = {
  settings: [SETTING_CHAT_DISMISSABLE_BANNERS],
  onChatLoad: async (settings) => {
    // make sure setting is enabled
    if (!settings[SETTING_CHAT_DISMISSABLE_BANNERS.id].value) {
      return;
    }
    const banners = document.querySelectorAll(
      "#desktopchatpanel .card, #mobilechatpanel .card"
    );
    for (const banner of banners) {
      const bannerKey = `${StorageKey.CHAT_BANNERS}_${hashBanner(banner)}`;

      // hide banner if dismissed
      const isDismissed = await GM.getValue(bannerKey, false);
      if (isDismissed) {
        banner.remove();
        continue;
      }

      // skip adding close button if it already exists
      if (banner.querySelector(".fh-close")) {
        continue;
      }

      // add close button
      const closeButton = document.createElement("div");
      closeButton.classList.add("fh-close");
      closeButton.textContent = "×";
      closeButton.style.position = "absolute";
      closeButton.style.top = "2px";
      closeButton.style.right = "2px";
      closeButton.style.cursor = "pointer";
      closeButton.addEventListener("click", () => {
        banner.remove();
        GM.setValue(bannerKey, true);
      });
      banner.append(closeButton);
    }
  },
};
