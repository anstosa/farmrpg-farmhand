import { BORDER_GRAY } from "~/utils/theme";
import { Feature } from "./feature";

export const quests: Feature = {
  onInitialize: () => {
    document.head.insertAdjacentHTML(
      "beforeend",
      `
      <style>
        /* make room for minimize button */
        #statszone > div {
          padding-right: 15px;
        }
        /* make line prettier */
        #statszone hr {
          height: 1px;
          background-color: ${BORDER_GRAY};
          border: none;
        }
      <style>
    `
    );
  },
  onQuestLoad: () => {
    const popup = document.querySelector<HTMLDivElement>(".aqp");
    if (!popup) {
      return;
    }
    popup.dataset.isMinimized = popup.dataset.isMinimized ?? "false";

    // skip adding close button if it already exists
    if (popup.querySelector(".fh-minimize")) {
      return;
    }

    const minimizeButton = document.createElement("i");
    minimizeButton.classList.add("fh-minimize");
    minimizeButton.classList.add("fa");
    minimizeButton.classList.add("fw");
    minimizeButton.classList.add("fa-chevron-down");
    minimizeButton.style.position = "absolute";
    minimizeButton.style.top = "10px";
    minimizeButton.style.right = "10px";
    minimizeButton.style.cursor = "pointer";
    minimizeButton.addEventListener("click", () => {
      if (popup.dataset.isMinimized === "true") {
        minimizeButton.classList.remove("fa-chevron-up");
        minimizeButton.classList.add("fa-chevron-down");
        popup.style.top = "auto";
        popup.dataset.isMinimized = "false";
      } else {
        minimizeButton.classList.remove("fa-chevron-down");
        minimizeButton.classList.add("fa-chevron-up");
        popup.style.top = "70px";
        popup.dataset.isMinimized = "true";
      }
    });

    popup.append(minimizeButton);
  },
};
