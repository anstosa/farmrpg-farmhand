import { banker } from "./features/banker";
import { buddyFarm } from "~/features/buddyfarm";
import { farmhandSettings, getSettings } from "./features/farmhandSettings";
import { getPage, Page } from "~/utils/page";

const FEATURES = [buddyFarm, farmhandSettings, banker];

const onPageChange = async (
  page: Page | undefined,
  parameters: URLSearchParams
): Promise<void> => {
  const settings = await getSettings(FEATURES);
  for (const { onPageChange } of FEATURES) {
    if (onPageChange) {
      onPageChange(settings, page, parameters);
    }
  }
};

(function () {
  // eslint-disable-next-line unicorn/prefer-module
  "use strict";
  console.info("STARTING Farmhand by Ansel Santosa");

  // listen for location changes
  let oldHref = document.location.href;
  const { body } = document;
  const observer = new MutationObserver(() => {
    if (oldHref !== document.location.href) {
      oldHref = document.location.href;
      const [page, parameters] = getPage();
      console.debug("Page Change", page, parameters);
      onPageChange(page, parameters);
    }
  });
  observer.observe(body, { childList: true, subtree: true });

  // process first page
  setTimeout(() => onPageChange(...getPage()));
})();
