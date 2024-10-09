import { CachedState, StorageKey } from "../../../utils/state";
import { getCardByTitle, Page } from "../../../utils/page";
import { getDocument } from "../../../utils/requests";
import { getHTML } from "../utils/requests";
import { userState } from "./users";

export interface Mailbox {
  id: string;
  username: string;
  capacity: number;
  lookingFor: string;
  timestamp: number;
}

const processMailbox = (root: Document): Mailbox | undefined => {
  const idField = root.querySelector<HTMLInputElement>("#mb_to_id");
  const id = idField?.value;
  if (!id) {
    return;
  }
  const profileLink =
    root.querySelector<HTMLAnchorElement>("a[href^='profile']");
  if (!profileLink) {
    return;
  }
  const [, queryString] = profileLink.href.split("?");
  const linkQuery = new URLSearchParams(queryString);
  const username = linkQuery.get("user_name");
  if (!username) {
    return;
  }
  const cards = root.querySelectorAll(".card");
  let capacity = 5;
  for (const card of cards) {
    // This mailbox has 36 / 1,800 items in it currently.
    const match = card.textContent?.match(
      /This mailbox has [\d,]+ \/ ([\d,]+) items in it currently/
    );
    if (!match) {
      continue;
    }
    const [_, max] = match;
    capacity = Number(max.replaceAll(",", ""));
    break;
  }
  const lookingFor =
    getCardByTitle("Looking For", root.body)?.textContent ?? "";
  const timestamp = Date.now();
  return {
    id,
    username,
    capacity,
    lookingFor,
    timestamp,
  };
};

export const playerMailboxState = new CachedState<Mailbox, string>(
  StorageKey.PLAYER_MAILBOXES,
  async (state, userName) => {
    const previous = state.read(userName);
    if (previous) {
      return previous;
    }
    if (!userName) {
      return;
    }
    const user = await userState.get({ query: userName });
    if (!user) {
      return;
    }
    const response = await getHTML(
      Page.MAILBOX,
      new URLSearchParams({ id: user.id })
    );
    return processMailbox(response);
  },
  {
    persist: true,
    timeout: 60 * 24 * 7, // 1 week
    interceptors: [
      {
        match: [Page.MAILBOX, new URLSearchParams()],
        callback: async (state, previous, response) => {
          const mailbox = processMailbox(await getDocument(response));
          if (!mailbox) {
            return;
          }
          await state.set(mailbox, mailbox.username);
        },
      },
    ],
  }
);
