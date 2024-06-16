import { getListByTitle, Page } from "./page";

interface State {
  currentPerksSet?: PerkSet;
  perkSets?: PerkSet[];
}

const state: State = {};

export const sendRequest = async (
  page: Page,
  query?: URLSearchParams
): Promise<Document> => {
  const response = await fetch(
    `https://farmrpg.com/${page}.php?${query ? query.toString() : ""}`,
    {
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const htmlString = await response.text();
  return new DOMParser().parseFromString(htmlString, "text/html");
};

export interface Stats {
  silver: number;
  gold: number;
  ancientCoins: number;
}

export const getStats = async (): Promise<Stats> => {
  const response = await sendRequest(
    Page.WORKER,
    new URLSearchParams({ go: "getstats" })
  );
  const parameters = response.querySelectorAll("span");
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

export const depositSilver = async (amount: number): Promise<void> => {
  await sendRequest(
    Page.WORKER,
    new URLSearchParams({ go: "depositsilver", amt: amount.toString() })
  );
};

export const withdrawSilver = async (amount: number): Promise<void> => {
  await sendRequest(
    Page.WORKER,
    new URLSearchParams({ go: "withdrawalsilver", amt: amount.toString() })
  );
};

export const getMailboxCount = async (): Promise<number> => {
  const response = await sendRequest(
    Page.WORKER,
    new URLSearchParams({ go: "mbcount" })
  );
  return Number(response.body.textContent);
};

interface MailboxContents {
  from: string;
  item: string;
  count: number;
}

export const getMailboxContents = async (): Promise<MailboxContents[]> => {
  const response = await sendRequest(Page.POST_OFFICE);
  const mailboxList = getListByTitle("Your Mailbox", response.body);
  const itemWrappers = mailboxList?.querySelectorAll(".collectbtnnc") ?? [];
  const mailboxContents: MailboxContents[] = [];
  for (const itemWrapper of itemWrappers) {
    const from = itemWrapper.querySelector("span")?.textContent ?? "";
    const item = itemWrapper.querySelector("b")?.textContent ?? "";
    const count = Number(
      itemWrapper.querySelector("font")?.textContent?.replaceAll(",", "") ?? "0"
    );
    mailboxContents.push({ from, item, count });
  }
  return mailboxContents;
};

export const collectMailbox = async (): Promise<void> => {
  await sendRequest(
    Page.WORKER,
    new URLSearchParams({ go: "collectallmailitems" })
  );
};

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

export const getPerkSets = async (): Promise<PerkSet[]> => {
  if (state.perkSets) {
    return state.perkSets;
  }
  const response = await sendRequest(Page.PERKS);
  const setList = getListByTitle("My Perk Sets", response.body);
  const setWrappers = setList?.querySelectorAll(".item-title") ?? [];
  const sets: PerkSet[] = [];
  for (const setWrapper of setWrappers) {
    const link = setWrapper.querySelector<HTMLAnchorElement>("a");
    const name = link?.textContent ?? "";
    const id = Number(link?.dataset.id);
    sets.push({ name, id });
  }
  // eslint-disable-next-line require-atomic-updates
  state.perkSets = sets;
  return sets;
};

export const getActivityPerksSet = async (
  activity: PerkActivity
): Promise<PerkSet | undefined> => {
  const sets = await getPerkSets();
  return sets.find((set) => set.name === activity);
};

export const getCurrentPerkSet = (): PerkSet | undefined =>
  state.currentPerksSet;

export const isActivePerkSet = (set: PerkSet): boolean =>
  getCurrentPerkSet()?.id === set.id;

export const resetPerks = async (): Promise<void> => {
  await sendRequest(Page.WORKER, new URLSearchParams({ go: "resetperks" }));
};

export const activatePerkSet = async (set: PerkSet): Promise<void> => {
  if (isActivePerkSet(set)) {
    return;
  }
  console.debug(`Activating ${set.name} Perks`);
  state.currentPerksSet = set;
  await resetPerks();
  await sendRequest(
    Page.WORKER,
    new URLSearchParams({ go: "activateperkset", id: set.id.toString() })
  );
  // eslint-disable-next-line require-atomic-updates
};
