import { Feature } from "./feature";
import { getCurrentPage, Page } from "~/utils/page";
import { getItemData } from "~/utils/buddyfarmApi";

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

    const missingIngredients = currentPage.querySelectorAll<HTMLSpanElement>(
      "span[style='color:red']"
    );
    for (const ingredient of missingIngredients) {
      const ingredientName = ingredient.textContent;
      if (!ingredientName) {
        continue;
      }
      const data = await getItemData(ingredientName);
      if (!data) {
        console.error(`No data for ${ingredientName}`);
        continue;
      }

      const link = document.createElement("a");
      link.dataset.view = ".view-main";
      link.href = `item.php?id=${data.id}`;
      link.textContent = ingredientName;
      link.style.color = "red";
      ingredient.replaceWith(link);
    }
  },
};
