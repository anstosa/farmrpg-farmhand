import { CachedState, StorageKey } from "../state";
import { getDocument } from "../utils";
import { Page, WorkerGo } from "~/utils/page";
import { requestHTML, timestampToDate } from "./api";

export enum OvenStatus {
  EMPTY = "empty",
  COOKING = "cooking",
  ATTENTION = "attention",
  READY = "complete",
}

export interface KitchenStatus {
  status: OvenStatus;
  count: number;
}

const processKitchenStatus = (root: HTMLElement | undefined): KitchenStatus => {
  const statusText = root?.textContent;
  if (!statusText) {
    return {
      status: OvenStatus.EMPTY,
      count: 0,
    };
  }
  // 36 READY!
  const count = Number(statusText.split(" ")[0]);
  let status = OvenStatus.EMPTY;
  if (statusText.toLowerCase().includes("cooking")) {
    status = OvenStatus.COOKING;
  } else if (statusText.toLowerCase().includes("attention")) {
    status = OvenStatus.ATTENTION;
  } else if (statusText.toLowerCase().includes("ready")) {
    status = OvenStatus.READY;
  }
  return { status, count };
};

const processKitchenPage = (root: HTMLElement): KitchenStatus | undefined => {
  const ovens = root.querySelectorAll<HTMLAnchorElement>("a[href^='oven.php']");
  const count = ovens.length;
  let status = OvenStatus.EMPTY;
  for (const oven of ovens) {
    const statusText = oven.querySelector<HTMLSpanElement>(".item-after span");
    if (!statusText?.dataset.countdownTo) {
      continue;
    }
    const doneDate = timestampToDate(statusText.dataset.countdownTo);
    const now = new Date();
    if (doneDate < now) {
      status = OvenStatus.READY;
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
  }
  return { status, count };
};

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
    },
    interceptors: [
      {
        match: [Page.HOME_PATH, new URLSearchParams()],
        callback: async (state, response) => {
          const root = await getDocument(response);
          const kitchenStatus = root?.querySelector<HTMLSpanElement>(
            "a[href='kitchen.php'] .item-after span"
          );
          state.set(processKitchenStatus(kitchenStatus || undefined));
        },
      },
      {
        match: [Page.KITCHEN, new URLSearchParams()],
        callback: async (state, response) => {
          const root = await getDocument(response);
          state.set(processKitchenPage(root.body));
        },
      },
      {
        match: [
          Page.WORKER,
          new URLSearchParams({ go: WorkerGo.COLLECT_ALL_MEALS }),
        ],
        callback: async (state) => {
          await state.set({ status: OvenStatus.EMPTY });
        },
      },
      {
        match: [Page.WORKER, new URLSearchParams({ go: WorkerGo.COOK_ALL })],
        callback: async (state) => {
          await state.set({ status: OvenStatus.COOKING });
        },
      },
    ],
  }
);

export const collectAll = async (): Promise<void> => {
  await requestHTML(
    Page.WORKER,
    new URLSearchParams({ go: WorkerGo.COLLECT_ALL_MEALS })
  );
};
