import { CachedState, StorageKey } from "../state";
import { corsFetch } from "../utils";

export const SCRIPT_URL =
  "https://greasyfork.org/en/scripts/497660-farm-rpg-farmhand";

export const latestVersionState = new CachedState<string | undefined>(
  StorageKey.LATEST_VERSION,
  async (): Promise<string | undefined> => {
    const response = await corsFetch(SCRIPT_URL);
    const htmlString = await response.text();
    const document = new DOMParser().parseFromString(htmlString, "text/html");
    return (
      document.querySelector("dd.script-show-version")?.textContent || undefined
    );
  },
  {
    timeout: 60 * 60 * 24, // 1 day
  }
);
