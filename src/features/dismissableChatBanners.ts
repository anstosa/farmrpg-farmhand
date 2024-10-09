import { Feature, FeatureSetting } from "../utils/feature";
import { getData, setData, SettingId } from "~/utils/settings";
import { showPopup } from "~/utils/popup";
import { StorageKey } from "~/utils/state";

interface DismissableBannerData {
  hiddenBanners: string[];
}

const SETTING_CHAT_DISMISSABLE_BANNERS: FeatureSetting = {
  id: SettingId.CHAT_DISMISSABLE_BANNERS,
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
    if (!settings[SettingId.CHAT_DISMISSABLE_BANNERS]) {
      return;
    }
    const bannerElements = document.querySelectorAll(
      "#desktopchatpanel .card, #mobilechatpanel .card"
    );
    const { hiddenBanners } = await getData<DismissableBannerData>(
      SettingId.CHAT_DISMISSABLE_BANNERS,
      {
        hiddenBanners: [],
      }
    );
    for (const banner of bannerElements) {
      const bannerKey = hashBanner(banner).toString();

      // hide banner if dismissed
      const isDismissed = hiddenBanners?.includes(bannerKey) || false;
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
        setData(SettingId.CHAT_DISMISSABLE_BANNERS, {
          hiddenBanners: [...hiddenBanners, bannerKey],
        });
      });
      banner.append(closeButton);
    }
  },
};
