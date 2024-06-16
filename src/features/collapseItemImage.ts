import { Feature, FeatureSetting } from "./feature";
import { Page } from "~/utils/page";

export const SETTING_COLLAPSE_ITEM: FeatureSetting = {
  id: "collapseItem",
  title: "Item: Collapse Item Image",
  description: "Move item image in header to save space",
  type: "boolean",
  defaultValue: false,
};

export const collapseItemImage: Feature = {
  settings: [SETTING_COLLAPSE_ITEM],
  onInitialize: (settings) => {
    if (settings[SETTING_COLLAPSE_ITEM.id].value) {
      document.head.insertAdjacentHTML(
        "beforeend",
        `
        <style>
          /* Hide item image and description */
          [data-page="item"] #img {
            display: none !important;
          }
          
          /* Hide first section title */
          [data-page="item"] #img + .content-block-title {
            display: none !important;
          }
        </style>
      `
      );
    }
  },
  onPageLoad: (settings, page) => {
    // make sure we're on the item page
    if (page !== Page.ITEM) {
      return;
    }

    const itemImage = document.querySelector<HTMLImageElement>("#img img");
    if (!itemImage) {
      console.error("Item image not found");
      return;
    }

    // wait for animations
    const sharelink = document.querySelector<HTMLDivElement>(
      ".view-main .center .sharelink"
    );
    if (!sharelink) {
      return;
    }
    let smallImage = sharelink.querySelector<HTMLImageElement>("img");
    if (!smallImage) {
      smallImage = document.createElement("img");
    }
    sharelink.style.display = "flex";
    sharelink.style.alignItems = "center";
    sharelink.style.gap = "10px";
    smallImage.src = itemImage.src;
    smallImage.style.width = "30px";
    sharelink.prepend(smallImage);
  },
};
