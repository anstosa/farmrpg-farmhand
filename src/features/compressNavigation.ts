import { Feature, FeatureSetting } from "./feature";

export const SETTING_NAVIGATION_COMPRESS: FeatureSetting = {
  id: "compressNav",
  title: "Menu: Reduce Whitespace",
  description: `Reduces whitespace in navigation to make space for more items`,
  type: "boolean",
  defaultValue: false,
};

export const SETTING_NAVIGATION_HIDE_LOGO: FeatureSetting = {
  id: "noLogoNav",
  title: "Menu: Hide Logo",
  description: `Hides Farm RPG logo in Navigation`,
  type: "boolean",
  defaultValue: true,
};

export const SETTING_NAVIGATION_ALIGN_BOTTOM: FeatureSetting = {
  id: "alignBottomNav",
  title: "Menu: Align to Bottom",
  description: `Aligns Navigation menu to bottom of screen for easier reach on mobile`,
  type: "boolean",
  defaultValue: false,
};

export const SETTINGS_NAVIGATION_ADD_MENU: FeatureSetting = {
  id: "bottomMenu",
  title: "Menu: Add Shortcut to Bottom",
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
    // hide buttons until we can replace them
    document.head.insertAdjacentHTML(
      "beforeend",
      `
        <style>
          .icon.icon-bars,
          .refreshbtn .f7-icons {
            display: none !important;
          }
        <style>
      `
    );

    // align toolbar more consistently
    document.head.insertAdjacentHTML(
      "beforeend",
      `
          <style>
            .toolbar-inner {
              display: flex !important;
              justify-content: end !important;
              padding: 0 !important;
            }

            .toolbar-inner .link {
              display: none !important;
            }

            @media (min-width: 768px) {
              .fh-menu {
                display: none !important;
              }
            }

            .toolbar-inner a {
              height: 100%;
              border: 0;
              background: transparent;
              display: flex;
              align-items: center;
              gap: 5px;
              padding: 15px !important;
              border-radius: 0 !important;
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

    // responsive bottom links
    document.head.insertAdjacentHTML(
      "beforeend",
      `
        <style>
          /* responsive bottom links */
          @media (max-width: 420px) {
          .toolbar-inner > .button i {
            margin-right: 50px !important;
          }
          .toolbar-inner > .button {
            display: block !important;
            width: 28px !important;
          }
        <style>
      `
    );

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
  onPageLoad: () => {
    for (const icon of document.querySelectorAll<HTMLDivElement>(
      ".icon.icon-bars"
    )) {
      icon.style.color = "white";
      icon.classList.remove("icon");
      icon.classList.remove("icon-bars");
      icon.classList.add("fa");
      icon.classList.add("fw");
      icon.classList.add("fa-bars");
    }

    for (const refresh of document.querySelectorAll<HTMLAnchorElement>(
      ".refreshbtn"
    )) {
      refresh.style.color = "white";
      refresh.classList.remove("fv-icons");
      refresh.textContent = "";
      refresh.classList.add("fa");
      refresh.classList.add("fw");
      refresh.classList.add("fa-refresh");
    }
  },
};
