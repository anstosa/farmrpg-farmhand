import { corsFetch } from "~/api/utils";
import { Feature } from "~/features/feature";
import {
  Handler,
  NotificationId,
  registerNotificationHandler,
  removeNotification,
  sendNotification,
} from "~/utils/notifications";
import { latestVersionState, SCRIPT_URL } from "~/api/greasyfork/api";
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

const README_URL =
  "https://github.com/anstosa/farmrpg-farmhand/blob/main/README.md";

registerNotificationHandler(Handler.CHANGES, async () => {
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

registerNotificationHandler(Handler.UPDATE, () => window.open(SCRIPT_URL));

export const versionManager: Feature = {
  onInitialize: async () => {
    const latestVersion = await latestVersionState.get();
    if (!latestVersion) {
      console.error("Failed to get latest version");
      return;
    }
    if (isVersionHigher(latestVersion, currentVersion)) {
      sendNotification({
        class: "btnblue",
        id: NotificationId.UPDATE,
        text: `Farmhand update available: ${currentVersion} → ${latestVersion}`,
        actions: [
          {
            text: "View Changes",
            handler: Handler.CHANGES,
          },
          {
            text: "Update",
            handler: Handler.UPDATE,
          },
        ],
      });
    } else {
      removeNotification(NotificationId.UPDATE);
    }
  },
};
