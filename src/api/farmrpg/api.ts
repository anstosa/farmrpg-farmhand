import { CachedState, onFetchResponse, StorageKey, toUrl } from "../state";
import { FEATURES } from "~/index";
import { getDocument } from "../utils";
import { getSettings } from "~/features/farmhandSettings";
import { Page } from "../../utils/page";

export const requestHTML = async (
  page: Page,
  query?: URLSearchParams
): Promise<Document> => {
  const response = await fetch(toUrl(page, query), {
    method: "POST",
    mode: "cors",
    credentials: "include",
  });
  return getDocument(response);
};

export const requestJSON = async <T extends object>(
  page: Page,
  query?: URLSearchParams
): Promise<T> => {
  const response = await fetch(toUrl(page, query), {
    method: "POST",
    mode: "cors",
    credentials: "include",
  });
  const settings = await getSettings(FEATURES);
  onFetchResponse(settings, response);
  return await response.json();
};

export const timestampToDate = (timestamp: string): Date =>
  new Date(`${timestamp}-05:00`);

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

export const usernameState = new CachedState<string>(
  StorageKey.USERNAME,
  () =>
    Promise.resolve(
      document.querySelector("#logged_in_username")?.textContent || undefined
    ),
  {
    timeout: Number.POSITIVE_INFINITY, // never expire
    persist: false,
    defaultState: "",
  }
);

export const userIdState = new CachedState<number>(
  StorageKey.USERNAME,
  () => {
    const userIdRaw = document.querySelector("#logged_in_userid")?.textContent;
    return Promise.resolve(userIdRaw ? Number(userIdRaw) : undefined);
  },
  {
    timeout: Number.POSITIVE_INFINITY, // never expire
    persist: false,
    defaultState: -1,
  }
);

export const betaState = new CachedState<boolean>(
  StorageKey.IS_BETA,
  () =>
    Promise.resolve(document.querySelector("#is_beta")?.textContent === "1"),
  {
    timeout: Number.POSITIVE_INFINITY, // never expire
    persist: false,
    defaultState: false,
  }
);

export const darkModeState = new CachedState<boolean>(
  StorageKey.IS_DARK_MODE,
  () =>
    Promise.resolve(document.querySelector("#dark_mode")?.textContent === "1"),
  {
    timeout: Number.POSITIVE_INFINITY, // never expire
    persist: false,
    defaultState: false,
  }
);

export const musicState = new CachedState<boolean>(
  StorageKey.IS_MUSIC_ENABLED,
  () =>
    Promise.resolve(document.querySelector("#dark_mode")?.textContent === "1"),
  {
    timeout: Number.POSITIVE_INFINITY, // never expire
    persist: false,
    defaultState: true,
  }
);

export const chatState = new CachedState<boolean>(
  StorageKey.IS_CHAT_ENABLED,
  () => Promise.resolve(document.querySelector("#chat")?.textContent === "1"),
  {
    timeout: Number.POSITIVE_INFINITY, // never expire
    persist: false,
    defaultState: true,
  }
);
