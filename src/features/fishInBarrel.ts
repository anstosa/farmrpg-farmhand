import { Feature, FeatureSetting } from "../utils/feature";
import { SettingId } from "~/utils/settings";

const SETTING_FISH_IN_BARREL: FeatureSetting = {
  id: SettingId.FISH_IN_BARREL,
  title: "Fishing: Barrel Mode",
  description: "Fish always appear in middle of pond",
  type: "boolean",
  defaultValue: true,
};

export const fishinInBarrel: Feature = {
  settings: [SETTING_FISH_IN_BARREL],
  onInitialize: (settings) => {
    // make sure setting is enabled
    if (!settings[SettingId.FISH_IN_BARREL]) {
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
