import { Page } from "~/utils/page";
import { Responselike } from "./utils";

export const parseUrl = (url: string): [Page, URLSearchParams] => {
  // https://farmrpg.com/worker.php?cachebuster=271544&go=getchat&room=giveaways
  const truncatedUrl = url.replace("https://farmrpg.com/", "");
  // worker.php?cachebuster=271544&go=getchat&room=giveaways
  const [pageRaw, queryRaw] = truncatedUrl.split("?");
  const page = pageRaw.replace(".php", "") as Page;
  // worker
  const query = new URLSearchParams(queryRaw);
  // cachebuster=271544&go=getchat&room=giveaways
  return [page, query];
};

export const urlMatches = (
  url: string,
  targetPage: Page,
  targetQuery: URLSearchParams
): boolean => {
  const [page, query] = parseUrl(url);
  if (page !== targetPage) {
    return false;
  }
  for (const key of targetQuery.keys()) {
    if (query.get(key) !== targetQuery.get(key)) {
      return false;
    }
  }
  return true;
};

export interface StateQueryOptions {
  ignoreCache?: boolean;
}

export enum StorageKey {
  RECENT_UPDATE = "recentUpdate",
  USERNAME = "username",
  USER_ID = "userId",
  PAGE_DATA = "pageData",
  ITEM_DATA = "itemData",
  LATEST_VERSION = "latestVersion",
  CHAT_BANNERS = "chatBanners",
  STATS = "stats",
  MAILBOX = "mailbox",
  PERKS_SETS = "perkSets",
  CURRENT_PERKS_SET_ID = "currentPerksSetId",
  IS_DARK_MODE = "isDarkMode",
  IS_BETA = "isBeta",
  IS_MUSIC_ENABLED = "isMusicEnabled",
  IS_CHAT_ENABLED = "isChatEnabled",
}

const generateEmptyRootState = (): Record<StorageKey, string> => {
  const rootState = {} as Record<StorageKey, string>;
  for (const [_, value] of Object.entries(StorageKey)) {
    rootState[value] = JSON.stringify(undefined);
  }
  return rootState;
};

const rootState: Record<StorageKey, string> = generateEmptyRootState();

export const queryInterceptors: [CachedState<any>, QueryInterceptor][] = [];

export const watchQueries = (): void => {
  (function (open) {
    XMLHttpRequest.prototype.open = function () {
      this.addEventListener(
        "readystatechange",
        function () {
          if (this.readyState !== 4) {
            return;
          }
          // only check farmrpg URLs
          if (!this.responseURL.startsWith("https://farmrpg.com")) {
            return;
          }
          for (const [state, interceptor] of queryInterceptors) {
            if (urlMatches(this.responseURL, ...interceptor.match)) {
              interceptor.callback(state, {
                headers: new Headers(),
                ok: this.status >= 200 && this.status < 300,
                redirected: false,
                status: this.status,
                statusText: this.statusText,
                type: "default",
                url: this.responseURL,
                text: () => Promise.resolve(this.responseText),
                json: () => Promise.resolve(JSON.parse(this.responseText)),
                formData: () => Promise.resolve(new FormData()),
                arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
                blob: () => Promise.resolve(new Blob([this.responseText])),
              });
            }
          }
        },
        false
      );
      // eslint-disable-next-line prefer-rest-params
      Reflect.apply(open, this, arguments);
    };
  })(XMLHttpRequest.prototype.open);
};

export interface CachedStateOptions<T>
  extends Partial<Omit<CachedState<T>, "key" | "fetch">> {
  interceptors?: QueryInterceptor[];
}

export interface QueryInterceptor {
  match: [Page, URLSearchParams];
  callback: (state: CachedState<any>, response: Responselike) => Promise<void>;
}

export interface CachedStateQueryOptions {
  ignoreCache?: boolean;
}

export class CachedState<T> {
  key: StorageKey;
  defaultState?: T;
  timeout: number; // seconds
  updatedAt: Date;
  fetch: () => Promise<T | undefined>;

  constructor(
    key: StorageKey,
    fetch: CachedState<T>["fetch"],
    {
      defaultState,
      timeout,
      updatedAt,
      interceptors = [],
    }: CachedStateOptions<T> = {}
  ) {
    this.key = key;
    this.defaultState = defaultState;
    this.updatedAt = updatedAt ?? new Date(0);
    this.timeout = timeout ?? 60;
    this.fetch = fetch;

    for (const interceptor of interceptors) {
      queryInterceptors.push([this, interceptor]);
    }

    rootState[this.key] = JSON.stringify(defaultState || undefined);
  }

  async get({ ignoreCache }: CachedStateQueryOptions = {}): Promise<T> {
    if (
      ignoreCache ||
      this.updatedAt.getTime() + this.timeout * 1000 < Date.now()
    ) {
      await this.set(await this.fetch());
    }
    return JSON.parse(rootState[this.key]);
  }

  async set(value: T | undefined): Promise<void> {
    const encoded = JSON.stringify(value);
    await GM.setValue(this.key, encoded);
    this.updatedAt = new Date();
    rootState[this.key] = encoded;
  }

  async load(): Promise<void> {
    rootState[this.key] = await GM.getValue(this.key, "undefined");
  }

  reset(): Promise<void> {
    return this.set(this.defaultState);
  }
}
