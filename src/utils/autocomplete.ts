import { BACKGROUND_DARK, BUTTON_BLUE_BACKGROUND } from "./theme";
import { BasicEntity } from "./buddyfarmApi";
import { Feature } from "~/features/feature";

interface AutocompleteConfig {
  trigger: RegExp;
  getItems: () => Promise<BasicEntity[]>;
  prefix: string;
  suffix: string;
  bail?: (text: string) => boolean;
}

const state: {
  currentIndex: number;
  autocompletes: AutocompleteConfig[];
  activeAutocomplete?: AutocompleteConfig;
} = {
  currentIndex: 0,
  autocompletes: [],
};

interface ProcessedInput {
  text: string;
  search?: string;
  match?: RegExpMatchArray;
  items?: BasicEntity[];
  filteredItems?: BasicEntity[];
}

const processInput = async (
  input: HTMLInputElement
): Promise<ProcessedInput> => {
  let activeAutocomplete: AutocompleteConfig | undefined;
  const text = input.value;
  const processedInput: ProcessedInput = { text };
  for (const autocomplete of state.autocompletes) {
    // "@anstosa: LF ((or"
    if (autocomplete?.bail?.(text)) {
      continue;
    }
    // "@anstosa: LF ((or"
    const match = text.match(autocomplete.trigger);
    // "or"
    if (!match || match.length < 2) {
      continue;
    }
    const search = match[1];
    const items = await autocomplete.getItems();
    const filteredItems = items.filter(({ name }) =>
      name.toLowerCase().includes(search.toLowerCase() ?? "")
    );
    activeAutocomplete = autocomplete;
    processedInput.search = search;
    processedInput.match = match;
    processedInput.items = items;
    processedInput.filteredItems = filteredItems;
  }
  state.activeAutocomplete = activeAutocomplete;
  return processedInput;
};

const applyInput = async (
  input: HTMLInputElement,
  item: BasicEntity
): Promise<void> => {
  const { filteredItems, search, match, text } = await processInput(input);
  if (!state.activeAutocomplete) {
    return;
  }
  const { prefix, suffix } = state.activeAutocomplete;
  if (!search || !match || !filteredItems) {
    return;
  }
  // eslint-disable-next-line require-atomic-updates
  input.value = [
    text.slice(0, match.index),
    prefix,
    item.name,
    suffix,
    text.slice((match.index ?? 0) + match[0].length),
  ].join("");
  closeAutocomplete();
};

const autocompleteSearchControlHandler = async (
  event: KeyboardEvent
): Promise<void> => {
  if (!event.target) {
    return;
  }
  if (!state.activeAutocomplete) {
    return;
  }
  if (!["Enter", "ArrowDown", "ArrowUp"].includes(event.key)) {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  const input = event.target as HTMLInputElement;
  const { filteredItems, search, match } = await processInput(input);
  if (!search || !match || !filteredItems) {
    closeAutocomplete();
    return;
  }
  // eslint-disable-next-line unicorn/prefer-switch
  if (event.key === "Enter") {
    closeAutocomplete();
    await applyInput(input, filteredItems[state.currentIndex]);
  } else if (event.key === "ArrowDown") {
    state.currentIndex = Math.min(
      state.currentIndex + 1,
      filteredItems.length - 1
    );
    renderAutocomplete(input, filteredItems);
  } else if (event.key === "ArrowUp") {
    state.currentIndex = Math.max(state.currentIndex - 1, 0);
    renderAutocomplete(input, filteredItems);
  } else if (event.key === "Escape") {
    closeAutocomplete();
  }
};

const autocompleteSearchItemHandler = async (
  event: KeyboardEvent
): Promise<void> => {
  if (!event.target) {
    return;
  }
  const input = event.target as HTMLInputElement;
  const { filteredItems, match } = await processInput(input);
  if (!match || !filteredItems) {
    closeAutocomplete();
    return;
  }
  renderAutocomplete(input, filteredItems);
};

const closeAutocomplete = (): void => {
  document.querySelector(".fh-autocomplete")?.remove();
};

const renderAutocomplete = (
  input: HTMLInputElement,
  items: BasicEntity[]
): void => {
  closeAutocomplete();
  const offset = input.getBoundingClientRect();
  const wrapper = document.createElement("div");
  wrapper.classList.add("fh-autocomplete");
  wrapper.style.position = "fixed";
  wrapper.style.top = `${offset.top + offset.height}px`;
  wrapper.style.left = `${offset.left}px`;
  wrapper.style.width = `${offset.width}px`;
  wrapper.style.maxHeight = `${
    window.innerHeight - offset.top - offset.height
  }px`;
  wrapper.style.zIndex = "99999";
  wrapper.innerHTML = `
    ${items
      .map(
        ({ name, image }, index) => `
          <div
            class="fh-autocomplete-item"
            data-index="${index}"
            style="
              display: flex;
              align-items: center;
              color: white;
              gap: 5px;
              width: 100%;
              cursor: pointer;
              padding: 8px;
              background-color: ${
                index === state.currentIndex
                  ? BUTTON_BLUE_BACKGROUND
                  : BACKGROUND_DARK
              };
            "
          >
            <img
              src="${image}"
              style="
                width: 25px;
                height: 25px;
              ">
            ${name}
          </div>
        `
      )
      .join("")}
  `;
  for (const item of wrapper.querySelectorAll<HTMLElement>(
    ".fh-autocomplete-item"
  )) {
    wrapper.addEventListener("click", async () => {
      closeAutocomplete();
      await applyInput(input, items[Number(item.dataset.index)]);
    });
  }
  document.body.append(wrapper);
};

export const registerAutocomplete = (
  autocomplete: AutocompleteConfig
): void => {
  state.autocompletes.push(autocomplete);
};

export const registerInputListeners = (input: HTMLInputElement): void => {
  input.addEventListener("keypress", autocompleteSearchItemHandler);
  input.addEventListener("keydown", autocompleteSearchControlHandler);
};

export const autocomplete: Feature = {
  onInitialize: () => {
    document.head.insertAdjacentHTML(
      "beforeend",
      `
      <style>
        .fh-autocomplete-item:hover {
          background-color: ${BUTTON_BLUE_BACKGROUND};
        }
      <style>
    `
    );

    const mobileChat = document.querySelector("#mobilechatpanel");
    if (!mobileChat) {
      console.error("Could not find mobile panel");
      return;
    }

    const desktopChat = document.querySelector("#desktopchatpanel");
    if (!desktopChat) {
      console.error("Could not find desktop panel");
      return;
    }

    const chatWatcher = new MutationObserver(() => {
      for (const chat of [mobileChat, desktopChat]) {
        const input =
          chat.querySelector<HTMLInputElement>("input[type='text']");
        if (!input) {
          continue;
        }

        registerInputListeners(input);
      }
    });

    chatWatcher.observe(mobileChat, { childList: true, subtree: true });
    chatWatcher.observe(desktopChat, { childList: true, subtree: true });
  },
};
