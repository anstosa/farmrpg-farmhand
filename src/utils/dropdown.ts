import {
  applyStyles,
  BACKGROUND_DARK,
  BORDER_GRAY,
  INPUT_STYLES,
  TEXT_GRAY,
} from "./theme";

export interface ItemOption {
  name: string;
  quantity?: number;
  icon?: string;
  value: string;
  proxyOption: HTMLOptionElement;
}

const getOptionName = ({ name, quantity }: ItemOption): string => {
  if (quantity === undefined) {
    return name;
  }
  const formatter = new Intl.NumberFormat();
  return `${name} (${formatter.format(quantity)})`;
};

export const replaceSelect = (
  proxySelect: HTMLSelectElement,
  options: ItemOption[]
): void => {
  if (proxySelect.dataset.hasProxied === "true") {
    return;
  }
  proxySelect.style.display = "none";
  const selector = document.createElement("div");
  selector.classList.add("fh-item-selector");
  applyStyles(selector, INPUT_STYLES);
  selector.style.display = "flex";
  selector.style.alignItems = "center";
  selector.style.justifyContent = "center";
  selector.style.gap = "4px";
  selector.style.cursor = "pointer";
  const menu = document.createElement("div");
  menu.classList.add("fh-item-selector-menu");
  menu.style.padding = "10px 0";
  menu.style.display = "none";
  menu.style.position = "fixed";
  menu.style.zIndex = "9999";
  menu.style.background = BACKGROUND_DARK;
  menu.style.border = `2px solid ${BORDER_GRAY}`;
  menu.style.overflowY = "auto";
  menu.style.maxHeight = "406px";
  menu.style.fontSize = "17px";
  menu.style.color = TEXT_GRAY;
  menu.style.marginTop = "-2px";
  const selectedOption = options.find(
    (option) => option.value === proxySelect.value
  );
  selector.innerHTML = `
    ${
      selectedOption?.icon
        ? `<img src="${selectedOption?.icon}" style="width:16px; "/>`
        : ""
    }
    ${selectedOption ? getOptionName(selectedOption) : "Select an item"}
  `;
  selector.addEventListener("click", () => {
    const offset = selector.getBoundingClientRect();
    menu.style.top = `${offset.y + offset.height}px`;
    menu.style.right = `${window.innerWidth - offset.right}px`;
    menu.style.display = menu.style.display === "none" ? "block" : "none";
  });
  for (const option of options) {
    const optionElement = document.createElement("div");
    optionElement.textContent = `${option.name} (${option.quantity})`;
    optionElement.style.textAlign = "left";
    optionElement.style.padding = "2px 10px";
    optionElement.style.display = "flex";
    optionElement.style.alignItems = "center";
    optionElement.style.gap = "4px";
    optionElement.style.cursor = "pointer";
    optionElement.innerHTML = `
      ${option.icon ? `<img src="${option.icon}" style="width:16px;" />` : ""}
      ${getOptionName(option)}
    `;
    optionElement.addEventListener("click", () => {
      proxySelect.value = option.value;
      proxySelect.dispatchEvent(new Event("change"));
      proxySelect.dataset.hasProxied = "false";
      menu.remove();
      selector.remove();
      replaceSelect(proxySelect, options);
    });
    menu.append(optionElement);
  }
  proxySelect.after(selector);
  document.body.append(menu);
  proxySelect.dataset.hasProxied = "true";
};

export const clearDropdown = (): void =>
  document?.querySelector(".fh-item-selector-menu")?.remove();
