import { CachedState, parseUrl, StateQueryOptions, StorageKey } from "../state";
import { getDocument } from "../utils";
import { getListByTitle, Page, WorkerGo } from "../../utils/page";
import { requestHTML } from "./api";

export enum PerkActivity {
  DEFAULT = "Default",
  CRAFTING = "Crafting",
  FISHING = "Fishing",
  EXPLORING = "Exploring",
  SELLING = "Selling",
  FRIENDSHIP = "Friendship",
  TEMPLE = "Temple",
  LOCKSMITH = "Locksmith",
  WHEEL = "Wheel",
  UNKNOWN = "Unknown",
}

export interface PerkSet {
  name: string;
  id: number;
}

export interface PerksState {
  currentPerkSetId?: number;
  perkSets: PerkSet[];
}

const processPerks = (root: Document): PerksState => {
  const perkSets: PerkSet[] = [];
  const setList = getListByTitle("My Perk Sets", root.body);
  const setWrappers = setList?.querySelectorAll(".item-title") ?? [];
  let currentPerkSetId: number | undefined;
  for (const setWrapper of setWrappers) {
    const link = setWrapper.querySelector<HTMLAnchorElement>("a");
    const name = link?.textContent ?? "";
    const id = Number(link?.dataset.id);
    const isActive = setWrapper.querySelector(".fa-check");
    if (isActive) {
      currentPerkSetId = id;
    }
    perkSets.push({ name, id });
  }
  return { perkSets, currentPerkSetId };
};

export const perksState = new CachedState<PerksState>(
  StorageKey.PERKS_SETS,
  async () => {
    const response = await requestHTML(Page.PERKS);
    return processPerks(response);
  },
  {
    timeout: 60 * 60 * 24, // 1 day
    defaultState: {
      perkSets: [],
      currentPerkSetId: undefined,
    },
    interceptors: [
      {
        match: [Page.PERKS, new URLSearchParams()],
        callback: async (state, previous, response) => {
          await state.set(processPerks(await getDocument(response)));
        },
      },
      {
        match: [
          Page.WORKER,
          new URLSearchParams({ go: WorkerGo.ACTIVATE_PERK_SET }),
        ],
        callback: async (state, previous, response) => {
          const [_, query] = parseUrl(response.url);
          await state.set({
            currentPerkSetId: Number(query.get("id")),
          });
        },
      },
    ],
  }
);

export const getActivityPerksSet = async (
  activity: PerkActivity,
  options?: StateQueryOptions
): Promise<PerkSet | undefined> => {
  const state = await perksState.get(options);
  return state?.perkSets.find(({ name }) => name === activity);
};

export const getCurrentPerkSet = async (
  options?: StateQueryOptions
): Promise<PerkSet | undefined> => {
  const state = await perksState.get(options);
  return state?.perkSets.find(({ id }) => id === state?.currentPerkSetId);
};

export const isActivePerkSet = async (
  set: PerkSet,
  options?: StateQueryOptions
): Promise<boolean> => {
  const current = await getCurrentPerkSet(options);
  return Boolean(current && current.id === set.id);
};

export const resetPerks = async (): Promise<void> => {
  const state = await perksState.get();
  await requestHTML(
    Page.WORKER,
    new URLSearchParams({ go: WorkerGo.RESET_PERKS })
  );
  perksState.set({
    perkSets: state?.perkSets ?? [],
    currentPerkSetId: undefined,
  });
};

export const activatePerkSet = async (
  set: PerkSet,
  options?: StateQueryOptions
): Promise<void> => {
  if (await isActivePerkSet(set, options)) {
    return;
  }
  console.debug(`Activating ${set.name} Perks`);
  await resetPerks();
  await requestHTML(
    Page.WORKER,
    new URLSearchParams({
      go: WorkerGo.ACTIVATE_PERK_SET,
      id: set.id.toString(),
    })
  );
};
