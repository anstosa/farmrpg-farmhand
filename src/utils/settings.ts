import { FeatureSetting, SettingValues } from "~/utils/feature";

export enum SettingId {
  ATTENTION_NOTIFICATIONS = "attentionNotifications",
  ATTENTION_NOTIFICATIONS_VERBOSE = "attentionNotificationsVerbose",
  AUTOCOMPLETE_ITEMS = "autocompleteItems",
  AUTOCOMPLETE_USERS = "autocompleteUsers",
  BANKER = "banker",
  BUDDY_FARM = "buddyFarm",
  CHAT_COMPRESS = "compressChat",
  CHAT_DISMISSABLE_BANNERS = "dismissableChatBanners",
  CHAT_HIGHLIGHT_SELF = "highlightSelfInChat",
  CHAT_MAILBOX_STATS = "chatMailboxStats",
  COLLAPSE_ITEM = "collapseItem",
  COMPACT_SILVER = "compactSilver",
  EXPLORE_FIRST = "exploreFirst",
  EXPLORE_IMPROVED = "exploreImproved",
  EXPORT = "export",
  FIELD_EMPTY_NOTIFICATIONS = "fieldEmptyNotifications",
  FISH_IN_BARREL = "fishInBarrel",
  FLEA_MARKET = "fleaMarket",
  HARVEST_NOTIFICATIONS = "harvestNotifications",
  HARVEST_POPUP = "harvestPopup",
  HOME_COMPRESS_SKILLS = "homeCompressSkills",
  HOME_HIDE_FOOTER = "homeHideFooter",
  HOME_HIDE_PLAYERS = "homeHidePlayers",
  HOME_HIDE_THEME = "homeHideTheme",
  IMPORT = "import",
  IMPROVED_INPUTS = "improvedInputs",
  KITCHEN_COMPLETE_NOTIFICATIONS = "readyNotifications",
  KITCHEN_EMPTY_NOTIFICATIONS = "kitchenEmptyNotifications",
  MAX_ANIMALS = "maxAnimals",
  MAX_CONTAINERS = "maxContainers",
  MEAL_NOTIFICATIONS = "mealNotifications",
  MINER = "miner",
  MINER_BOMBS = "minerBombs",
  MINER_EXPLOSIVES = "minerExplosives",
  NAV_ADD_MENU = "bottomMenu",
  NAV_ALIGN_BOTTOM = "alignBottomNav",
  NAV_COMPRESS = "compressNav",
  NAV_CUSTOM = "customNav",
  NAV_HIDE_LOGO = "noLogoNav",
  PERK_MANAGER = "perkManager",
  QUEST_COLLAPSE = "questCollapse",
  QUEST_TAGGING = "questTagging",
  QUICKSELL_SAFELY = "quicksellSafely",
  UPDATE_AT_TOP = "updateAtTop",
  VAULT_SOLVER = "vaultSolver",
}

const settings: FeatureSetting[] = [];

export const registerSettings = (...newSettings: FeatureSetting[]): void => {
  settings.push(...newSettings);
};

export const getSettings = (): FeatureSetting[] => settings;

export const getDefaultSettings = (): SettingValues => {
  const settings: SettingValues = {};
  for (const setting of getSettings()) {
    settings[setting.id] = setting?.value ?? setting.defaultValue;
  }
  return settings;
};

export const getSettingValues = async (): Promise<SettingValues> => {
  const settings: SettingValues = {};
  for (const setting of getSettings()) {
    settings[setting.id] = await GM.getValue(setting.id, setting.defaultValue);
  }
  return settings;
};

const toDataKey = (setting: FeatureSetting | string): string =>
  typeof setting === "string" ? `${setting}_data` : `${setting.id}_data`;

export const getData = async <T>(
  setting: FeatureSetting | string,
  defaultValue: T
): Promise<T> => {
  const key = toDataKey(setting);
  if (!key) {
    return defaultValue;
  }
  const value = await GM.getValue<T>(key, defaultValue);
  if (typeof value !== "object") {
    return defaultValue;
  }
  return value;
};

export const setData = async <T>(
  setting: FeatureSetting | string,
  data: T
): Promise<boolean> => {
  const key = toDataKey(setting);
  if (!key) {
    return false;
  }
  if (typeof data !== "object") {
    return false;
  }
  const previous = await GM.getValue<T>(key, null as any);
  await GM.setValue(key, data as any);
  const changed = JSON.stringify(previous) !== JSON.stringify(data);
  if (changed) {
    await exportToNotes();
  }
  return changed;
};

export const getSetting = async (
  setting: FeatureSetting
): Promise<FeatureSetting> =>
  ({
    ...setting,
    value: await GM.getValue(setting.id, setting.defaultValue),
  } as FeatureSetting);

export const setSetting = async (setting: FeatureSetting): Promise<boolean> => {
  const previous = await GM.getValue(setting.id, setting.defaultValue);
  const value = setting.value ?? setting.defaultValue;
  await GM.setValue(setting.id, value);
  const changed = previous !== value;
  if (changed) {
    await exportToNotes();
  }
  return changed;
};

// hack to avoid circular dependency
let _exportToNotes: () => Promise<void> | undefined;
export const registerExportToNotes = (
  exporter: typeof _exportToNotes
): void => {
  _exportToNotes = exporter;
};
const exportToNotes = (): Promise<void> =>
  _exportToNotes?.() ?? Promise.resolve();
