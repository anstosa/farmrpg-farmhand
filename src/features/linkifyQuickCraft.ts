import { Feature } from "../utils/feature";
import { getCurrentPage, Page } from "~/utils/page";
import { itemDataState } from "~/api/buddyfarm/api";

export const linkifyQuickCraft: Feature = {
  onPageLoad: async (settings, page) => {
    // make sure we're on the item page
    if (page !== Page.ITEM) {
      return;
    }

    const currentPage = getCurrentPage();
    if (!currentPage) {
      return;
    }

    const missingIngredientsWrapper =
      currentPage.querySelector<HTMLSpanElement>("span[style='color:red']");
    if (!missingIngredientsWrapper) {
      return;
    }
    const missingIngredients =
      missingIngredientsWrapper.textContent?.split(", ");
    missingIngredientsWrapper.textContent = "";
    for (const ingredient of missingIngredients ?? []) {
      const data = await itemDataState.get({ query: ingredient });
      if (!data) {
        console.error(`No data for ${ingredient}`);
        continue;
      }

      const link = document.createElement("a");
      link.dataset.view = ".view-main";
      link.href = `item.php?id=${data.id}`;
      link.textContent = ingredient;
      link.style.color = "red";
      link.style.marginRight = "5px";
      link.style.display = "block";
      missingIngredientsWrapper.append(link);
    }
  },
};
