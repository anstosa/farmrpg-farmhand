import { Feature } from "./feature";
import { getCardByTitle, getCurrentPage, getTitle, Page } from "~/utils/page";

const KEY_RECENT = "recentUpdate";

export const moveUpdateToTop: Feature = {
  onPageLoad: async (settings, page) => {
    // make sure we're on the home page
    if (page !== Page.HOME) {
      return;
    }

    // get the recent card and title
    const recentUpdatesCard = getCardByTitle("Most Recent Update");
    const recentUpdatesTitle = recentUpdatesCard?.previousElementSibling;
    if (!recentUpdatesCard || !recentUpdatesTitle) {
      return;
    }

    // get the latest title
    const latestUpdate = recentUpdatesCard.querySelector("strong")?.textContent;
    if (!latestUpdate) {
      return;
    }

    // check if it's newer
    const latestRead = await GM.getValue(KEY_RECENT, "");
    if (latestUpdate === latestRead) {
      return;
    }

    // move to top
    const home = getCurrentPage();
    if (!home) {
      return;
    }
    const firstTitle = getTitle("Where do you want to go?");
    if (!firstTitle) {
      return;
    }
    firstTitle.before(recentUpdatesTitle);
    firstTitle.before(recentUpdatesCard);

    // add hide button
    let hideButton =
      recentUpdatesTitle.querySelector<HTMLAnchorElement>(".fh-hide-update");
    if (!hideButton) {
      hideButton = document.createElement("a");
      hideButton.classList.add("fh-hide-update");
      hideButton.style.marginLeft = "10px";
      hideButton.style.cursor = "pointer";
      hideButton.textContent = "Hide";
      hideButton.addEventListener("click", async () => {
        // mark current as read
        await GM.setValue(KEY_RECENT, latestUpdate);
        window.location.reload();
      });
      recentUpdatesTitle.append(hideButton);
    }
  },
};
