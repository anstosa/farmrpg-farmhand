import { Page } from "~/utils/page";

interface BaseFeatureSetting {
  id: string;
  title: string;
  description: string;
  dataKey?: string;
  buttonText?: string;
  buttonAction?: (settings: Settings, settingWrapper: HTMLElement) => void;
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

export type LoadHandler = (
  settings: Settings,
  page: Page | undefined,
  parameters: URLSearchParams
) => void;

export interface Feature {
  onInitialize?: (settings: Settings) => void;
  onPageLoad?: LoadHandler;
  onChatLoad?: LoadHandler;
  onMenuLoad?: LoadHandler;
  onQuestLoad?: LoadHandler;
  onNotificationLoad?: LoadHandler;
  settings?: FeatureSetting[];
}
