import { BACKGROUND_DARK } from "~/utils/theme";
import { Feature } from "./feature";

const openAutocomplete = (dropdown: HTMLDivElement): void => {
  const currentLink =
    document.querySelector<HTMLAnchorElement>(".cclinkselected");
  const links = [
    ...document.querySelectorAll<HTMLAnchorElement>(
      "#desktopchatpanel .cclink"
    ),
  ];
  if (!links || !currentLink) {
    return;
  }
  links.sort((a, b) => a.textContent?.localeCompare(b.textContent ?? "") ?? 0);
  const menu = document.createElement("div");
  menu.classList.add("fh-chatdropdown-menu");
  menu.style.display = "flex";
  menu.style.flexDirection = "column";
  menu.style.position = "absolute";
  menu.style.top = "100%";
  menu.style.left = "0";
  menu.style.width = "100%";
  menu.style.background = BACKGROUND_DARK;
  menu.style.zIndex = "9999";
  for (const link of links) {
    if (link.dataset.channel === currentLink.dataset.channel) {
      continue;
    }
    const option = document.createElement("div");
    option.textContent = link.textContent;
    option.style.cursor = "pointer";
    option.style.padding = "10px";
    option.addEventListener("click", () => {
      link.click();
      closeAutocomplete();
    });
    menu.append(option);
  }
  dropdown.append(menu);
};

const closeAutocomplete = (): void => {
  document.querySelector(".fh-chatdropdown-menu")?.remove();
};

export const chatNav: Feature = {
  onInitialize: () => {
    document.head.insertAdjacentHTML(
      `beforeend`,
      `
      <style>
        /* Hide original chat nav */
        .cclink {
          display: none !important;
        }
      <style>
    `
    );
  },
  onChatLoad: () => {
    const currentLink =
      document.querySelector<HTMLAnchorElement>(".cclinkselected");
    if (!currentLink) {
      return;
    }

    const dropdowns = [
      ...document.querySelectorAll<HTMLDivElement>(".fh-chatdropdown"),
    ];

    // create dropdowns if we haven't
    if (dropdowns.length === 0) {
      for (const title of document.querySelectorAll<HTMLDivElement>(
        ".content-block-title.item-input"
      )) {
        title.style.margin = "0";
        title.style.marginTop = "-5px";
        title.style.overflow = "visible";
        title.style.display = "flex";

        const dropdown = document.createElement("div");
        dropdown.classList.add("fh-chatdropdown");
        dropdown.style.cursor = "pointer";
        dropdown.style.textTransform = "titlecase";
        dropdown.style.width = "calc(100% - 44px)";
        dropdown.style.height = "44px";
        dropdown.style.display = "flex";
        dropdown.style.alignContent = "center";
        dropdown.style.justifyContent = "center";
        dropdown.style.flexWrap = "wrap";
        dropdowns.push(dropdown);
        dropdown.addEventListener("click", () => {
          const menu = document.querySelector(".fh-chatdropdown-menu");
          if (menu) {
            closeAutocomplete();
          } else {
            openAutocomplete(title);
          }
        });
        title.append(dropdown);

        const refresh = document.createElement("i");
        refresh.classList.add("fa");
        refresh.classList.add("fw");
        refresh.classList.add("fa-refresh");
        refresh.style.cursor = "pointer";
        refresh.style.width = "44px";
        refresh.style.height = "44px";
        refresh.style.display = "flex";
        refresh.style.alignItems = "center";
        refresh.style.justifyContent = "center";
        refresh.addEventListener("click", () => {
          document.querySelector<HTMLAnchorElement>(".cclinkselected")?.click();
        });
        title.append(refresh);
      }
    }

    // update dropdown content
    for (const dropdown of dropdowns) {
      if (dropdown.dataset.channel !== currentLink.dataset.channel) {
        dropdown.innerHTML = `
          ${currentLink.textContent}
          <i class="fa fw fa-caret-down" style="margin-left: 5px;"></i>
        `;
        dropdown.dataset.channel = currentLink.dataset.channel;
      }
    }
  },
};
