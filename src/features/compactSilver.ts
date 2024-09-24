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
    for (const silver of document.querySelectorAll<HTMLDivElement>(
      "#statszone span:first-child"
    )) {
      if (!silver || silver.dataset.compactSilver) {
        continue;
      }
      const icon = silver.querySelector("img");
      const amount = Number(
        icon?.nextSibling?.textContent?.trim().replaceAll(",", "")
      );
      if (Number.isNaN(amount)) {
        continue;
      }
      if (amount < 1_000_000) {
        continue;
      }
      icon?.nextSibling?.replaceWith(
        amount > 1_000_000_000
          ? // eslint-disable-next-line no-irregular-whitespace
            ` ${(amount / 1_000_000_000).toFixed(1)}B  `
          : // eslint-disable-next-line no-irregular-whitespace
            ` ${(amount / 1_000_000).toFixed(1)}M  `
      );
      silver.dataset.compactSilver = "true";
    }
  },
};
