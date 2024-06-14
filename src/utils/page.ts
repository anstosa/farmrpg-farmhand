export enum Page {
  AREA = "area",
  BANK = "bank",
  FISHING = "fishing",
  FRIENDSHIP = "npclevels",
  ITEM = "item",
  LOCKSMITH = "locksmith",
  FARMERS_MARKET = "market",
  PERKS = "perks",
  POST_OFFICE = "postoffice",
  SETTINGS = "settings",
  SETTINGS_OPTIONS = "settings_options",
  TEMPLE = "mailitems", // not a typo
  WHEEL = "spin",
  WORKER = "worker",
  WORKSHOP = "workshop",
}

// get page and parameters if any
export const getPage = (): [Page | undefined, URLSearchParams] => {
  const currentPage = getCurrentPage();
  const page = currentPage?.dataset.page as Page | undefined;
  const parameters = new URLSearchParams(window.location.hash.split("?")[1]);
  return [page, parameters];
};

export const getPreviousPage = (): HTMLElement | null =>
  document.querySelector(".page-on-left");

export const getCurrentPage = (): HTMLDivElement | null =>
  document.querySelector(".page-on-center, .page-from-right-to-center");

export const setTitle = (title: string): void => {
  const nav = document.querySelector(".navbar-on-center");
  if (!nav) {
    console.error("Navbar not found");
    return;
  }
  const text = nav?.querySelector("center");
  if (!text) {
    console.error("Center text not found");
    return;
  }
  text.textContent = title;
};

export const getCardByTitle = (
  searchTitle: string,
  root?: HTMLElement
): Element | null => {
  const currentPage = root ?? getCurrentPage();
  if (!currentPage) {
    console.error("Current page not found");
    return null;
  }
  const titles = currentPage.querySelectorAll(".content-block-title");
  const targetTitle = [...titles].find(
    (title) => title.textContent === searchTitle
  );
  if (!targetTitle) {
    console.error(`${searchTitle} title not found`);
    return null;
  }
  return targetTitle.nextElementSibling;
};

export const getListByTitle = (
  searchTitle: string,
  root?: HTMLElement
): HTMLElement | null => {
  const targetCard = getCardByTitle(searchTitle, root);
  if (!targetCard) {
    console.error(`${searchTitle} card not found`);
    return null;
  }
  return targetCard.querySelector("ul");
};
