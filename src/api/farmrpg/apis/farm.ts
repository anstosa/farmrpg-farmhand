import { CachedState, StorageKey } from "../../../utils/state";
import { getDocument } from "../../../utils/requests";
import { getHTML, getJSON } from "../utils/requests";
import { getPage, Page, WorkerGo } from "~/utils/page";
import { getSettingValues, SettingId } from "~/utils/settings";
import { Item } from "../../buddyfarm/types";
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
  readyAt: number;
}

const processFarmStatus = (root: HTMLElement): FarmStatus | undefined => {
  const statusText = root.textContent;
  if (!statusText) {
    return {
      status: CropStatus.EMPTY,
      count: 0,
      readyAt: Number.POSITIVE_INFINITY,
    };
  }
  // 36 READY!
  const count = Number(statusText.split(" ")[0]);
  let status = CropStatus.EMPTY;
  let readyAt = Number.POSITIVE_INFINITY;
  if (statusText.toLowerCase().includes("growing")) {
    status = CropStatus.GROWING;
    // new sure when ready, check again in a minute
    readyAt = Date.now() + 60 * 1000;
  } else if (statusText.toLowerCase().includes("ready")) {
    status = CropStatus.READY;
    readyAt = Date.now();
  }
  return { status, count, readyAt };
};

const processFarmPage = (root: HTMLElement): FarmStatus | undefined => {
  const plots = root.querySelectorAll<HTMLAnchorElement>(
    "#croparea #crops .col-25"
  );
  const count = plots.length;
  let status = CropStatus.EMPTY;
  let readyAt = Number.POSITIVE_INFINITY;
  for (const plot of plots) {
    const image = plot.querySelector<HTMLImageElement>("img");
    if (image?.style.opacity === "1") {
      status = CropStatus.READY;
      readyAt = Date.now();
    } else if (status === CropStatus.EMPTY) {
      status = CropStatus.GROWING;
      readyAt = Math.min(
        readyAt,
        Date.now() + Number(image?.dataset.seconds ?? "60") * 1000
      );
    }
  }
  return { status, count, readyAt };
};

const scheduledUpdates: Record<number, NodeJS.Timeout> = {};

export const farmStatusState = new CachedState<FarmStatus>(
  StorageKey.FARM_STATUS,
  async () => {
    const response = await getHTML(Page.FARM, new URLSearchParams());
    return processFarmPage(response.body);
  },
  {
    timeout: 5,
    defaultState: {
      status: CropStatus.EMPTY,
      count: 4,
      readyAt: Number.POSITIVE_INFINITY,
    },
    interceptors: [
      {
        match: [Page.WORKER, new URLSearchParams({ go: WorkerGo.READY_COUNT })],
        callback: async (state, previous, response) => {
          const root = await getDocument(response);
          state.set(processFarmStatus(root.body));
        },
      },
      {
        match: [Page.FARM, new URLSearchParams()],
        callback: async (state, previous, response) => {
          const root = await getDocument(response);
          await state.set(processFarmPage(root.body));
        },
      },
      {
        match: [Page.HOME_PATH, new URLSearchParams()],
        callback: async (state, previous, response) => {
          const root = await getDocument(response);
          const linkStatus = root.body.querySelector<HTMLDivElement>(
            "a[href^='xfarm.php'] .item-after"
          );
          if (!linkStatus) {
            return;
          }
          await state.set(processFarmStatus(linkStatus));
        },
      },
      {
        match: [Page.WORKER, new URLSearchParams({ go: WorkerGo.FARM_STATUS })],
        callback: async (state, previous, response) => {
          const raw = await response.text();
          const rawPlots = raw.split(";");
          if (rawPlots.length < (previous?.count ?? 4)) {
            await state.set({ ...previous, status: CropStatus.EMPTY });
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
          await state.set({ ...previous, status });
        },
      },
      {
        match: [Page.WORKER, new URLSearchParams({ go: WorkerGo.HARVEST_ALL })],
        callback: async (state, previous, response) => {
          await state.set({ ...previous, status: CropStatus.EMPTY });
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
          const [page] = getPage();
          const settings = await getSettingValues();
          if (page !== Page.FARM || settings[SettingId.HARVEST_NOTIFICATIONS]) {
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
              actions: [
                {
                  name: "Replant",
                  buttonClass: "btnblue",
                  callback: async () => {
                    const farmId = await farmIdState.get();
                    if (!farmId) {
                      console.error("No farm id found");
                      return;
                    }
                    if (page === Page.FARM) {
                      document
                        .querySelector<HTMLAnchorElement>(".plantallbtn")
                        ?.click();
                    } else {
                      await getHTML(
                        Page.WORKER,
                        new URLSearchParams({
                          go: WorkerGo.PLANT_ALL,
                          id: String(farmId),
                        })
                      );
                    }
                  },
                },
              ],
            });
          }
        },
      },
      {
        match: [Page.WORKER, new URLSearchParams({ go: WorkerGo.PLANT_ALL })],
        callback: async (state, previous) => {
          await state.set({ ...previous, status: CropStatus.GROWING });
        },
      },
    ],
  }
);

const updateStatus = async (): Promise<void> => {
  const state = farmStatusState.read();
  if (!state) {
    return;
  }
  if (state.readyAt < Date.now()) {
    await farmStatusState.set({ ...state, status: CropStatus.READY });
  }
};

// automatically update crops when finished
farmStatusState.onUpdate((state) => {
  if (!state) {
    return;
  }
  if (scheduledUpdates[state.readyAt]) {
    return;
  }
  scheduledUpdates[state.readyAt] = setTimeout(
    updateStatus,
    state.readyAt - Date.now()
  );
});

const processFarmId = (root: HTMLElement): number | undefined => {
  const farmIdRaw = root.querySelector("#farm")?.textContent;
  return farmIdRaw ? Number(farmIdRaw) : undefined;
};

export const farmIdState = new CachedState<number>(
  StorageKey.FARM_ID,
  async () => {
    const response = await getHTML(Page.FARM, new URLSearchParams());
    return processFarmId(response.body);
  },
  {
    timeout: Number.POSITIVE_INFINITY,
    defaultState: -1,
    interceptors: [
      {
        match: [Page.FARM, new URLSearchParams()],
        callback: async (state, previous, response) => {
          const root = await getDocument(response);
          await state.set(processFarmId(root.body));
        },
      },
      {
        match: [Page.HOME_PATH, new URLSearchParams()],
        callback: async (state, previous, response) => {
          const root = await getDocument(response);
          const status = root.body.querySelector<HTMLDivElement>(
            "a[href^='xfarm.php'] .item-after span"
          );
          if (!status) {
            return;
          }
          await state.set(Number(status.dataset.id));
        },
      },
    ],
  }
);

export const harvestAll = async (): Promise<void> => {
  const farmId = await farmIdState.get();
  await getJSON(
    Page.WORKER,
    new URLSearchParams({ go: WorkerGo.HARVEST_ALL, id: String(farmId) })
  );
};
