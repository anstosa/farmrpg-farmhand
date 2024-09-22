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

interface CalculatorPage extends BasePage {
  type: null;
}

export type BuddyFarmPage =
  | TownsfolkPage
  | QuestlinePage
  | QuizPage
  | QuestPage
  | ItemPage
  | CalculatorPage;

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

export interface BuddyFarmPageData {
  townsfolk: TownsfolkPage[];
  questlines: QuestlinePage[];
  quizzes: QuizPage[];
  quests: QuestPage[];
  items: ItemPage[];
  pages: BuddyFarmPage[];
}

export const nameToSlug = (name: string): string =>
  name.trim().toLowerCase().replaceAll(/[\s']/g, "-");
