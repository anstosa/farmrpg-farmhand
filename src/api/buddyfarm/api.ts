import {
  AbridgedItem,
  BasicEntity,
  BuddyFarmPage,
  Item,
  BuddyFarmPageData as PageData,
} from "./types";
import { CachedState, StorageKey } from "../../utils/state";
import { nameToSlug } from "./requests";

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

export const itemDataState = new CachedState<Item, string>(
  StorageKey.ITEM_DATA,
  async (state, itemName) => {
    if (!itemName) {
      return;
    }
    const previous = state.state[itemName];
    if (previous) {
      return previous;
    }
    if (!itemName) {
      return;
    }
    const response = await fetch(
      `https://buddy.farm/page-data/i/${nameToSlug(itemName)}/page-data.json`
    );
    const data = (await response.json()) as PageDataResponse;
    const item = data?.result?.data?.farmrpg?.items?.[0];
    if (!item) {
      console.error(`Item ${itemName} not found`);
      return previous;
    }
    return item;
  },
  {
    timeout: 60 * 24 * 7, // 1 week
  }
);

export const getAbridgedItem = async (
  itemName: string
): Promise<AbridgedItem> => {
  const item = await itemDataState.get({ query: itemName, lazy: true });
  return item
    ? {
        __typename: item.__typename,
        id: item.id,
        image: item.image,
        name: item.name,
      }
    : {
        __typename: "FarmRPG_Item",
        id: 0,
        image:
          "data:image/svg+xml;charset=utf-8;base64,PHN2ZyB2aWV3Qm94PScwIDAgMTIwIDEyMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB4bWxuczp4bGluaz0naHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayc+PGRlZnM+PGxpbmUgaWQ9J2wnIHgxPSc2MCcgeDI9JzYwJyB5MT0nNycgeTI9JzI3JyBzdHJva2U9JyM2YzZjNmMnIHN0cm9rZS13aWR0aD0nMTEnIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcvPjwvZGVmcz48Zz48dXNlIHhsaW5rOmhyZWY9JyNsJyBvcGFjaXR5PScuMjcnLz48dXNlIHhsaW5rOmhyZWY9JyNsJyBvcGFjaXR5PScuMjcnIHRyYW5zZm9ybT0ncm90YXRlKDMwIDYwLDYwKScvPjx1c2UgeGxpbms6aHJlZj0nI2wnIG9wYWNpdHk9Jy4yNycgdHJhbnNmb3JtPSdyb3RhdGUoNjAgNjAsNjApJy8+PHVzZSB4bGluazpocmVmPScjbCcgb3BhY2l0eT0nLjI3JyB0cmFuc2Zvcm09J3JvdGF0ZSg5MCA2MCw2MCknLz48dXNlIHhsaW5rOmhyZWY9JyNsJyBvcGFjaXR5PScuMjcnIHRyYW5zZm9ybT0ncm90YXRlKDEyMCA2MCw2MCknLz48dXNlIHhsaW5rOmhyZWY9JyNsJyBvcGFjaXR5PScuMjcnIHRyYW5zZm9ybT0ncm90YXRlKDE1MCA2MCw2MCknLz48dXNlIHhsaW5rOmhyZWY9JyNsJyBvcGFjaXR5PScuMzcnIHRyYW5zZm9ybT0ncm90YXRlKDE4MCA2MCw2MCknLz48dXNlIHhsaW5rOmhyZWY9JyNsJyBvcGFjaXR5PScuNDYnIHRyYW5zZm9ybT0ncm90YXRlKDIxMCA2MCw2MCknLz48dXNlIHhsaW5rOmhyZWY9JyNsJyBvcGFjaXR5PScuNTYnIHRyYW5zZm9ybT0ncm90YXRlKDI0MCA2MCw2MCknLz48dXNlIHhsaW5rOmhyZWY9JyNsJyBvcGFjaXR5PScuNjYnIHRyYW5zZm9ybT0ncm90YXRlKDI3MCA2MCw2MCknLz48dXNlIHhsaW5rOmhyZWY9JyNsJyBvcGFjaXR5PScuNzUnIHRyYW5zZm9ybT0ncm90YXRlKDMwMCA2MCw2MCknLz48dXNlIHhsaW5rOmhyZWY9JyNsJyBvcGFjaXR5PScuODUnIHRyYW5zZm9ybT0ncm90YXRlKDMzMCA2MCw2MCknLz48L2c+PC9zdmc+",
        name: itemName,
      };
};

export const getBasicItems = async (): Promise<BasicEntity[]> => {
  const { items } = (await pageDataState.get()) ?? {};
  return items?.map(({ name, image }) => ({ name, image })) ?? [];
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
    defaultState: {
      townsfolk: [],
      questlines: [],
      quizzes: [],
      quests: [],
      items: [],
      pages: [],
    },
  }
);
