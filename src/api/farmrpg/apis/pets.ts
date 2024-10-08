import { CachedState, StorageKey } from "../../../utils/state";
import { getDocument } from "../../../utils/requests";
import { getHTML } from "../utils/requests";
import { getTitle, Page, WorkerGo } from "../../../utils/page";
import { Item } from "../../buddyfarm/types";
import { itemDataState } from "~/api/buddyfarm/api";
import { MailboxContent, mergeContents } from "./mail";
import { NotificationId, removeNotification } from "~/utils/notifications";
import { showPopup } from "~/utils/popup";

const processPets = (root: Document): MailboxContent[] => {
  // get contents
  const contents: MailboxContent[] = [];
  const listTitle = getTitle("All Items Found", root.body);
  const list =
    listTitle?.nextElementSibling?.nextElementSibling?.firstElementChild;
  const itemWrappers = list?.querySelectorAll("li") ?? [];
  for (const itemWrapper of itemWrappers) {
    const from = (itemWrapper.querySelector("span")?.textContent ?? "").replace(
      "From ",
      ""
    );
    const item = itemWrapper.querySelector("strong")?.textContent ?? "";
    const count = Number(
      itemWrapper
        .querySelector(".item-after")
        ?.textContent?.replaceAll(",", "") ?? "0"
    );
    contents.push({ from, item, count });
  }

  return contents;
};

export const petState = new CachedState<MailboxContent[]>(
  StorageKey.PETS,
  async () => {
    const response = await getHTML(Page.PETS);
    return processPets(response);
  },
  {
    persist: false,
    defaultState: [],
    interceptors: [
      {
        match: [Page.PETS, new URLSearchParams()],
        callback: async (state, previous, response) => {
          await state.set(processPets(await getDocument(response)));
        },
      },
      {
        match: [
          Page.WORKER,
          new URLSearchParams({ go: WorkerGo.COLLECT_ALL_PET_ITEMS }),
        ],
        callback: async (state) => {
          await state.set([]);
        },
      },
    ],
  }
);

export const collectPets = async (): Promise<void> => {
  const state = await petState.get();
  if (!state) {
    return;
  }
  const mergedItems = mergeContents(state);
  const items: { item: Item | undefined; count: number }[] = await Promise.all(
    mergedItems.map(async (mail) => ({
      item: await itemDataState.get({ query: mail.item }),
      count: mail.count,
    }))
  );
  removeNotification(NotificationId.PETS);
  showPopup({
    title: "Collected Pet Items",
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
    new URLSearchParams({ go: WorkerGo.COLLECT_ALL_PET_ITEMS })
  );
};
