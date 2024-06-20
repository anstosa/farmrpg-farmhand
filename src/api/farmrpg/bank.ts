import { CachedState, parseUrl, StorageKey } from "../state";
import { getDocument } from "../utils";
import { Page, WorkerGo } from "../../utils/page";
import { sendRequest } from "./api";

export interface Stats {
  silver: number;
  gold: number;
  ancientCoins: number;
}

const processStats = (root: Document): Stats => {
  const parameters = root.querySelectorAll("span");
  const silver = Number(
    parameters[0].textContent?.trim().replaceAll(",", "") ?? "0"
  );
  const gold = Number(
    parameters[1].textContent?.trim().replaceAll(",", "") ?? "0"
  );
  const ancientCoins = Number(
    parameters[2].textContent?.trim().replaceAll(",", "") ?? "0"
  );
  return { silver, gold, ancientCoins };
};

export const statsState = new CachedState<Stats>(
  StorageKey.STATS,
  async () => {
    const response = await sendRequest(
      Page.WORKER,
      new URLSearchParams({ go: WorkerGo.GET_STATS })
    );
    return processStats(response);
  },
  {
    interceptors: [
      {
        match: [Page.WORKER, new URLSearchParams({ go: WorkerGo.GET_STATS })],
        callback: async (state, response) => {
          state.set(processStats(await getDocument(response)));
        },
      },
      {
        match: [
          Page.WORKER,
          new URLSearchParams({ go: WorkerGo.DEPOSIT_SILVER }),
        ],
        callback: async (state, response) => {
          const previous = await state.get();
          const [_, query] = parseUrl(response.url);
          state.set({
            ...previous,
            silver: previous.silver - Number(query.get("amt")),
          });
        },
      },
      {
        match: [
          Page.WORKER,
          new URLSearchParams({ go: WorkerGo.WITHDRAW_SILVER }),
        ],
        callback: async (state, response) => {
          const previous = await state.get();
          const [_, query] = parseUrl(response.url);
          state.set({
            ...previous,
            silver: previous.silver + Number(query.get("amt")),
          });
        },
      },
    ],
  }
);

export const depositSilver = async (amount: number): Promise<void> => {
  const stats = await statsState.get();
  await sendRequest(
    Page.WORKER,
    new URLSearchParams({ go: WorkerGo.DEPOSIT_SILVER, amt: amount.toString() })
  );
  stats.silver -= amount;
  await statsState.set(stats);
};

export const withdrawSilver = async (amount: number): Promise<void> => {
  const stats = await statsState.get();
  await sendRequest(
    Page.WORKER,
    new URLSearchParams({
      go: WorkerGo.WITHDRAW_SILVER,
      amt: amount.toString(),
    })
  );
  stats.silver += amount;
  await statsState.set(stats);
};
