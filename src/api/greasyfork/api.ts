import { CachedState, StorageKey } from "../../utils/state";
import { corsFetch } from "../../utils/requests";

export const SCRIPT_URL =
  "https://greasyfork.org/en/scripts/497660-farm-rpg-farmhand";

export const latestVersionState = new CachedState<string>(
  StorageKey.LATEST_VERSION,
  async (): Promise<string> => {
    const response = await corsFetch(SCRIPT_URL);
    const htmlString = await response.text();
    const document = new DOMParser().parseFromString(htmlString, "text/html");
    return (
      document.querySelector("dd.script-show-version")?.textContent || "1.0.0"
    );
  },
  {
    timeout: 60 * 60 * 6, // 6 hours
    defaultState: "1.0.0",
  }
);
