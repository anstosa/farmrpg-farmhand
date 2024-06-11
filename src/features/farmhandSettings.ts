import { Feature, FeatureSetting, Settings } from "./feature";
import { getCurrentPage, Page } from "~/utils/page";

export const getSettings = async (features: Feature[]): Promise<Settings> => {
  const settings: Settings = {};
  for (const feature of features) {
    for (const setting of feature.settings ?? []) {
      settings[setting.id] = {
        ...setting,
        value: (await GM.getValue(setting.id, setting.defaultValue)) as any,
      };
    }
  }
  return settings;
};

export const getSetting = async (
  setting: FeatureSetting
): Promise<FeatureSetting> => ({
  ...setting,
  value: (await GM.getValue(setting.id, setting.defaultValue)) as any,
});

export const setSetting = (setting: FeatureSetting): Promise<void> =>
  GM.setValue(setting.id, setting.value ?? "");

const getWrapper = (
  { id, type, value }: FeatureSetting,
  children: string
): string => {
  switch (type) {
    case "boolean": {
      return `
        <div
          class="item-inner"
          role="checkbox"
          id="${id}-aria"
          aria-labelledby="${id}"
          aria-checked="${value ? "true" : "false"}"
        >
          ${children}
        </div>
      `;
    }
    case "number": {
      return `
        <div
          class="item-inner"
          role="spinbutton"
          id="${id}-aria"
          aria-labelledby="${id}"
          aria-valuenow="${value}"
        >
          ${children}
        </div>
      `;
    }
    case "string": {
      return `
        <div
          class="item-inner"
          role="textbox"
          id="${id}-aria"
          aria-labelledby="${id}"
        >
          ${children}
        </div>
      `;
    }
    default: {
      return `
        <div
          class="item-inner"
          id="${id}-aria"
          aria-labelledby="${id}"
        >
          ${children}
        </div>
      `;
    }
  }
};

const getField = ({ id, type, value }: FeatureSetting): string => {
  switch (type) {
    case "boolean": {
      return `
        <label class="label-switch">
          <input
            type="checkbox"
            class="settings_checkbox"
            id="${id}"
            name="${id}"
            value="${value ? 1 : 0}"
            ${value ? 'checked=""' : ""}"
          />
          <div class="checkbox"></div>
        </label>
      `;
    }
    case "string":
    case "number": {
      return `
        <div class="item-after">
          <input
            type="text"
            name="${id}"
            value="${value}"
            class="inlineinputsm"
            style="width: 60px; font-family: -apple-system, &quot;SF UI Text&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Noto Color Emoji&quot;, EmojiNotoColor, &quot;Noto Emoji&quot;, EmojiNoto, &quot;Segoe UI&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Twitter Color Emoji&quot;, EmojiTwemColor, &quot;Twemoji Mozilla&quot;, EmojiTwem, &quot;EmojiOne Mozilla&quot;, &quot;Android Emoji&quot;, EmojiSymbols, Symbola, EmojiSymb !important;"
          />
        </div>
      `;
    }
    default: {
      return "";
    }
  }
};

const getValue = (
  { id, type }: FeatureSetting,
  currentPage: HTMLElement
): FeatureSetting["value"] => {
  const input = currentPage.querySelector(`[name=${id}]`) as HTMLInputElement;
  switch (type) {
    case "boolean": {
      const wrapper = currentPage.querySelector(
        `[id=${id}-aria]`
      ) as HTMLDivElement;
      return wrapper.getAttribute("aria-checked") === "true";
    }
    case "number": {
      return Number(input.value);
    }
    case "string": {
      return input.value;
    }
    default: {
      return input.value;
    }
  }
};

export const farmhandSettings: Feature = {
  onPageChange: (settings, page) => {
    // make sure we are on the settings page
    if (page !== Page.SETTINGS_OPTIONS) {
      return;
    }

    // make sure page content has loaded
    const currentPage = getCurrentPage();
    if (!currentPage) {
      return;
    }

    // insert at end of first card
    const settingsList = currentPage.querySelector("#settingsform_options ul");
    if (!settingsList) {
      console.error("Settings list not found");
      return;
    }

    // add section
    const farmhandSettingsLi = document.createElement("li");
    farmhandSettingsLi.classList.add("list-group-title");
    farmhandSettingsLi.classList.add("item-divider");
    farmhandSettingsLi.textContent = "Farmhand Settings";
    settingsList.append(farmhandSettingsLi);

    // add settings
    for (const setting of Object.values(settings)) {
      const settingLi = document.createElement("li");
      settingLi.innerHTML = `
        <div class="item-content">
          ${getWrapper(
            setting,
            `
            <div class="item-title label" style="width:60%">
              <label
                id="${setting.id}"
                for="${setting.id}">
                  ${setting.title}
              </label>
              <br>
              <span style="font-size: 11px">${setting.description}</span>
            </div>
            ${getField(setting)}
            `
          )}
      </div>
      `;
      settingsList.append(settingLi);
    }

    // hook into save button
    const saveButton = currentPage.querySelector("#settings_options");
    if (!saveButton) {
      console.error("Save button not found");
      return;
    }

    saveButton.addEventListener("click", () => {
      for (const setting of Object.values(settings)) {
        setting.value = getValue(setting, currentPage);
        setSetting(setting);
      }
      setTimeout(() => window.location.reload(), 1000);
    });
  },
};
