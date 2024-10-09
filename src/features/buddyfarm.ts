import { Feature, FeatureSetting } from "../utils/feature";
import { getCardByTitle, getCurrentPage, Page } from "~/utils/page";
import { nameToSlug } from "~/api/buddyfarm/requests";
import { SettingId } from "~/utils/settings";

const SETTING_BUDDY_FARM: FeatureSetting = {
  id: SettingId.BUDDY_FARM,
  title: "Item: Buddy's Almanac",
  description: "Add shortcut to look up items and quests on buddy.farm",
  type: "boolean",
  defaultValue: true,
};

export const buddyFarm: Feature = {
  settings: [SETTING_BUDDY_FARM],
  onPageLoad: (settings, page) => {
    // make sure setting is enabled
    if (!settings[SettingId.BUDDY_FARM]) {
      return;
    }

    // make sure page content has loaded
    const currentPage = getCurrentPage();
    if (!currentPage) {
      return;
    }

    // handle item pages
    if (page === Page.ITEM) {
      // find header to get item data
      const itemHeader = document.querySelector(".sharelink");
      if (!itemHeader) {
        console.error("Item header not found");
        return;
      }

      // get name and link for item
      const itemName = itemHeader.textContent ?? "";
      const itemLink = `https://buddy.farm/i/${nameToSlug(itemName)}`;

      // use title to find item details section
      const titles = currentPage.querySelectorAll(".content-block-title");
      const itemDetailsTitle = [...titles].find(
        (title) => title.textContent === "Item Details"
      );
      const itemDetailsCard = itemDetailsTitle?.nextElementSibling;
      const itemDetailsList = itemDetailsCard?.querySelector("ul");
      if (!itemDetailsList) {
        console.error("Item Details list not found");
        return;
      }

      // remove existing link
      document.querySelector(".fh-buddyshortcut")?.remove();

      // create a new item detail for buddy.farm link
      const buddyFarmLinkLi = document.createElement("li");
      buddyFarmLinkLi.classList.add("close-panel");
      buddyFarmLinkLi.classList.add("fh-buddyshortcut");
      buddyFarmLinkLi.innerHTML = `
      <div class="item-content">
        <div class="item-media">
          <a
            href="https://buddy.farm"
            onclick="window.open('https://buddy.farm', '_blank');return false;"
          >
            <img src="https://buddy.farm/icons/icon-256x256.png" class="itemimg">
          </a>
        </div>
        <div class="item-inner">
          <div class="item-title">
            Buddy's Almanac
            <br><span style="font-size: 11px">Lookup item on buddy.farm</span>
          </div>
          <div class="item-after">
            <a
              href="${itemLink}"
              onclick="window.open('${itemLink}', '_blank');return false;"
              class="button btngreen"
              style="height:28px"
            >OPEN</a>
          </div>
        </div>
      </div>
    `;

      // insert at top
      itemDetailsList.insertBefore(buddyFarmLinkLi, itemDetailsList.firstChild);
    }

    // handle quest pages
    if (page === Page.QUEST) {
      // find header to get item data
      const questHeader = currentPage.querySelector(".item-title");
      if (!questHeader) {
        console.error("Quest header not found");
        return;
      }

      // get name and link for item
      const questName = questHeader.textContent ?? "";
      const questLink = `https://buddy.farm/q/${nameToSlug(questName)}`;

      // find last card to insert
      const card =
        getCardByTitle("This Help Request is Visible") ??
        getCardByTitle("This Help Request is Hidden");
      if (!card) {
        console.error("last card not found");
        return;
      }

      // remove existing link
      document.querySelector(".fh-buddyshortcut")?.remove();

      // create a new item detail for buddy.farm link
      const buddyFarmLink = document.createElement("div");
      buddyFarmLink.classList.add("list-block");
      buddyFarmLink.classList.add("fh-buddyshortcut");
      buddyFarmLink.innerHTML = `
        <ul>
          <li>
            <div class="item-content">
              <div class="item-media">
                <a
                  href="https://buddy.farm"
                  onclick="window.open('https://buddy.farm', '_blank');return false;"
                >
                  <img src="https://buddy.farm/icons/icon-256x256.png" class="itemimg">
                </a>
              </div>
              <div class="item-inner">
                <div class="item-title">
                  Buddy's Almanac
                  <br><span style="font-size: 11px">Lookup item on buddy.farm</span>
                </div>
                <div class="item-after">
                  <a
                    href="${questLink}"
                    onclick="window.open('${questLink}', '_blank');return false;"
                    class="button btngreen"
                    style="height:28px"
                  >OPEN</a>
                </div>
              </div>
            </div>
          </li>
        </ul>
      `;

      // insert at top
      card.insertBefore(buddyFarmLink, card.firstChild);
    }
  },
};
