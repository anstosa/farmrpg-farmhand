import { CachedState, StorageKey } from "../state";
import { getDocument } from "../utils";
import { Page, WorkerGo } from "~/utils/page";
import { requestHTML, timestampToDate } from "./api";
import { showPopup } from "~/utils/popup";

export enum OvenStatus {
  EMPTY = "empty",
  COOKING = "cooking",
  ATTENTION = "attention",
  READY = "complete",
}

export interface KitchenStatus {
  status: OvenStatus;
  count: number;
  checkAt: number;
}

const processKitchenStatus = (root: HTMLElement | undefined): KitchenStatus => {
  const statusText = root?.textContent;
  if (!statusText) {
    return {
      status: OvenStatus.EMPTY,
      count: 0,
      checkAt: Number.POSITIVE_INFINITY,
    };
  }
  // 36 READY!
  const count = Number(statusText.split(" ")[0]);
  let status = OvenStatus.EMPTY;
  let checkAt = Number.POSITIVE_INFINITY;
  if (statusText.toLowerCase().includes("cooking")) {
    status = OvenStatus.COOKING;
    checkAt = Date.now() + 60 * 1000;
  } else if (statusText.toLowerCase().includes("attention")) {
    status = OvenStatus.ATTENTION;
    checkAt = Date.now() + 60 * 1000;
  } else if (statusText.toLowerCase().includes("ready")) {
    status = OvenStatus.READY;
    checkAt = Number.POSITIVE_INFINITY;
  }
  return { status, count, checkAt };
};

const processKitchenPage = (root: HTMLElement): KitchenStatus | undefined => {
  const ovens = root.querySelectorAll<HTMLAnchorElement>("a[href^='oven.php']");
  const count = ovens.length;
  let status = OvenStatus.EMPTY;
  let checkAt = Number.POSITIVE_INFINITY;
  for (const oven of ovens) {
    const statusText = oven.querySelector<HTMLSpanElement>(".item-after span");
    if (!statusText?.dataset.countdownTo) {
      continue;
    }
    const doneDate = timestampToDate(statusText.dataset.countdownTo);
    const now = new Date();
    if (doneDate < now) {
      status = OvenStatus.READY;
      checkAt = Math.min(checkAt, Number.POSITIVE_INFINITY);
      break;
    }
    const images = oven.querySelectorAll<HTMLImageElement>("img");
    if (
      images.length > 1 &&
      [OvenStatus.EMPTY, OvenStatus.COOKING].includes(status)
    ) {
      status = OvenStatus.ATTENTION;
    } else if (status === OvenStatus.EMPTY) {
      status = OvenStatus.COOKING;
    }
    checkAt = Math.min(checkAt, Date.now() + 60 * 1000);
  }
  return { status, count, checkAt };
};

const scheduledUpdates: Record<number, NodeJS.Timeout> = {};

export const kitchenStatusState = new CachedState<KitchenStatus>(
  StorageKey.KITHCEN_STATUS,
  async () => {
    const response = await requestHTML(Page.KITCHEN, new URLSearchParams());
    return processKitchenPage(response.body);
  },
  {
    timeout: 5,
    defaultState: {
      status: OvenStatus.EMPTY,
      count: 0,
      checkAt: Number.POSITIVE_INFINITY,
    },
    interceptors: [
      {
        match: [Page.HOME_PATH, new URLSearchParams()],
        callback: async (settings, state, previous, response) => {
          const root = await getDocument(response);
          const kitchenStatus = root?.querySelector<HTMLSpanElement>(
            "a[href='kitchen.php'] .item-after span"
          );
          await state.set(processKitchenStatus(kitchenStatus || undefined));
        },
      },
      {
        match: [Page.KITCHEN, new URLSearchParams()],
        callback: async (settings, state, previous, response) => {
          const root = await getDocument(response);
          await state.set(processKitchenPage(root.body));
        },
      },
      {
        match: [
          Page.WORKER,
          new URLSearchParams({ go: WorkerGo.COLLECT_ALL_MEALS }),
        ],
        callback: async (settings, state, previous, response) => {
          const root = await getDocument(response);
          const successCount =
            root.body.textContent?.match(/success/g)?.length ?? 0;
          if (successCount) {
            showPopup({
              title: "Success!",
              contentHTML: `${successCount} meal${
                successCount === 1 ? "" : "s"
              } collected`,
            });
          }
          await state.set({
            status: OvenStatus.EMPTY,
            checkAt: Number.POSITIVE_INFINITY,
          });
        },
      },
      {
        match: [Page.WORKER, new URLSearchParams({ go: WorkerGo.COOK_ALL })],
        callback: async (settings, state) => {
          await state.set({
            status: OvenStatus.COOKING,
            checkAt: Date.now() + 60 * 1000,
          });
        },
      },
    ],
  }
);

const updateStatus = async (): Promise<void> => {
  const state = await kitchenStatusState.get({ doNotFetch: true });
  if (!state) {
    return;
  }
  if (state.checkAt < Date.now()) {
    await kitchenStatusState.get();
  }
};

// automatically update crops when finished
kitchenStatusState.onUpdate((state) => {
  if (!state) {
    return;
  }
  if (scheduledUpdates[state.checkAt]) {
    return;
  }
  scheduledUpdates[state.checkAt] = setTimeout(
    updateStatus,
    state.checkAt - Date.now()
  );
});

export const collectAll = async (): Promise<void> => {
  await requestHTML(
    Page.WORKER,
    new URLSearchParams({ go: WorkerGo.COLLECT_ALL_MEALS })
  );
};
