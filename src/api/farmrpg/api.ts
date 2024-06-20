import { CachedState, StorageKey } from "../state";
import { getDocument } from "../utils";
import { Page } from "../../utils/page";

export const sendRequest = async (
  page: Page,
  query?: URLSearchParams
): Promise<Document> => {
  const response = await fetch(
    `https://farmrpg.com/${page}.php?${query ? query.toString() : ""}`,
    {
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  );
  return getDocument(response);
};

// export const recordHome = async (root?: HTMLElement): Promise<void> => {
//   if (!root) {
//     root = document.body;
//   }

//   let farm = state.get("farm");
//   const farmLink = root.querySelector("a[href^='xfarm.php']");
//   if (!farmLink) {
//     console.error("failed to find farm link");
//     return;
//   }
//   const farmId = Number(farmLink.getAttribute("href")?.split("=")[1]);
//   if (farm) {
//     farm.id = farmId;
//   } else {
//     farm = { id: farmId };
//   }
//   if (!farm.field) {
//     farm.field = {};
//   }
//   const farmStatus =
//     farmLink.querySelector(".item-after")?.textContent || undefined;
//   farm.field.status = farmStatus;
//   farm.field.plots = [];
//   if (farmStatus) {
//     const cropCount = Number(farmStatus.split(" ")[0]);
//     const isGrowing = farmStatus.includes("GROWING");
//     const isReady = farmStatus.includes("READY");
//     for (let index = 0; index < cropCount; index++) {
//       farm.field.plots.push({
//         isGrowing,
//         isReady,
//         progress: isReady ? 100 : undefined,
//       });
//     }
//   }

//   const kitchen = state.get("kitchen") ?? ({} as KitchenState);
//   const kitchenLink = root.querySelector("a[href='kitchen.php']");
//   if (!kitchenLink) {
//     console.error("failed to find kitchen link");
//     return;
//   }
//   const kitchenStatus =
//     kitchenLink.querySelector(".item-after")?.textContent || undefined;
//   kitchen.status = kitchenStatus;
//   kitchen.ovens = [];
//   if (kitchenStatus) {
//     const ovenCount = Number(kitchenStatus.split(" ")[0]);
//     const isCooking = kitchenStatus.includes("COOKING");
//     const isReady = kitchenStatus.includes("READY");
//     for (let index = 0; index < ovenCount; index++) {
//       kitchen.ovens.push({
//         isCooking,
//         isReady,
//       });
//     }
//   }

//   const town = state.get("town") ?? ({} as TownState);
//   const townLink = root.querySelector("a[href='town.php']");
//   if (!townLink) {
//     console.error("failed to find town link");
//     return;
//   }
//   const townStatus =
//     townLink.querySelector(".item-after")?.textContent || undefined;
//   town.status = townStatus;
//   if (townStatus) {
//     const isBorgenOpen = townStatus.includes("BORGEN");
//     town.isBorgenOpen = isBorgenOpen;
//   }

//   let skills = state.get("skills");
//   const skillsCard = getCardByTitle("My skills", root);
//   if (!skillsCard) {
//     console.error("failed to find skills card");
//     return;
//   }
//   let cookingSkill = 0;
//   let craftingSkill = 0;
//   let exploringSkill = 0;
//   let farmingSkill = 0;
//   let fishingSkill = 0;
//   let miningSkill = 0;
//   for (const skillBlock of skillsCard.querySelectorAll(".col-33")) {
//     let level = Number(skillBlock.textContent?.match(/Level (\d+)/)?.[1] ?? 0);
//     if (!level) {
//       console.error(`failed to read skill level ${skillBlock.textContent}`);
//       return;
//     }
//     // add incremental level based on progress
//     level +=
//       Number(
//         skillBlock.querySelector<HTMLDivElement>(".progressbar")?.dataset
//           .progress || "0"
//       ) / 100;
//     if (skillBlock.textContent?.includes("Cooking")) {
//       cookingSkill = level;
//     } else if (skillBlock.textContent?.includes("Crafting")) {
//       craftingSkill = level;
//     } else if (skillBlock.textContent?.includes("Exploring")) {
//       exploringSkill = level;
//     } else if (skillBlock.textContent?.includes("Farming")) {
//       farmingSkill = level;
//     } else if (skillBlock.textContent?.includes("Fishing")) {
//       fishingSkill = level;
//     } else if (skillBlock.textContent?.includes("Mining")) {
//       miningSkill = level;
//     }
//     skills = {
//       cooking: cookingSkill,
//       crafting: craftingSkill,
//       exploring: exploringSkill,
//       farming: farmingSkill,
//       fishing: fishingSkill,
//       mining: miningSkill,
//     };
//   }

//   state.update({ farm, kitchen, town, skills });
// };

// export const scrapeToCache: Feature = {
//   onPageLoad: (settings, page) => {
//     if (page === Page.HOME) {
//       recordHome();
//     }
//   },
// };

export const usernameState = new CachedState<string>(
  StorageKey.USERNAME,
  () =>
    Promise.resolve(
      document.querySelector("#logged_in_username")?.textContent || undefined
    ),
  { timeout: 0 } // always check, no cost
);

export const userIdState = new CachedState<number>(
  StorageKey.USERNAME,
  () => {
    const userIdRaw = document.querySelector("#logged_in_userid")?.textContent;
    return Promise.resolve(userIdRaw ? Number(userIdRaw) : undefined);
  },
  { timeout: 0 } // always check, no cost
);

export const betaState = new CachedState<boolean>(
  StorageKey.IS_BETA,
  () =>
    Promise.resolve(document.querySelector("#is_beta")?.textContent === "1"),
  {
    timeout: 0, // always check, no cost
    defaultState: false,
  }
);

export const darkModeState = new CachedState<boolean>(
  StorageKey.IS_DARK_MODE,
  () =>
    Promise.resolve(document.querySelector("#dark_mode")?.textContent === "1"),
  {
    timeout: 0, // always check, no cost
    defaultState: false,
  }
);

export const musicState = new CachedState<boolean>(
  StorageKey.IS_MUSIC_ENABLED,
  () =>
    Promise.resolve(document.querySelector("#dark_mode")?.textContent === "1"),
  {
    timeout: 0, // always check, no cost
    defaultState: true,
  }
);

export const chatState = new CachedState<boolean>(
  StorageKey.IS_CHAT_ENABLED,
  () => Promise.resolve(document.querySelector("#chat")?.textContent === "1"),
  {
    timeout: 0, // always check, no cost
    defaultState: true,
  }
);
