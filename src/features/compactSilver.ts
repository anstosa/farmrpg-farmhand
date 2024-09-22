import { Feature, FeatureSetting } from "./feature";

export const SETTING_COMPACT_SILVER: FeatureSetting = {
  id: "compactSilver",
  title: "Wallet: Compact silver",
  description: "Display compact numbers for silver over 1M",
  type: "boolean",
  defaultValue: true,
};

export const compactSilver: Feature = {
  onQuestLoad: () => {
    const silver = document.querySelector<HTMLDivElement>(
      "#statszone span:first-child"
    );
    if (!silver || !silver.textContent || silver.dataset.compactSilver) {
      return;
    }
    const amount = Number(silver.textContent?.trim().replaceAll(",", ""));
    if (Number.isNaN(amount)) {
      return;
    }
    if (amount < 1_000_000) {
      return;
    }
    const icon = silver.querySelector("img");
    silver.innerHTML =
      amount > 1_000_000_000
        ? `&nbsp;${(amount / 1_000_000_000).toFixed(1)}B&nbsp;&nbsp;`
        : `&nbsp;${(amount / 1_000_000).toFixed(1)}M&nbsp;&nbsp;`;
    silver.insertBefore(icon as Node, silver.firstChild);
    silver.dataset.compactSilver = "true";
  },
};
