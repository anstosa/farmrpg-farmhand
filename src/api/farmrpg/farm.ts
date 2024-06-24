import { CachedState, StorageKey } from "../state";
import { getDocument } from "../utils";
import { Item } from "../buddyfarm/state";
import { Page, WorkerGo } from "~/utils/page";
import { requestHTML, requestJSON } from "./api";
import { showPopup } from "~/utils/popup";

export interface FarmState {
  id: number;
  field?: {
    rows?: number;
    status?: string;
    plots?: {
      cropName?: string;
      isGrowing: boolean;
      isReady: boolean;
      progress?: number;
    }[];
  };
}

export enum CropStatus {
  EMPTY = "empty",
  GROWING = "growing",
  READY = "ready",
}

export interface FarmStatus {
  status: CropStatus;
  count: number;
}

const processFarmStatus = (root: HTMLElement): FarmStatus | undefined => {
  const statusText = root.textContent;
  if (!statusText) {
    return {
      status: CropStatus.EMPTY,
      count: 0,
    };
  }
  // 36 READY!
  const count = Number(statusText.split(" ")[0]);
  let status = CropStatus.EMPTY;
  if (statusText.toLowerCase().includes("growing")) {
    status = CropStatus.GROWING;
  } else if (statusText.toLowerCase().includes("ready")) {
    status = CropStatus.READY;
  }
  return { status, count };
};

const processFarmPage = (root: HTMLElement): FarmStatus | undefined => {
  const plots = root.querySelectorAll<HTMLAnchorElement>(
    "#croparea #crops .col-25"
  );
  const count = plots.length;
  let status = CropStatus.EMPTY;
  for (const plot of plots) {
    const image = plot.querySelector<HTMLImageElement>("img");
    if (image?.style.opacity === "1") {
      status = CropStatus.READY;
    } else if (status === CropStatus.EMPTY) {
      status = CropStatus.GROWING;
    }
  }
  return { status, count };
};

export const farmStatusState = new CachedState<FarmStatus>(
  StorageKey.FARM_STATUS,
  async () => {
    const response = await requestHTML(Page.FARM, new URLSearchParams());
    return processFarmPage(response.body);
  },
  {
    timeout: 5,
    defaultState: {
      status: CropStatus.EMPTY,
      count: 4,
    },
    interceptors: [
      {
        match: [Page.WORKER, new URLSearchParams({ go: WorkerGo.READY_COUNT })],
        callback: async (state, response) => {
          const root = await getDocument(response);
          state.set(processFarmStatus(root.body));
        },
      },
      {
        match: [Page.FARM, new URLSearchParams()],
        callback: async (state, response) => {
          const root = await getDocument(response);
          state.set(processFarmPage(root.body));
        },
      },
      {
        match: [Page.HOME_PATH, new URLSearchParams()],
        callback: async (state, response) => {
          const root = await getDocument(response);
          const linkStatus = root.body.querySelector<HTMLDivElement>(
            "a[href^='xfarm.php'] .item-after"
          );
          if (!linkStatus) {
            return;
          }
          state.set(processFarmStatus(linkStatus));
        },
      },
      {
        match: [Page.WORKER, new URLSearchParams({ go: WorkerGo.FARM_STATUS })],
        callback: async (state, response) => {
          const previous = await state.get();
          const raw = await response.text();
          const rawPlots = raw.split(";");
          if (rawPlots.length < (previous?.count ?? 4)) {
            await state.set({
              ...previous,
              status: CropStatus.EMPTY,
            });
            return;
          }
          let status: CropStatus = CropStatus.EMPTY;
          for (const plot of rawPlots) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [plotId, percent, secondsLeft, secondsSince] =
              plot.split("-");
            const percentReady = Number(percent);
            if (percentReady === 100) {
              status = CropStatus.READY;
              break;
            } else if (percentReady > 0) {
              status = CropStatus.GROWING;
            }
          }
          state.set({ ...previous, status });
        },
      },
      {
        match: [Page.WORKER, new URLSearchParams({ go: WorkerGo.HARVEST_ALL })],
        callback: async (state, response) => {
          const previous = await state.get();
          state.set({ ...previous, status: CropStatus.EMPTY });
          const { drops } = (await response.json()) as {
            result: "success";
            drops: Record<
              Item["id"],
              {
                name: Item["name"];
                img: string;
                qty: number;
              }
            >;
          };
          showPopup({
            title: "Harvested Crops",
            contentHTML: `
              ${Object.values(drops)
                .map(
                  (drop) => `
                    <img
                      src="${drop.img}"
                      style="
                        vertical-align: middle;
                        width: 18px;
                      "
                    >
                    (x${drop.qty})
                  `
                )
                .join("&nbsp;")}
            `,
          });
        },
      },
      {
        match: [Page.WORKER, new URLSearchParams({ go: WorkerGo.PLANT_ALL })],
        callback: async (state) => {
          const previous = await state.get();
          state.set({ ...previous, status: CropStatus.GROWING });
        },
      },
    ],
  }
);

const processFarmId = (root: HTMLElement): number | undefined => {
  const farmIdRaw = root.querySelector("#farm")?.textContent;
  return farmIdRaw ? Number(farmIdRaw) : undefined;
};

export const farmIdState = new CachedState<number>(
  StorageKey.FARM_ID,
  async () => {
    const response = await requestHTML(Page.FARM, new URLSearchParams());
    return processFarmId(response.body);
  },
  {
    timeout: Number.POSITIVE_INFINITY,
    defaultState: -1,
    interceptors: [
      {
        match: [Page.FARM, new URLSearchParams()],
        callback: async (state, response) => {
          const root = await getDocument(response);
          state.set(processFarmId(root.body));
        },
      },
      {
        match: [Page.HOME_PATH, new URLSearchParams()],
        callback: async (state, response) => {
          const root = await getDocument(response);
          const status = root.body.querySelector<HTMLDivElement>(
            "a[href^='xfarm.php'] .item-after span"
          );
          if (!status) {
            return;
          }
          state.set(Number(status.dataset.id));
        },
      },
    ],
  }
);

export const harvestAll = async (): Promise<void> => {
  const farmId = await farmIdState.get();
  await requestJSON(
    Page.WORKER,
    new URLSearchParams({ go: WorkerGo.HARVEST_ALL, id: String(farmId) })
  );
};
