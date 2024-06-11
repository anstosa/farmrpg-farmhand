import { Feature, FeatureSetting } from "./feature";
import { getCurrentPage, Page } from "~/utils/page";

export const SETTING_BUDDY_FARM: FeatureSetting = {
  id: "buddyFarm",
  title: "Buddy's Almanac",
  description: "Add shortcut to look up items on buddy.farm",
  type: "boolean",
  defaultValue: true,
};

export const buddyFarm: Feature = {
  settings: [SETTING_BUDDY_FARM],
  onPageChange: (settings, page) => {
    // make sure setting is enabled
    if (!settings[SETTING_BUDDY_FARM.id].value) {
      return;
    }

    // make sure page content has loaded
    const currentPage = getCurrentPage();
    if (!currentPage) {
      return;
    }

    // make sure we are on an item page
    if (page !== Page.ITEM) {
      return;
    }

    // find header to get item data
    const itemHeader = document.querySelector(".sharelink");
    if (!itemHeader) {
      console.error("Item header not found");
      return;
    }

    // get name and link for item
    const itemName = itemHeader.textContent ?? "";
    const itemLink = `https://buddy.farm/i/${itemName
      .toLowerCase()
      .replaceAll(/[\s']/g, "-")}`;

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

    // create a new item detail for buddy.farm link
    const buddyFarmLinkLi = document.createElement("li");
    buddyFarmLinkLi.classList.add("close-panel");
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
  },
};
