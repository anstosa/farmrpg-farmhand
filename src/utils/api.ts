export const sendRequest = async (
  query: URLSearchParams
): Promise<Document> => {
  const response = await fetch(
    `https://farmrpg.com/worker.php?${query.toString()}`,
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
  const response = await sendRequest(new URLSearchParams({ go: "getstats" }));
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
    new URLSearchParams({ go: "depositsilver", amt: amount.toString() })
  );
};

export const withdrawSilver = async (amount: number): Promise<void> => {
  await sendRequest(
    new URLSearchParams({ go: "withdrawalsilver", amt: amount.toString() })
  );
};
