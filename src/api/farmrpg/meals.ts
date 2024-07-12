import { CachedState, StorageKey } from "../state";
import { getDocument } from "../utils";
import { getListByTitle, Page, WorkerGo } from "~/utils/page";
import { requestHTML, timestampToDate } from "./api";

export interface ActiveMeal {
  meal: string;
  finishedAt: number;
}

export interface MealsStatus {
  meals: ActiveMeal[];
}

const scheduledUpdates: Record<number, NodeJS.Timeout> = {};

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
        callback: async (settings, state, previous, response) => {
          const root = await getDocument(response);
          await state.set(processMealStatus(root.body));
        },
      },
      {
        match: [Page.WORKER, new URLSearchParams({ go: WorkerGo.USE_ITEM })],
        callback: async () => {
          // request homepage to trigger meals state update
          await requestHTML(Page.HOME_PATH);
        },
      },
    ],
  }
);

const removeFinishedMeals = async (): Promise<void> => {
  const state = await mealsStatusState.get({ doNotFetch: true });
  await mealsStatusState.set({
    meals: state?.meals.filter((meal) => meal.finishedAt < Date.now()) ?? [],
  });
};

// automatically remove meals when finished
mealsStatusState.onUpdate((state) => {
  for (const meal of state?.meals ?? []) {
    const { finishedAt } = meal;
    if (scheduledUpdates[finishedAt]) {
      continue;
    }
    scheduledUpdates[finishedAt] = setTimeout(
      removeFinishedMeals,
      finishedAt - Date.now()
    );
  }
});
