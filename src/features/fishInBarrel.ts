import { Feature, FeatureSetting } from "./feature";

export const SETTING_FISH_IN_BARREL: FeatureSetting = {
  id: "fishInBarrel",
  title: "Fishing: Barrel Mode",
  description: "Fish always appear in middle of pond",
  type: "boolean",
  defaultValue: true,
};

export const fishinInBarrel: Feature = {
  settings: [SETTING_FISH_IN_BARREL],
  onInitialize: (settings) => {
    // make sure setting is enabled
    if (!settings[SETTING_FISH_IN_BARREL.id].value) {
      return;
    }

    document.head.insertAdjacentHTML(
      "beforeend",
      `
        <style>
          /* Move fish to middle */
          .fish {
            position: absolute;
            top: calc(50% - 30px);
            left: calc(50% - 30px);
          }
        <style>
      `
    );
  },
};
