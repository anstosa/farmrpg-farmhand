import { Feature, FeatureSetting } from "./feature";
import { mealsStatusState } from "~/api/farmrpg/meals";
import {
  NotificationId,
  removeNotification,
  sendNotification,
} from "~/utils/notifications";

const SETTING_MEAL_NOTIFICATIONS: FeatureSetting = {
  id: "mealNotifications",
  title: "Meal Notifications",
  description: `
    Show notification when meals are active with their countdowns
  `,
  type: "boolean",
  defaultValue: true,
};

let mealInterval: number | undefined;

const renderMeals = async (): Promise<void> => {
  const mealStatus = await mealsStatusState.get();
  if (!mealStatus || mealStatus.meals.length === 0) {
    clearInterval(mealInterval);
    removeNotification(NotificationId.MEAL);
    return;
  }
  sendNotification({
    class: "btnorange",
    id: NotificationId.MEAL,
    text: `${mealStatus.meals.length} meal${
      mealStatus.meals.length === 1 ? "" : "s"
    } active: ${mealStatus.meals
      .map((active) => {
        const now = new Date();
        const diffSeconds = active.finishedAt / 1000 - now.getTime() / 1000;
        const minutes = Math.floor(diffSeconds / 60);
        const seconds = Math.floor(diffSeconds % 60);
        if (minutes < 0 && seconds < 0) {
          mealsStatusState.set({
            meals: mealStatus.meals.filter((meal) => meal.meal !== active.meal),
          });
          return `${active.meal} (EXPIRED!)`;
        }
        const timeRemaining = `${minutes}:${seconds
          .toString()
          .padStart(2, "0")}`;
        return `${active.meal} (${timeRemaining})`;
      })
      .join(", ")}`,
  });
  if (!mealInterval) {
    mealInterval = setInterval(renderMeals, 1 * 1000) as unknown as number;
  }
};

export const mealNotifications: Feature = {
  settings: [SETTING_MEAL_NOTIFICATIONS],
  onInitialize: (settings) => {
    if (!settings[SETTING_MEAL_NOTIFICATIONS.id].value) {
      return;
    }
    mealsStatusState.onUpdate(renderMeals);
  },
};
