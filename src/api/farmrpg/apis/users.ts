import { CachedState, StorageKey } from "../../../utils/state";
import { getCardByTitle, Page } from "../../../utils/page";
import { getDocument } from "../../../utils/requests";
import { getHTML } from "../utils/requests";

export interface User {
  id: string;
  bio: string;
  username: string;
  colorClass: string;
  emblem: string;
  timestamp: number;
}

const processProfile = (root: Document): User | undefined => {
  const id = root.querySelector<HTMLAnchorElement>(".addfriendbtn")?.dataset.id;
  if (!id) {
    return;
  }
  const nameLink = root.querySelector(".sharelink");
  if (!nameLink) {
    return;
  }
  const username = nameLink.textContent;
  if (!username) {
    return;
  }
  const colorClass = nameLink.parentElement?.className ?? "";
  const bioCard = getCardByTitle("Public Bio", root.body);
  const bio = bioCard?.textContent ?? "";
  const image = root.querySelector<HTMLDivElement>("#img");
  const emblem = image?.querySelector<HTMLImageElement>("img")?.src ?? "";
  const timestamp = Date.now();
  return {
    id,
    bio,
    username,
    colorClass,
    emblem,
    timestamp,
  };
};

export const userState = new CachedState<User, string>(
  StorageKey.PLAYERS,
  async (state, userName) => {
    const previous = state.read(userName);
    if (previous) {
      return previous;
    }
    if (!userName) {
      return;
    }
    const response = await getHTML(
      Page.PROFILE,
      new URLSearchParams({ user_name: userName.replaceAll(" ", "+") })
    );
    return await processProfile(response);
  },
  {
    persist: true,
    timeout: 60 * 24 * 7, // 1 week
    interceptors: [
      {
        match: [Page.PROFILE, new URLSearchParams()],
        callback: async (state, previous, response) => {
          const user = processProfile(await getDocument(response));
          if (!user) {
            return;
          }
          await state.set(user, user.username);
        },
      },
    ],
  }
);
