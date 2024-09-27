import { Feature, FeatureSetting } from "./feature";
import { Page } from "~/utils/page";

export const SETTING_EXPLORE_RESULTS: FeatureSetting = {
  id: "",
  title: "Explore: Improved Layout",
  description: "Larger icons and stable sort",
  type: "boolean",
  defaultValue: true,
};

let maxHeight = 0;

export const cleanupExplore: Feature = {
  settings: [SETTING_EXPLORE_RESULTS],
  onPageLoad: (settings, page) => {
    if (!page || ![Page.AREA, Page.FISHING].includes(page)) {
      return;
    }
    if (!settings[SETTING_EXPLORE_RESULTS.id].value) {
      return;
    }

    // get console
    const console = document.querySelector<HTMLSpanElement>("#consoletxt");
    if (!console || !console.parentElement) {
      return;
    }
    console.parentElement.style.height = "200px";
    const observer = new MutationObserver(() => {
      const results = console.querySelector<HTMLSpanElement>(
        "span[style='font-size:11px']"
      );
      if (!results) {
        return;
      }
      const icons = results.querySelectorAll("img");
      if (!icons) {
        return;
      }
      const sortedIcons = [...icons].sort((a, b) => a.src.localeCompare(b.src));

      const improvedLayout = document.createElement("div");
      improvedLayout.style.display = "flex";
      improvedLayout.style.flexWrap = "wrap";
      improvedLayout.style.justifyContent = "center";
      improvedLayout.style.alignItems = "center";
      improvedLayout.style.gap = "10px";
      improvedLayout.style.width = "100%";
      improvedLayout.style.marginTop = "10px";
      improvedLayout.innerHTML = `
      ${sortedIcons
        .map(
          (icon) => `
            <div style="display:flex; flex-direction:column; gap:4px; align-items:center;">
              <img src="${icon.src}" style="${icon.getAttribute(
            "style"
          )};width:36px!important">
              <span style="text-size:13px;">${icon.nextSibling?.textContent?.trim()}</span>
            </div>
          `
        )
        .join("")}
    `;
      results.style.display = "none";
      setTimeout(() => {
        maxHeight = Math.max(console.offsetHeight, maxHeight);
        console.style.minHeight = `${maxHeight}px`;
        console.style.display = "block";
      });
      results.after(improvedLayout);
    });
    observer.observe(console, { childList: true });
  },
};
