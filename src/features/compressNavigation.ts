import { Feature, FeatureSetting } from "./feature";

export const SETTING_NAVIGATION_COMPRESS: FeatureSetting = {
  id: "compressNav",
  title: "Compress Navigation",
  description: `Reduces whitespace in navigation to make space for more items`,
  type: "boolean",
  defaultValue: false,
};

export const SETTING_NAVIGATION_HIDE_LOGO: FeatureSetting = {
  id: "noLogoNav",
  title: "Hide Navigation Logo",
  description: `Hides Farm RPG logo in Navigation`,
  type: "boolean",
  defaultValue: true,
};

export const compressNavigation: Feature = {
  settings: [SETTING_NAVIGATION_COMPRESS, SETTING_NAVIGATION_HIDE_LOGO],
  onInitialize: (settings) => {
    if (settings[SETTING_NAVIGATION_COMPRESS.id].value) {
      document.head.insertAdjacentHTML(
        "beforeend",
        `
          <style>
            /* Reduce nav item spacing */
            .panel-left .item-inner {
              padding-top: 4px !important;
              padding-bottom: 4px !important;
            }
            .panel-left .item-content,
            .panel-left .item-inner {
              min-height: 0 !important;
            }
          <style>
        `
      );
    }

    if (settings[SETTING_NAVIGATION_HIDE_LOGO.id].value) {
      document.head.insertAdjacentHTML(
        "beforeend",
        `
          <style>
            /* Hide nav logo */
            .panel-left .page-content div[align="center"] {
              display: none !important;
            }
            
            /* Hide extra padding */
            .panel-left .page,
            .panel-left .page-content {
              padding-bottom: 0 !important;
            }
          <style>
        `
      );
    }
  },
};
