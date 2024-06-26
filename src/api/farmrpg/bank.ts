import { CachedState, parseUrl, StorageKey } from "../state";
import { getDocument } from "../utils";
import { Page, WorkerGo } from "../../utils/page";
import { requestHTML } from "./api";

export interface Stats {
  silver: number;
  gold: number;
  ancientCoins: number;
}

const processStats = (root: Document): Stats => {
  const matches = root.body.textContent?.match(
    /[^\d,]+([\d,]+)[^\d,]+([\d,]+)[^\d,]+([\d,]+)/
  );
  if (!matches || matches.length < 4) {
    return { silver: 0, gold: 0, ancientCoins: 0 };
  }
  const [_, silverMatch, goldMatch, ancientCoinsMatch] = matches;
  const silver = Number(silverMatch.replaceAll(",", ""));
  const gold = Number(goldMatch.replaceAll(",", ""));
  const ancientCoins = Number(ancientCoinsMatch.replaceAll(",", ""));
  return { silver, gold, ancientCoins };
};

export const statsState = new CachedState<Stats>(
  StorageKey.STATS,
  async () => {
    const response = await requestHTML(
      Page.WORKER,
      new URLSearchParams({ go: WorkerGo.GET_STATS })
    );
    return processStats(response);
  },
  {
    interceptors: [
      {
        match: [Page.WORKER, new URLSearchParams({ go: WorkerGo.GET_STATS })],
        callback: async (state, previous, response) => {
          state.set(processStats(await getDocument(response)));
        },
      },
      {
        match: [
          Page.WORKER,
          new URLSearchParams({ go: WorkerGo.DEPOSIT_SILVER }),
        ],
        callback: async (state, previous, response) => {
          const [_, query] = parseUrl(response.url);
          if (!previous) {
            return;
          }
          await state.set({
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
        callback: async (state, previous, response) => {
          const [_, query] = parseUrl(response.url);
          if (!previous) {
            return;
          }
          await state.set({
            ...previous,
            silver: previous.silver + Number(query.get("amt")),
          });
        },
      },
    ],
    defaultState: {
      silver: 0,
      gold: 0,
      ancientCoins: 0,
    },
  }
);

export const depositSilver = async (amount: number): Promise<void> => {
  await requestHTML(
    Page.WORKER,
    new URLSearchParams({ go: WorkerGo.DEPOSIT_SILVER, amt: amount.toString() })
  );
};

export const withdrawSilver = async (amount: number): Promise<void> => {
  await requestHTML(
    Page.WORKER,
    new URLSearchParams({
      go: WorkerGo.WITHDRAW_SILVER,
      amt: amount.toString(),
    })
  );
};
