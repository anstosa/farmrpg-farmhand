import { getListByTitle, Page } from "./page";

export const sendRequest = async (
  page: Page,
  query?: URLSearchParams
): Promise<Document> => {
  const response = await fetch(
    `https://farmrpg.com/worker.php?${query?.toString()}`,
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
