import { corsFetch } from "~/api/utils";
import { Feature } from "~/features/feature";
import { latestVersionState, SCRIPT_URL } from "~/api/greasyfork/api";
import {
  registerNotificationHandler,
  removeNotification,
  sendNotification,
} from "~/utils/notifications";
import { showPopup } from "~/utils/popup";

// created by DefinePlugin in webpack
declare const __VERSION__: string | undefined;

const isVersion = (version: string): boolean => version.split(".").length === 3;

const normalizeVersion = (version: string): string => version.split("-")[0];

const isVersionHigher = (test: string, current: string): boolean => {
  const testParts = test.split(".");
  const currentParts = current.split(".");
  for (const [index, testPart] of testParts.entries()) {
    if (Number.parseInt(currentParts[index]) < Number.parseInt(testPart)) {
      return true;
    }
  }
  return false;
};

const currentVersion = normalizeVersion(__VERSION__ ?? "1.0.0");

const KEY_UPDATE_NOTIFICATION = "newversion";

const README_URL =
  "https://github.com/anstosa/farmrpg-farmhand/blob/main/README.md";

const HANDLER_CHANGES = "updateView";
registerNotificationHandler(HANDLER_CHANGES, async () => {
  const response = await corsFetch(README_URL);
  const htmlString = await response.text();
  const document = new DOMParser().parseFromString(htmlString, "text/html");
  const body = document.querySelector(".markdown-body");
  if (!body) {
    console.error("Failed to get README body");
    return;
  }
  let contentHTML = "";
  for (const child of body.children) {
    if (child.classList.contains("markdown-heading")) {
      const version = normalizeVersion(child.textContent ?? "1.0.0");
      if (isVersion(version) && isVersionHigher(version, currentVersion)) {
        contentHTML += `
          <h2>${version}</h2>
          <ul>${child.nextElementSibling?.innerHTML}</ul>
        `;
      }
    }
  }
  showPopup({ title: "Farmhand Changelog", contentHTML, align: "left" });
});

const HANDLER_UPDATE = "updateFarmhand";
registerNotificationHandler(HANDLER_UPDATE, () => window.open(SCRIPT_URL));

export const versionManager: Feature = {
  onInitialize: async () => {
    const latestVersion = normalizeVersion(
      (await latestVersionState.get()) ?? "1.0.0"
    );
    if (isVersionHigher(latestVersion, currentVersion)) {
      sendNotification({
        class: "btnblue",
        id: KEY_UPDATE_NOTIFICATION,
        text: `Farmhand update available: ${currentVersion} → ${latestVersion}`,
        actions: [
          {
            text: "View Changes",
            handlerName: HANDLER_CHANGES,
          },
          {
            text: "Update",
            handlerName: HANDLER_UPDATE,
          },
        ],
      });
    } else {
      removeNotification(KEY_UPDATE_NOTIFICATION);
    }
  },
};
