import { Page } from "~/utils/page";
import { SettingId } from "./settings";

interface BaseFeatureSetting {
  id: SettingId;
  title: string;
  description: string;
  buttonText?: string;
  buttonAction?: (settings: SettingValues, settingWrapper: HTMLElement) => void;
  data?: any;
}

export interface BooleanFeatureSetting extends BaseFeatureSetting {
  type: "boolean";
  defaultValue: boolean;
  value?: boolean;
}

export interface NumberFeatureSetting extends BaseFeatureSetting {
  type: "number";
  placeholder?: string;
  defaultValue: number;
  value?: number;
}

export interface StringFeatureSetting extends BaseFeatureSetting {
  type: "string";
  placeholder?: string;
  defaultValue: string;
  value?: string;
}

export type FeatureSetting =
  | BooleanFeatureSetting
  | NumberFeatureSetting
  | StringFeatureSetting;

export type Settings = Record<BaseFeatureSetting["id"], FeatureSetting>;
export type SettingValues = Partial<
  Record<BaseFeatureSetting["id"], FeatureSetting["value"]>
>;

export type LoadHandler = (
  settings: SettingValues,
  page: Page | undefined,
  parameters: URLSearchParams
) => void;

export interface Feature {
  onInitialize?: (settings: SettingValues) => void;
  onPageLoad?: LoadHandler;
  onChatLoad?: LoadHandler;
  onMenuLoad?: LoadHandler;
  onQuestLoad?: LoadHandler;
  onNotificationLoad?: LoadHandler;
  settings?: FeatureSetting[];
}
