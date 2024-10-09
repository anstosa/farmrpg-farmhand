import { BasicEntity } from "~/api/buddyfarm/types";
import { Feature, FeatureSetting } from "../utils/feature";
import { registerAutocomplete } from "~/utils/autocomplete";
import { SettingId } from "~/utils/settings";

const SETTING_AUTOCOMPLETE_USERS: FeatureSetting = {
  id: SettingId.AUTOCOMPLETE_USERS,
  title: "Chat: Autocomplete @Users:",
  description: "Auto-complete usernames in chat",
  type: "boolean",
  defaultValue: true,
};

const getUsers = (): BasicEntity[] => {
  const users: Record<string, BasicEntity> = {};
  const messages = document.querySelectorAll(".chat-txt");
  for (const message of messages) {
    const image =
      message.querySelector<HTMLImageElement>(".chip-media img")?.src ?? "";
    const username = message.querySelector(".chip-label a")?.textContent;
    if (username && !users[username]) {
      users[username] = { name: username, image };
    }
  }
  return Object.values(users);
};

export const autocompleteUsers: Feature = {
  settings: [SETTING_AUTOCOMPLETE_USERS],
  onInitialize: (settings) => {
    // make sure setting is enabled
    if (!settings[SettingId.AUTOCOMPLETE_USERS]) {
      return;
    }
    registerAutocomplete({
      trigger: /@([^]+)/,
      getItems: async () => await getUsers(),
      prefix: "@",
      suffix: ":",
      bail: (text) => (text.match(/(@|:)/g)?.length ?? 0) % 2 === 0,
    });
  },
};
