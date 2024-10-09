export enum Page {
  AREA = "area",
  BANK = "bank",
  BIO = "settings_bio",
  FARM = "xfarm",
  FARMERS_MARKET = "market",
  FISHING = "fishing",
  FRIENDSHIP = "npclevels",
  HOME_PAGE = "index-1", // not a typo
  HOME_PATH = "index",
  ITEM = "item",
  KITCHEN = "kitchen",
  LOCKSMITH = "locksmith",
  MAILBOX = "mailbox",
  MINING = "mining",
  PASTURE = "pasture",
  PERKS = "perks",
  PETS = "allpetitems",
  PIG_PEN = "pigpen",
  POST_OFFICE = "postoffice",
  PROFILE = "profile",
  QUEST = "quest",
  QUESTS = "quests",
  SETTINGS = "settings",
  SETTINGS_OPTIONS = "settings_options",
  TEMPLE = "mailitems", // not a typo
  VAULT = "crack",
  WELL = "well",
  WHEEL = "spin",
  WORKER = "worker",
  WORKSHOP = "workshop",
}

export enum WorkerGo {
  ACTIVATE_PERK_SET = "activateperkset",
  SET_BIO = "settings_bio",
  COLLECT_ALL_PET_ITEMS = "collectallpetitems",
  COLLECT_ALL_MAIL_ITEMS = "collectallmailitems",
  COLLECT_ALL_MEALS = "cookreadyall",
  COOK_ALL = "cookitemall",
  DEPOSIT_SILVER = "depositsilver",
  FARM_STATUS = "farmstatus",
  GET_STATS = "getstats",
  HARVEST_ALL = "harvestall",
  NOTES = "notes",
  PLANT_ALL = "plantall",
  READY_COUNT = "readycount",
  RESET_PERKS = "resetperks",
  SEASON_MEALS = "seasonmealsall",
  STIR_MEALS = "stirmealsall",
  TASTE_MEALS = "tastemealsall",
  USE_ITEM = "useitem",
  WITHDRAW_SILVER = "withdrawalsilver",
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
  document.querySelector(
    ".page-on-center, .page-from-right-to-center, .view-main .page:only-child"
  );

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

export const getTitle = (
  searchTitle: string | RegExp,
  root?: HTMLElement
): HTMLElement | null => {
  const currentPage = root ?? getCurrentPage();
  if (!currentPage) {
    console.error("Current page not found");
    return null;
  }
  const titles = currentPage.querySelectorAll(".content-block-title");
  const targetTitle = [...titles].find((title) =>
    searchTitle instanceof RegExp
      ? searchTitle.test(title.textContent || "")
      : title.textContent === searchTitle
  );
  return (targetTitle as HTMLElement | undefined) ?? null;
};

export const getCardByTitle = (
  searchTitle: string | RegExp,
  root?: HTMLElement
): HTMLElement | null => {
  const targetTitle = getTitle(searchTitle, root);
  if (!targetTitle) {
    console.error(`${searchTitle} title not found`);
    return null;
  }
  return targetTitle.nextElementSibling as HTMLElement | null;
};

export const getListByTitle = (
  searchTitle: string | RegExp,
  root?: HTMLElement
): HTMLUListElement | null => {
  const targetCard = getCardByTitle(searchTitle, root);
  if (!targetCard) {
    console.error(`${searchTitle} card not found`);
    return null;
  }
  return targetCard.querySelector("ul");
};
