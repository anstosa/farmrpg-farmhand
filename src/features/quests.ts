import { BORDER_GRAY } from "~/utils/theme";
import { Feature } from "./feature";

export const quests: Feature = {
  onInitialize: () => {
    // move spacing from panel margin to message padding regardless of setting
    document.head.insertAdjacentHTML(
      "beforeend",
      `
      <style>
        #statszone hr {
            height: 1px;
            background-color: ${BORDER_GRAY};
            border: none;
        }
      <style>
    `
    );
  },
};
