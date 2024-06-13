import { BORDER_GRAY } from "~/utils/theme";
import { Feature, FeatureSetting } from "./feature";
import { getData, setData } from "./farmhandSettings";
import { showConfirmation } from "~/utils/confirmation";

export const SETTING_CUSTOM_NAVIGATION: FeatureSetting = {
  id: "customNav",
  title: "Customize Navigation",
  description: `
    Enables customization of the Navigation menu<br>
    (click the gear in the navigation menu to configure)
  `,
  type: "boolean",
  defaultValue: true,
  dataKey: "customNav_data",
};

const state: { isEditing: boolean; editingIndex?: number } = {
  isEditing: false,
};

interface NavigationItem {
  icon: string;
  text: string;
  path: string;
}

const DEFAULT_NAVIGATION: NavigationItem[] = [
  { icon: "home", text: "Home", path: "index.php" },
  { icon: "user", text: "My Profile", path: "profile.php" },
  { icon: "list", text: "My Inventory", path: "inventory.php" },
  { icon: "wrench", text: "My Workshop", path: "workshop.php" },
  { icon: "spoon", text: "My Kitchen", path: "kitchen.php" },
  { icon: "inbox", text: "My Mailbox", path: "postoffice.php" },
  { icon: "envelope", text: "My Messages", path: "messages.php" },
  { icon: "users", text: "My Friends", path: "friends.php" },
  { icon: "gear", text: "My Settings", path: "settings.php" },
  { icon: "building", text: "Town", path: "town.php" },
  { icon: "book", text: "Library", path: "wiki.php" },
  { icon: "info-circle", text: "About / Updates", path: "about.php" },
  { icon: "close", text: "Logout", path: "logout.php" },
];

const icons = ((): string[] => {
  const stylesheet = [...document.styleSheets].find(({ href }) =>
    href?.includes("fontawesome")
  );
  const icons: string[] = [];
  if (!stylesheet) {
    console.error("Could not find fontawesome stylesheet");
    return icons;
  }
  for (const rule of stylesheet.cssRules) {
    if (!(rule instanceof CSSStyleRule)) {
      continue;
    }
    if (rule.style.length !== 1) {
      continue;
    }
    if (!rule.style.content) {
      continue;
    }
    const selector = rule.selectorText;
    const aliases = selector.split(", ");
    icons.push(aliases[0].slice(4, -8));
  }
  return icons.sort();
})();

const renderNavigation = async (): Promise<void> => {
  const navigationData = await getData<NavigationItem[]>(
    SETTING_CUSTOM_NAVIGATION,
    DEFAULT_NAVIGATION
  );
  const navigationList = document.querySelector(".panel-left ul");
  if (!navigationList) {
    console.error("Could not find navigation list");
    return;
  }

  const navigationTitleLeft = document.querySelector(
    ".panel-left .navbar .left"
  );
  if (!navigationTitleLeft) {
    console.error("Could not find navigation title");
    return;
  }
  navigationTitleLeft.innerHTML = "";

  if (state.isEditing) {
    const resetButton = document.createElement("i");
    resetButton.style.cursor = "pointer";
    resetButton.classList.add("fa");
    resetButton.classList.add("fa-fw");
    resetButton.classList.add("fa-arrow-left-rotate");
    resetButton.addEventListener("click", () => {
      showConfirmation("Reset Navigation?", async () => {
        await setData(SETTING_CUSTOM_NAVIGATION, DEFAULT_NAVIGATION);
        state.isEditing = false;
        renderNavigation();
      });
    });
    navigationTitleLeft.append(resetButton);
  }

  navigationList.innerHTML = "";
  for (const item of navigationData) {
    const currentIndex = navigationData.indexOf(item);
    const navigationItem = document.createElement("li");
    navigationItem.innerHTML = `
      <a
        href="${item.path}"
        data-view=".view-main"
        class="item-link close-panel"
      >
        <div
          class="item-content"
          style="
            display: flex;
            flex-direction: column;
            gap: 4px;
          "
        >
          <div
            class="item-inner"
            style="
              background-image: none;
              display: flex;
              justify-content: space-between;
              padding-right: 15px;
              width: 100%;
            "
          >
            <div class="item-title">
              <i class="fa fa-fw fa-${item.icon}"></i>
              <span class="fh-item">${item.text}</span>
            </div>
            ${
              state.isEditing
                ? `
                  <div>
                    <i class="fa fa-fw ${
                      state.editingIndex === currentIndex
                        ? "fa-check"
                        : "fa-pencil"
                    } fh-edit"></i>
                    <i class="fa fa-fw fa-trash fh-delete"></i>
                  </div>
                `
                : '<i class="fa fa-fw fa-chevron-right"></i>'
            }
          </div>
          ${
            state.isEditing && state.editingIndex === currentIndex
              ? `
                <div
                  style="
                    display: flex;
                    align-items: center;
                    width: 100%;
                    padding-right: 15px;
                  "
                >
                  <input
                    type="text"
                    class="fh-text"
                    value="${item.text}"
                    style="
                      flex: 1;
                      border: 1px solid ${BORDER_GRAY};
                      margin-left: 20px;
                      margin-right: 10px;
                      height: 30px;
                      padding: 10px;
                    "
                  >
                  <i class="fa fa-fw fa-arrow-down fh-down"></i>
                  <i class="fa fa-fw fa-arrow-up fh-up"></i>
                </div>
                <div
                  style="
                    display: flex;
                    align-items: center;
                    width: 100%;
                    padding-right: 15px;
                  "
                >
                  <input
                    type="text"
                    class="fh-path"
                    value="${item.path}"
                    style="
                      flex: 1;
                      border: 1px solid ${BORDER_GRAY};
                      margin-left: 20px;
                      height: 30px;
                      padding: 10px;
                      font-family: monospace;
                    "
                  >
                </div>
                <div
                  style="
                    display: flex;
                    gap: 4px;
                    margin-top: 10px;
                    height: 200px;
                    width: 100%;
                    overflow-y: scroll;
                    flex-wrap: wrap;
                  "
                  class="fh-icons"
                >
                  ${icons
                    .map(
                      (icon) => `
                        <i
                          class="fa fa-fw fa-${icon}"
                          data-icon="${icon}"
                        ></i>
                      `
                    )
                    .join("")}
                </div>
              `
              : ""
          }
        </div>
      </a>
    `;
    navigationItem
      .querySelector(".fh-icons")
      ?.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!event.target) {
          return;
        }
        item.icon = (event.target as HTMLElement).dataset.icon ?? "";
        await setData(SETTING_CUSTOM_NAVIGATION, navigationData);
        renderNavigation();
      });
    navigationItem
      .querySelector(".fh-text")
      ?.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
      });
    navigationItem
      .querySelector(".fh-text")
      ?.addEventListener("change", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        item.text = (event.target as HTMLInputElement).value;
        await setData(SETTING_CUSTOM_NAVIGATION, navigationData);
        renderNavigation();
      });
    navigationItem
      .querySelector(".fh-text")
      ?.addEventListener("keyup", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const itemText = navigationItem.querySelector(".fh-item");
        if (!itemText) {
          return;
        }
        itemText.textContent = (event.target as HTMLInputElement).value;
      });
    navigationItem
      .querySelector(".fh-path")
      ?.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
      });
    navigationItem
      .querySelector(".fh-path")
      ?.addEventListener("change", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        item.path = (event.target as HTMLInputElement).value;
        await setData(SETTING_CUSTOM_NAVIGATION, navigationData);
        renderNavigation();
      });
    navigationItem
      .querySelector(".fh-up")
      ?.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (currentIndex === 0) {
          return;
        }
        navigationData.splice(currentIndex, 1);
        navigationData.splice(currentIndex - 1, 0, item);
        state.editingIndex = currentIndex - 1;
        await setData(SETTING_CUSTOM_NAVIGATION, navigationData);
        renderNavigation();
      });
    navigationItem
      .querySelector(".fh-down")
      ?.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (currentIndex === navigationData.length - 1) {
          return;
        }
        navigationData.splice(currentIndex, 1);
        navigationData.splice(currentIndex + 1, 0, item);
        state.editingIndex = currentIndex + 1;
        await setData(SETTING_CUSTOM_NAVIGATION, navigationData);
        renderNavigation();
      });
    navigationItem
      .querySelector(".fh-edit")
      ?.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (state.editingIndex === currentIndex) {
          delete state.editingIndex;
        } else {
          state.editingIndex = currentIndex;
        }
        renderNavigation();
      });
    navigationItem
      .querySelector(".fh-delete")
      ?.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        navigationData.splice(currentIndex, 1);
        await setData(SETTING_CUSTOM_NAVIGATION, navigationData);
        renderNavigation();
      });
    navigationList.append(navigationItem);
  }
  if (state.isEditing) {
    const addNavigationItem = document.createElement("li");
    addNavigationItem.innerHTML = `
      <a
        href="#"
        class="item-link close-panel"
      >
        <div
          class="item-content"
          style="
            display: flex;
            flex-direction: column;
            gap: 4px;
          "
        >
          <div
            class="item-inner"
            style="
              background-image: none;
              display: flex;
              justify-content: space-between;
              padding-right: 15px;
              width: 100%;
            "
          >
            <div class="item-title">
              <i class="fa fa-fw fa-plus"></i>
              <span class="fh-item">Add Navigation Item</span>
            </div>
          </div>
        </div>
      </a>
    `;
    addNavigationItem.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      navigationData.push({
        icon: "sack-dollar",
        text: "Tip anstosa",
        path: "profile.php?user_name=anstosa",
      });
      await setData(SETTING_CUSTOM_NAVIGATION, navigationData);
      state.editingIndex = navigationData.length - 1;
      renderNavigation();
    });
    navigationList.append(addNavigationItem);
  }
};

export const customNavigation: Feature = {
  settings: [SETTING_CUSTOM_NAVIGATION],
  onInitialize: (settings) => {
    // make sure setting is enabled
    if (!settings[SETTING_CUSTOM_NAVIGATION.id].value) {
      return;
    }

    // add configuration icon
    const navigationTitleRight = document.querySelector(
      ".panel-left .navbar .right"
    );
    if (!navigationTitleRight) {
      console.error("Could not find navigation title");
      return;
    }
    const configurationButton = document.createElement("i");
    configurationButton.style.cursor = "pointer";
    configurationButton.classList.add("fa");
    configurationButton.classList.add("fa-fw");
    configurationButton.classList.add("fa-cog");
    configurationButton.addEventListener("click", () => {
      state.isEditing = !state.isEditing;
      if (state.isEditing) {
        configurationButton.classList.remove("fa-cog");
        configurationButton.classList.add("fa-check");
      } else {
        configurationButton.classList.remove("fa-check");
        configurationButton.classList.add("fa-cog");
      }
      renderNavigation();
    });
    navigationTitleRight.append(configurationButton);
    renderNavigation();
  },
};
