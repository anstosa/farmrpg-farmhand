interface BasePage {
  href: string;
  image: string;
  name: string;
  searchText: string;
}

interface TownsfolkPage extends BasePage {
  type: "Townsfolk";
}

interface QuestlinePage extends BasePage {
  type: "Questline";
}

interface QuizPage extends BasePage {
  type: "Schoolhouse Quiz";
}

interface QuestPage extends BasePage {
  type: null;
}

interface ItemPage extends BasePage {
  type: null;
}

interface BuddyFarmPage extends BasePage {
  type: null;
}

type Page =
  | TownsfolkPage
  | QuestlinePage
  | QuizPage
  | QuestPage
  | ItemPage
  | BuddyFarmPage;

export interface Item {
  __typename: "FarmRPG_Item";
  baseYieldMinutes: number;
  buyPrice: number;
  canBuy: boolean;
  canCook: boolean;
  canCraft: boolean;
  canMail: boolean;
  cardsTrades: unknown[];
  communityCenterOutputs: {
    date: string;
    inputItem: AbridgedItem;
    inputQuantity: number;
    outputQuantity: number;
    progress: number;
  }[];
  cookingLevel: number;
  cookingRecipeCookable: AbridgedItem;
  cookingRecipeItem: AbridgedItem;
  craftingLevel: number;
  description: string;
  dropRates: unknown[];
  dropRatesItems: {
    dropRates: {
      ironDepot: boolean | null;
      location: AbridgedLocation;
      manualFishing: boolean | null;
      runecube: boolean | null;
      seed: boolean | null;
    };
    rate: number;
  }[];
  exchangeCenterInputs: {
    inputQuantity: number;
    lastSeen: string;
    oneshot: false;
    outputItem: AbridgedItem;
    outputQuantity: number;
  }[];
  exchangeCenterOutputs: {
    inputItem: AbridgedItem;
    inputQuantity: number;
    lastSeen: string;
    oneshot: false;
    outputQuantity: number;
  }[];
  fleaMarketPrice: number;
  fleaMarketRotate: boolean;
  id: number;
  image: string;
  locksmithGold: number;
  locksmithGrabBag: boolean;
  locksmithItems: {
    outputItem: AbridgedItem;
    quantityMax: number;
    quantityMin: number;
  }[];
  locksmithKey: AbridgedItem;
  locksmithKeyItems: unknown[];
  locksmithOutputItems: {
    item: AbridgedItem;
    quantityMax: number;
    quantityMin: number;
  }[];
  manualFishingOnly: boolean;
  manualProductions: unknown[];
  name: string;
  npcItems: unknown[];
  npcRewards: { level: number; quantity: number; npc: AbridgedNPC }[];
  passwordItems: {
    password: {
      id: number;
      password: string;
    };
    quantity: number;
  }[];
  petItems: { level: number; pet: AbridgedPet }[];
  quizRewards: { quantity: number; quest: AbridgedQuest }[];
  recipeIngredientItems: { item: AbridgedItem; quantity: number }[];
  recipeItems: {
    item: AbridgedItem;
    quantity: number;
  }[];
  requiredForQuests: { quantity: number; quest: AbridgedQuest }[];
  rewardForQuests: { quantity: number; quest: AbridgedQuest }[];
  skillLevelRewards: {
    itemQuantity: number;
    level: number;
    skill: "cooking" | "crafting" | "farming" | "fishing" | "exploring";
  }[];
  templeRewardItems: {
    id: number;
    quantity: number;
    templeReward: { inputQuantity: number; inputItem: AbridgedItem };
  }[];
  towerRewards: { level: number; itemQuantity: number }[];
  type: "item";
  wishingWellInputItems: { chance: number; outputItem: AbridgedItem }[];
  wishingWellOutputItems: { chance: number; inputItem: AbridgedItem }[];
}

type AbridgedItem = Pick<Item, "id" | "image" | "name" | "__typename">;

interface Quest {
  __typename: "FarmRPG_Quest";
  id: number;
  name: string;
  image: string;
  endDate: string | null;
  isHidden: boolean;
  requiredNpcLevel: number;
}

type AbridgedQuest = Pick<
  Quest,
  "name" | "image" | "__typename" | "requiredNpcLevel"
>;

interface Pet {
  __typename: "FarmRPG_Pet";
  name: string;
  image: string;
  cost: number;
  petItems: {
    level: number;
    item: AbridgedItem;
  }[];
  requiredCookingLevel: number;
  requiredCraftingLevel: number;
  requiredFishingLevel: number;
  requiredFarmingLevel: number;
  requiredExploringLevel: number;
}

type AbridgedPet = Pick<Pet, "name" | "image" | "__typename">;

interface NPC {
  __typename: "FarmRPG_NPC";
  name: string;
  image: string;
  npcItems: {
    item: AbridgedItem;
    relationship: "hates" | "likes" | "loves";
  }[];
  npcRewards: {
    item: AbridgedItem;
    level: number;
    order: number;
    quantity: number;
  }[];
  quests: AbridgedQuest[];
}

type AbridgedNPC = Pick<NPC, "name" | "image" | "__typename">;

interface Location {
  __typename: "FarmRPG_Location";
  baseDropRate: number | null;
  name: string;
  image: string;
  dropRates: {
    ironDepot: boolean | null;
    manualFishing: boolean | null;
    runecube: boolean | null;
    silverPerHit: number;
    xpPerHit: number;
    items: {
      item: Pick<
        Item,
        "__typename" | "name" | "image" | "id" | "manualFishingOnly"
      >;
      rate: number;
    }[];
  }[];
  type: "fishing" | "explore";
}

type AbridgedLocation = Pick<
  Location,
  "__typename" | "type" | "name" | "image" | "baseDropRate"
>;

export interface BasicEntity {
  name: string;
  image: string;
}

interface PageData {
  townsfolk: TownsfolkPage[];
  questlines: QuestlinePage[];
  quizzes: QuizPage[];
  quests: QuestPage[];
  items: ItemPage[];
  pages: BuddyFarmPage[];
}

const state: { pageData?: PageData; itemData: Record<string, Item> } = {
  itemData: {},
};

export const nameToSlug = (name: string): string =>
  name.toLowerCase().replaceAll(/[\s']/g, "-");

export const getPageData = async (): Promise<PageData> => {
  if (state.pageData) {
    return state.pageData;
  }
  state.pageData = {
    townsfolk: [],
    questlines: [],
    quizzes: [],
    quests: [],
    items: [],
    pages: [],
  };
  const response = await fetch("https://buddy.farm/search.json");
  const data = (await response.json()) as Page[];
  for (const page of data) {
    // eslint-disable-next-line unicorn/prefer-switch
    if (page.type === "Townsfolk") {
      state.pageData.townsfolk.push(page);
    } else if (page.type === "Questline") {
      state.pageData.questlines.push(page);
    } else if (page.type === "Schoolhouse Quiz") {
      state.pageData.quizzes.push(page);
    } else if (page.href.startsWith("/q/")) {
      state.pageData.quests.push(page);
    } else if (page.href.startsWith("/i/")) {
      state.pageData.items.push(page);
    } else {
      state.pageData.pages.push(page);
    }
  }
  return state.pageData;
};

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

export const getItemData = async (
  itemName: string
): Promise<Item | undefined> => {
  if (state.itemData[itemName]) {
    return state.itemData[itemName];
  }
  const response = await fetch(
    `https://buddy.farm/page-data/i/${nameToSlug(itemName)}/page-data.json`
  );
  const data = (await response.json()) as PageDataResponse;
  const item = data?.result?.data?.farmrpg?.items?.[0];
  if (!item) {
    console.error(`Item ${itemName} not found`);
    return;
  }
  // eslint-disable-next-line require-atomic-updates
  state.itemData[itemName] = item;
  return item;
};

export const getBasicItems = async (): Promise<BasicEntity[]> => {
  const { items } = await getPageData();
  return items.map(({ name, image }) => ({ name, image }));
};
