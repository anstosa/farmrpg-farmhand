import { Feature, FeatureSetting } from "../utils/feature";
import { getCardByTitle, getCurrentPage, getTitle, Page } from "~/utils/page";
import { getData, setData, SettingId } from "~/utils/settings";

interface UpdateData {
  latestRead: string;
}

const SETTING_UPDATE_AT_TOP: FeatureSetting = {
  id: SettingId.UPDATE_AT_TOP,
  title: "Home: Move updates to top",
  description: `
    Move the most recent update to the top of the home page and make it hidable
  `,
  type: "boolean",
  defaultValue: true,
};

export const moveUpdateToTop: Feature = {
  settings: [SETTING_UPDATE_AT_TOP],
  onPageLoad: async (settings, page) => {
    // make sure we're on the home page
    if (page !== Page.HOME_PAGE) {
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
    const { latestRead } = await getData<UpdateData>(SettingId.UPDATE_AT_TOP, {
      latestRead: "",
    });
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
        await setData(SettingId.UPDATE_AT_TOP, { latestRead: latestUpdate });
        window.location.reload();
      });
      recentUpdatesTitle.append(hideButton);
    }
  },
};
