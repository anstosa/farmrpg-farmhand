import { Feature, FeatureSetting } from "../utils/feature";
import { SettingId } from "~/utils/settings";

const SETTING_FLEA_MARKET: FeatureSetting = {
  id: SettingId.FLEA_MARKET,
  title: "Flea Market: Disable",
  description: "Flea Market is disabled because it's a waste of gold",
  type: "boolean",
  defaultValue: true,
};

export const fleaMarket: Feature = {
  settings: [SETTING_FLEA_MARKET],
  onInitialize: (settings) => {
    // make sure setting is enabled
    if (!settings[SettingId.FLEA_MARKET]) {
      return;
    }

    document.head.insertAdjacentHTML(
      "beforeend",
      `
        <style>
          /* Hide Flea Market in Town */
          a[href="flea.php"] {
            display: none;
          }

          /* Hide Flea Market Page */
          .page[page="flea"] {
            display: none;
          }

          /* Hide Flea Market in Inventory */
          .close-panel:has(a[href="flea.php"]) {
            display: none;
          }
        <style>
      `
    );
  },
};
