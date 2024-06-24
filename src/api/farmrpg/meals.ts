import { CachedState, StorageKey } from "../state";
import { getDocument } from "../utils";
import { getListByTitle, Page } from "~/utils/page";
import { requestHTML, timestampToDate } from "./api";

export interface ActiveMeal {
  meal: string;
  finishedAt: number;
}

export interface MealsStatus {
  meals: ActiveMeal[];
}

const processMealStatus = (root: HTMLElement): MealsStatus => {
  const mealList = getListByTitle(/Time-based Effects/, root);
  if (!mealList) {
    return { meals: [] };
  }
  const meals: ActiveMeal[] = [];
  for (const mealWrapper of mealList.children) {
    const mealName = mealWrapper.querySelector("strong")?.textContent;
    if (!mealName) {
      continue;
    }
    const meal = mealName;
    const countdown = mealWrapper.querySelector<HTMLSpanElement>(
      "[data-countdown-to]"
    );
    const finishedAt = countdown?.dataset.countdownTo
      ? timestampToDate(countdown.dataset.countdownTo).getTime()
      : Date.now();
    meals.push({ meal, finishedAt });
  }
  return { meals };
};

export const mealsStatusState = new CachedState<MealsStatus>(
  StorageKey.MEALS_STATUS,
  async () => {
    const response = await requestHTML(Page.HOME_PATH);
    return processMealStatus(response.body);
  },
  {
    defaultState: {
      meals: [],
    },
    interceptors: [
      {
        match: [Page.HOME_PATH, new URLSearchParams()],
        callback: async (state, response) => {
          const root = await getDocument(response);
          state.set(processMealStatus(root.body));
        },
      },
    ],
  }
);
