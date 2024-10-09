import {
  BUTTON_BLUE_STYLES,
  BUTTON_GRAY_DARK_STYLES,
  BUTTON_GRAY_STYLES,
  BUTTON_GREEN_STYLES,
  BUTTON_ORANGE_STYLES,
  BUTTON_PURPLE_STYLES,
  BUTTON_RED_STYLES,
  INPUT_STYLES,
  toCSS,
} from "~/utils/theme";
import { clearDropdown, ItemOption, replaceSelect } from "~/utils/dropdown";
import { Feature, FeatureSetting } from "../utils/feature";
import { getAbridgedItem } from "~/api/buddyfarm/api";
import { getCurrentPage } from "~/utils/page";
import { SettingId } from "~/utils/settings";

const SETTING_IMPROVED_INPUTS: FeatureSetting = {
  id: SettingId.IMPROVED_INPUTS,
  title: "UI: Improved Inputs",
  description:
    "Consistent button and field styling and improved item selector UI",
  type: "boolean",
  defaultValue: true,
};

export const improvedInputs: Feature = {
  settings: [SETTING_IMPROVED_INPUTS],
  onInitialize: (settings) => {
    if (!settings[SettingId.IMPROVED_INPUTS]) {
      return;
    }
    document.head.insertAdjacentHTML(
      "beforeend",
      `
        <style>
          .newinput,
          .searchbar input[type="search"],
          input[type="number"]:not(#vaultcode),
          input[type="text"]:not(#chat_txt_desktop):not("chat_txt_mobile"), {
            ${toCSS(INPUT_STYLES)}
          }

          .modal {
            border-radius: 0;
            border: 2px solid #c5c5c5;
            border-bottom: 0;
            overflow: visible;
          }

          .list-block .item-after {
            max-height: initial;
          }

          .pages .button:not([class*=".btn"]),
          .modal-button,
          .button.btngreen,
          .tosswellbtn,
          .cookallbtn {
            ${toCSS(BUTTON_GREEN_STYLES)}
          }

          .modal-button {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 -2px;
            height: 44px !important;
            width: calc(100% + 4px) !important;
          }
          
          .modal-button:last-child {
            margin-bottom: -2px;
          }

          select, .inlineinputlg {
            ${toCSS(INPUT_STYLES)}
          }
          
          .button.btnred[class*="btn"] {
            ${toCSS(BUTTON_RED_STYLES)} 
          }

          .button.btnorange[class*="btn"] {
            ${toCSS(BUTTON_ORANGE_STYLES)}
          }
          
          .button.btnblue[class*="btn"] {
            ${toCSS(BUTTON_BLUE_STYLES)}
          }

          button[class*="qty"] {
            ${toCSS(BUTTON_GRAY_DARK_STYLES)}
          }
          
          .button.btnpurple[class*="btn"] {
            ${toCSS(BUTTON_PURPLE_STYLES)}
          }

          .button.btngray[class*="btn"] {
            ${toCSS(BUTTON_GRAY_STYLES)}
          }

          .buttons-row .button[class*="btn"] {
            height: inherit !important;
            width: inherit !important;
            flex: 1 !important;
          }
        </style>
      `
    );
  },
  onPageLoad: async (settings) => {
    if (!settings[SettingId.IMPROVED_INPUTS]) {
      return;
    }
    clearDropdown();
    const selectors = getCurrentPage()?.querySelectorAll<HTMLSelectElement>(
      "select[class*='id']:not(.locide):not(.type_id)"
    );
    for (const selector of selectors ?? []) {
      const options: Array<ItemOption | undefined> = await Promise.all(
        [...selector.options].map(async (option) => {
          if (option.dataset.name === "Shovel") {
            const shovel = await getAbridgedItem("Shovel");
            return {
              name: "Dig Up",
              quantity: Number(option.dataset.amt),
              icon: shovel?.image ?? "",
              value: option.value,
              proxyOption: option,
            };
          }
          const match = option.textContent?.match(/^(.*) \(([\d,]+)\)$/);
          if (!match) {
            if (
              option.textContent === "--- select ---" ||
              option.textContent === "Nothing Selected"
            ) {
              return;
            }
            console.error("Failed to parse option", option);
            return;
          }
          const [, name, quantity] = match;
          const item = await getAbridgedItem(name);
          if (!item) {
            console.error("Failed to get item", name);
            return;
          }
          return {
            name,
            quantity: Number(quantity.replaceAll(",", "")),
            icon: item.image,
            value: option.value,
            proxyOption: option,
          };
        })
      );
      replaceSelect(
        selector,
        options.filter((option) => option !== undefined)
      );
    }
  },
};
