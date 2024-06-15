import { Feature, FeatureSetting, Settings } from "./feature";
import { getCurrentPage, Page } from "~/utils/page";
import { showPopup } from "~/utils/popup";

export const getSettings = async (features: Feature[]): Promise<Settings> => {
  const settings: Settings = {};
  for (const feature of features) {
    for (const setting of feature.settings ?? []) {
      setting.value = (await GM.getValue(
        setting.id,
        setting.defaultValue
      )) as any;
      settings[setting.id] = setting;
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

export const getData = async <T>(
  setting: FeatureSetting | string,
  defaultValue: T
): Promise<T> => {
  const key = typeof setting === "string" ? setting : setting.dataKey;
  if (!key) {
    return defaultValue;
  }
  const rawData = await GM.getValue<string>(key, "");
  if (!rawData) {
    return defaultValue;
  }
  return JSON.parse(rawData) as T;
};

export const setData = async <T>(
  setting: FeatureSetting | string,
  data: T
): Promise<void> => {
  const key = typeof setting === "string" ? setting : setting.dataKey;
  if (!key) {
    return;
  }
  await GM.setValue(key, JSON.stringify(data));
};

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

type ExportedSettings = Array<FeatureSetting & { data: any }>;

export const SETTING_EXPORT: FeatureSetting = {
  id: "export",
  title: "Export",
  description: "Exports Farmhand Settings to sync to other device",
  type: "string",
  defaultValue: "",
  buttonText: "Export",
  buttonAction: async (settings, settingWrapper) => {
    const exportedSettings = Object.values(settings) as ExportedSettings;
    for (const setting of exportedSettings) {
      setting.data = await getData(setting, "");
    }
    const exportString = JSON.stringify(exportedSettings);
    GM.setClipboard(exportString);
    showPopup(
      "Settings Exported to clipboard",
      "Open Farm RPG on another device with Farmhand installed to import"
    );
    const input = settingWrapper.querySelector<HTMLInputElement>(".fh-input");
    if (input) {
      input.value = exportString;
    }
  },
};

export const SETTING_IMPORT: FeatureSetting = {
  id: "import",
  title: "Import",
  description: "Paste export into box and click Import",
  type: "string",
  defaultValue: "",
  placeholder: "Paste Here",
  buttonText: "Import",
  buttonAction: async (settings, settingWrapper) => {
    const input =
      settingWrapper.querySelector<HTMLInputElement>(".fh-input")?.value;
    const importedSettings = JSON.parse(input ?? "[]") as ExportedSettings;
    for (const setting of importedSettings) {
      await setSetting(setting);
      if (setting.data) {
        await setData(setting, setting.data);
      }
    }
    await showPopup("Farmhand Settings Imported!", "Page will reload to apply");
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
          setting.buttonAction?.(settings, settingLi);
        });
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
