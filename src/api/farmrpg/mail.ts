import { CachedState, StorageKey } from "../state";
import {
  getCardByTitle,
  getListByTitle,
  Page,
  WorkerGo,
} from "../../utils/page";
import { getDocument } from "../utils";
import { sendRequest } from "./api";

export interface MailboxContent {
  from: string;
  item: string;
  count: number;
}

export interface MailboxState {
  contents: MailboxContent[];
  size: number;
}

const processPostoffice = (root: Document): MailboxState => {
  // get contents
  const contents: MailboxContent[] = [];
  const mailboxList = getListByTitle("Your Mailbox", root.body);
  const itemWrappers = mailboxList?.querySelectorAll(".collectbtnnc") ?? [];
  for (const itemWrapper of itemWrappers) {
    const from = itemWrapper.querySelector("span")?.textContent ?? "";
    const item = itemWrapper.querySelector("b")?.textContent ?? "";
    const count = Number(
      itemWrapper.querySelector("font")?.textContent?.replaceAll(",", "") ?? "0"
    );
    contents.push({ from, item, count });
  }

  // get size
  const increaseCard = getCardByTitle("Increase Mailbox Size", root.body);
  const size = Number(
    increaseCard?.querySelector("strong")?.textContent ?? "5"
  );

  return { contents, size };
};

export const mailboxState = new CachedState<MailboxState>(
  StorageKey.MAILBOX,
  async () => {
    const response = await sendRequest(Page.POST_OFFICE);
    return processPostoffice(response);
  },
  {
    interceptors: [
      {
        match: [Page.POST_OFFICE, new URLSearchParams()],
        callback: async (state, response) => {
          state.set(processPostoffice(await getDocument(response)));
        },
      },
      {
        match: [
          Page.WORKER,
          new URLSearchParams({ go: WorkerGo.COLLECT_ALL_MAIL_ITEMS }),
        ],
        callback: async (state) => {
          state.set({ ...(await state.get()), contents: [] });
        },
      },
    ],
  }
);

export const collectMailbox = async (): Promise<void> => {
  const mailbox = await mailboxState.get();
  await sendRequest(
    Page.WORKER,
    new URLSearchParams({ go: WorkerGo.COLLECT_ALL_MAIL_ITEMS })
  );
  await mailboxState.set({ ...mailbox, contents: [] });
};
