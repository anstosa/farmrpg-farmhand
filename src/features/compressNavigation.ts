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

export const SETTING_NAVIGATION_ALIGN_BOTTOM: FeatureSetting = {
  id: "alignBottomNav",
  title: "Align Navigation to Bottom",
  description: `Aligns Navigation menu to bottom of screen for easier reach on mobile`,
  type: "boolean",
  defaultValue: false,
};

export const SETTINGS_NAVIGATION_ADD_MENU: FeatureSetting = {
  id: "bottomMenu",
  title: "Add Bottom Menu Shortcut",
  description: `Adds navigation menu shortcut to bottom bar for easier reach on mobile`,
  type: "boolean",
  defaultValue: true,
};

export const navigationStyle: Feature = {
  settings: [
    SETTING_NAVIGATION_COMPRESS,
    SETTING_NAVIGATION_HIDE_LOGO,
    SETTINGS_NAVIGATION_ADD_MENU,
    SETTING_NAVIGATION_ALIGN_BOTTOM,
  ],
  onInitialize: (settings) => {
    // align toolbar more consistently
    document.head.insertAdjacentHTML(
      "beforeend",
      `
          <style>
            .toolbar-inner {
              display: flex !important;
              justify-content: end !important;
              gap: 10px !important;
            }

            @media (min-width: 768px) {
              .fh-menu {
                display: none !important;
              }
            }
          <style>
        `
    );

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

    if (settings[SETTING_NAVIGATION_ALIGN_BOTTOM.id].value) {
      document.head.insertAdjacentHTML(
        "beforeend",
        `
          <style>
            /* Align nav down */
            .panel-left .page-content .list-block {
              margin-top: 24px !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: end !important;
              height: 100% !important;
            }
          <style>
        `
      );
    }

    if (settings[SETTINGS_NAVIGATION_ADD_MENU.id].value) {
      const homeButton = document.querySelector("#homebtn");
      if (!homeButton) {
        console.error("Home button not found");
        return;
      }
      const menuButton = document.createElement("a");
      menuButton.dataset.panel = "left";
      menuButton.classList.add("fh-menu");
      menuButton.classList.add("button");
      menuButton.classList.add("open-panel");
      menuButton.style.fontSize = "12px";
      menuButton.style.paddingLeft = "5px";
      menuButton.style.paddingRight = "8px";
      menuButton.style.display = "flex";
      menuButton.style.alignItems = "center";
      menuButton.style.gap = "2px";
      menuButton.innerHTML = `
        <i class="fa fa-fw fa-bars"></i>
        Menu
      `;
      homeButton.parentElement?.insertBefore(menuButton, homeButton);
    }
  },
};
