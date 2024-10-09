import { Feature, FeatureSetting } from "../utils/feature";
import { getCurrentPage, Page } from "~/utils/page";
import {
  getData,
  getSettings,
  setData,
  setSetting,
  SettingId,
} from "~/utils/settings";
import { showPopup } from "~/utils/popup";

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

const getField = (setting: FeatureSetting, children: string): string => {
  switch (setting.type) {
    case "boolean": {
      return `
        <label class="label-switch">
          <input
            type="checkbox"
            class="settings_checkbox"
            id="${setting.id}"
            name="${setting.id}"
            value="${setting.value ? 1 : 0}"
            ${setting.value ? 'checked=""' : ""}"
          >
          <div class="checkbox"></div>
          ${children}
        </label>
      `;
    }
    case "string":
    case "number": {
      return `
        <div class="item-after">
          <input
            type="text"
            name="${setting.id}"
            placeholder="${setting.placeholder ?? ""}"
            value="${setting.value}"
            class="inlineinputsm fh-input"
            style="
              width: 100px !important;
            "
          >
          ${children}
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

const SETTING_EXPORT: FeatureSetting = {
  id: SettingId.EXPORT,
  title: "Settings: Export",
  description: "Exports Farmhand Settings to sync to other device",
  type: "string",
  defaultValue: "",
  buttonText: "Export",
  buttonAction: async (settings, settingWrapper) => {
    const exportedSettings = Object.values(getSettings());
    for (const setting of exportedSettings) {
      setting.data = await getData(setting, "");
    }
    const exportString = JSON.stringify(exportedSettings);
    GM.setClipboard(exportString);
    showPopup({
      title: "Settings Exported to clipboard",
      contentHTML:
        "Open Farm RPG on another device with Farmhand installed to import",
    });
    const input = settingWrapper.querySelector<HTMLInputElement>(".fh-input");
    if (input) {
      input.value = exportString;
    }
  },
};

const SETTING_IMPORT: FeatureSetting = {
  id: SettingId.IMPORT,
  title: "Settings: Import",
  description: "Paste export into box and click Import",
  type: "string",
  defaultValue: "",
  placeholder: "Paste Here",
  buttonText: "Import",
  buttonAction: async (settings, settingWrapper) => {
    const input =
      settingWrapper.querySelector<HTMLInputElement>(".fh-input")?.value;
    const importedSettings = JSON.parse(input ?? "[]") as FeatureSetting[];
    for (const setting of importedSettings) {
      await setSetting(setting);
      if (setting.data) {
        await setData(setting, setting.data);
      }
    }
    await showPopup({
      title: "Farmhand Settings Imported!",
      contentHTML: "Page will reload to apply",
    });
    window.location.reload();
  },
};

export const farmhandSettings: Feature = {
  settings: [SETTING_EXPORT, SETTING_IMPORT],
  onInitialize: () => {
    document.head.insertAdjacentHTML(
      "beforeend",
      `
      <style>
        /* Allow action buttons next to switches */
        .label-switch {
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
          width: auto !important; 
        }
      <style>
    `
    );
  },
  onPageLoad: (settingValues, page) => {
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
    let farmhandSettingsLi =
      settingsList.querySelector<HTMLLIElement>(".fh-settings-title");
    if (farmhandSettingsLi) {
      // already rendered
      return;
    }
    farmhandSettingsLi = document.createElement("li");
    farmhandSettingsLi.classList.add("list-group-title");
    farmhandSettingsLi.classList.add("item-divider");
    farmhandSettingsLi.classList.add("fh-settings-title");
    farmhandSettingsLi.textContent = "Farmhand Settings";
    settingsList.append(farmhandSettingsLi);

    // add settings
    for (const setting of getSettings()) {
      setting.value = settingValues[setting.id];
      const hasButton = setting.buttonText && setting.buttonAction;
      const settingLi = document.createElement("li");
      settingLi.innerHTML = `
        <div
          class="item-content"
          style="
            display: flex;
            gap: 15px;
            justify-content: space-between;
          "
        >
          ${getWrapper(
            setting,
            `
            <div
              class="item-title label"
              style="
                flex: 1;
                white-space: normal;
              "
            >
              <label
                id="${setting.id}"
                for="${setting.id}">
                  ${setting.title}
              </label>
              <br>
              <div style="font-size: 11px">${setting.description}</div>
            </div>
            ${getField(
              setting,
              hasButton
                ? `
                  <button
                    class="button btngreen fh-action"
                    style="margin-left: 8px"
                  >${setting.buttonText}</button>
                `
                : ""
            )}
            `
          )}
      </div>
      `;
      settingLi
        .querySelector(".fh-action")
        ?.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          setting.buttonAction?.(settingValues, settingLi);
        });
      settingsList.append(settingLi);
    }

    // hook into save button
    const saveButton = currentPage.querySelector("#settings_options");
    if (!saveButton) {
      console.error("Save button not found");
      return;
    }

    saveButton.addEventListener("click", async () => {
      saveButton.textContent = "Saving...";
      for (const setting of Object.values(getSettings())) {
        setting.value = getValue(setting, currentPage);
        await setSetting(setting);
      }
      setTimeout(() => window.location.reload(), 1000);
    });
  },
};
