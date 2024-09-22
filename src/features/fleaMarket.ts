import { Feature, FeatureSetting } from "./feature";

export const SETTING_FLEA_MARKET: FeatureSetting = {
  id: "fleaMarket",
  title: "Flea Market: Disable",
  description: "Flea Market is disabled because it's a waste of gold",
  type: "boolean",
  defaultValue: true,
};

export const fleaMarket: Feature = {
  settings: [SETTING_FLEA_MARKET],
  onInitialize: (settings) => {
    // make sure setting is enabled
    if (!settings[SETTING_FLEA_MARKET.id].value) {
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
