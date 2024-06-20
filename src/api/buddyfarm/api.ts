import {
  BasicEntity,
  BuddyFarmPage,
  Item,
  nameToSlug,
  BuddyFarmPageData as PageData,
} from "./state";
import { CachedState, StorageKey } from "../state";

interface PageDataResponse {
  componentChunkName: string;
  path: string;
  result: {
    data: {
      farmrpg: {
        items: Item[];
      };
    };
    pageContext: {
      id: number;
      name: string;
    };
  };
  slicesMap: unknown;
  staticQueryHashes: unknown;
}

// TODO cache this
export const getItemByName = async (
  itemName: string
): Promise<Item | undefined> => {
  const response = await fetch(
    `https://buddy.farm/page-data/i/${nameToSlug(itemName)}/page-data.json`
  );
  const data = (await response.json()) as PageDataResponse;
  const item = data?.result?.data?.farmrpg?.items?.[0];
  if (!item) {
    console.error(`Item ${itemName} not found`);
    return;
  }
  return item;
};

export const getBasicItems = async (): Promise<BasicEntity[]> => {
  const { items } = (await pageDataState.get()) ?? {};
  return items.map(({ name, image }) => ({ name, image }));
};

export const pageDataState = new CachedState<PageData>(
  StorageKey.PAGE_DATA,
  async () => {
    const pages: PageData = {
      townsfolk: [],
      questlines: [],
      quizzes: [],
      quests: [],
      items: [],
      pages: [],
    };
    const response = await fetch("https://buddy.farm/search.json");
    const data = (await response.json()) as BuddyFarmPage[];
    for (const page of data) {
      // eslint-disable-next-line unicorn/prefer-switch
      if (page.type === "Townsfolk") {
        pages.townsfolk.push(page);
      } else if (page.type === "Questline") {
        pages.questlines.push(page);
      } else if (page.type === "Schoolhouse Quiz") {
        pages.quizzes.push(page);
      } else if (page.href.startsWith("/q/")) {
        pages.quests.push(page);
      } else if (page.href.startsWith("/i/")) {
        pages.items.push(page);
      } else {
        pages.pages.push(page);
      }
    }
    return pages;
  },
  {
    timeout: 60 * 60 * 24, // 1 day
  }
);
