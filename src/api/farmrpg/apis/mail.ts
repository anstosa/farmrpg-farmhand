import { CachedState, StorageKey } from "../../../utils/state";
import {
  getCardByTitle,
  getListByTitle,
  Page,
  WorkerGo,
} from "../../../utils/page";
import { getDocument } from "../../../utils/requests";
import { getHTML } from "../utils/requests";
import { Item } from "../../buddyfarm/types";
import { itemDataState } from "~/api/buddyfarm/api";
import { NotificationId, removeNotification } from "~/utils/notifications";
import { showPopup } from "~/utils/popup";

export interface MailboxContent {
  from: string;
  item: string;
  count: number;
}

export interface MailboxState {
  contents: MailboxContent[];
  size: number;
}

export const mergeContents = (
  contents: MailboxContent[]
): Pick<MailboxContent, "count" | "item">[] => {
  const results: Pick<MailboxContent, "count" | "item">[] = [];
  for (const { item, count } of contents) {
    const existing = results.find((result) => result.item === item);
    if (existing) {
      existing.count += count;
    } else {
      results.push({ item, count });
    }
  }
  return results;
};

const processPostoffice = (root: Document): MailboxState => {
  // get contents
  const contents: MailboxContent[] = [];
  const mailboxList = getListByTitle(/Your Mailbox/, root.body);
  const itemWrappers = mailboxList?.querySelectorAll(".collectbtnnc") ?? [];
  for (const itemWrapper of itemWrappers) {
    const from = (itemWrapper.querySelector("span")?.textContent ?? "").replace(
      "From ",
      ""
    );
    const item = itemWrapper.querySelector("strong")?.textContent ?? "";
    const count = Number(
      itemWrapper
        .querySelector(".item-after")
        ?.textContent?.replaceAll(/,|x/g, "") ?? "0"
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
    const response = await getHTML(Page.POST_OFFICE);
    return processPostoffice(response);
  },
  {
    persist: false,
    defaultState: {
      contents: [],
      size: 5,
    },
    interceptors: [
      {
        match: [Page.POST_OFFICE, new URLSearchParams()],
        callback: async (state, previous, response) => {
          await state.set(processPostoffice(await getDocument(response)));
        },
      },
      {
        match: [
          Page.WORKER,
          new URLSearchParams({ go: WorkerGo.COLLECT_ALL_MAIL_ITEMS }),
        ],
        callback: async (state, previous) => {
          await state.set({ ...previous, contents: [] });
        },
      },
    ],
  }
);

export const collectMailbox = async (): Promise<void> => {
  const state = await mailboxState.get();
  if (!state) {
    return;
  }
  const mergedItems = mergeContents(state.contents);
  const items: { item: Item | undefined; count: number }[] = await Promise.all(
    mergedItems.map(async (mail) => ({
      item: await itemDataState.get({ query: mail.item }),
      count: mail.count,
    }))
  );
  removeNotification(NotificationId.MAILBOX);
  showPopup({
    title: "Collected Mail",
    contentHTML: `
      ${items
        .map((mail) =>
          mail.item
            ? `
              <img
                src="${mail.item.image}"
                style="
                  vertical-align: middle;
                  width: 18px;
                "
              >
              (x${mail.count})
            `
            : ``
        )
        .join("&nbsp;")}
    `,
  });
  await getHTML(
    Page.WORKER,
    new URLSearchParams({ go: WorkerGo.COLLECT_ALL_MAIL_ITEMS })
  );
};
