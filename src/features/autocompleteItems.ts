import { Feature, FeatureSetting } from "./feature";
import { getBasicItems } from "~/utils/buddyfarmApi";
import { registerAutocomplete } from "~/utils/autocomplete";

export const SETTING_AUTOCOMPLETE_ITEMS: FeatureSetting = {
  id: "autocompleteItems",
  title: "Chat: Autocomplete ((items))",
  description: "Auto-complete item names in chat",
  type: "boolean",
  defaultValue: true,
};

export const autocompleteItems: Feature = {
  settings: [SETTING_AUTOCOMPLETE_ITEMS],
  onInitialize: async (settings) => {
    // make sure setting is enabled
    if (!settings[SETTING_AUTOCOMPLETE_ITEMS.id].value) {
      return;
    }
    const items = await getBasicItems();
    registerAutocomplete({
      trigger: /\(\(([^]+)/,
      getItems: async () => await items,
      prefix: "((",
      suffix: "))",
      bail: (text) => (text.match(/(\(\(|\)\))/g)?.length ?? 0) % 2 === 0,
    });
  },
};
