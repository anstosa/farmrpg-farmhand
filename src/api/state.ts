import { isObject } from "~/utils/object";
import { Page } from "~/utils/page";
import { Responselike } from "./utils";

type InterceptableResponse = Response & { hasBeenIntercepted?: boolean };

declare let fetchWorker: (
  action: string,
  parameters: Record<string, string | number | boolean>
) => Promise<InterceptableResponse>;

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

export const toUrl = (page: Page, query?: URLSearchParams): string => {
  query = query ?? new URLSearchParams();
  query.set("cachebuster", Date.now().toString());
  return `https://farmrpg.com/${page}.php?${query.toString()}`;
};

export interface StateQueryOptions {
  ignoreCache?: boolean;
}

export enum StorageKey {
  CHAT_BANNERS = "chatBanners",
  CURRENT_PERKS_SET_ID = "currentPerksSetId",
  FARM_ID = "farmId",
  FARM_STATE = "farmState",
  FARM_STATUS = "farmStatus",
  IS_BETA = "isBeta",
  IS_CHAT_ENABLED = "isChatEnabled",
  IS_DARK_MODE = "isDarkMode",
  IS_MUSIC_ENABLED = "isMusicEnabled",
  ITEM_DATA = "itemData",
  KITHCEN_STATUS = "kitchenStatus",
  LATEST_VERSION = "latestVersion",
  MAILBOX = "mailbox",
  MEALS_STATUS = "mealsStatus",
  PAGE_DATA = "pageData",
  PERKS_SETS = "perkSets",
  RECENT_UPDATE = "recentUpdate",
  STATS = "stats",
  USERNAME = "username",
  USER_ID = "userId",
}

const generateEmptyRootState = (): typeof rootState => {
  const state = {} as typeof rootState;
  for (const [_, value] of Object.entries(StorageKey)) {
    state[value] = JSON.stringify(undefined);
  }
  return state;
};

const rootState: Record<StorageKey, string | undefined> =
  generateEmptyRootState();

export const queryInterceptors: [CachedState<any>, QueryInterceptor<any>][] =
  [];

export const onFetchResponse = (response: Response): void => {
  // only check farmrpg URLs
  if (!response.url.startsWith("https://farmrpg.com")) {
    return;
  }

  for (const [state, interceptor] of queryInterceptors) {
    if (urlMatches(response.url, ...interceptor.match)) {
      console.debug(`[STATE] fetch intercepted ${response.url}`, interceptor);
      interceptor.callback(state, response.clone());
    }
  }
};

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
              console.debug(
                `[STATE] XMLHttpRequest intercepted ${this.responseURL}`,
                interceptor
              );
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

  const originalFetch = window.fetch as (
    input: URL | RequestInfo,
    init?: RequestInit | undefined
  ) => Promise<InterceptableResponse>;
  window.fetch = async (
    input: URL | RequestInfo,
    init?: RequestInit | undefined
  ) => {
    const response = await originalFetch(input, init);
    if (response.hasBeenIntercepted) {
      response.hasBeenIntercepted = true;
      onFetchResponse(response);
    }
    return response;
  };

  const originalFetchWorker = fetchWorker;
  fetchWorker = async (action, parameters) => {
    const response = await originalFetchWorker(action, parameters);
    if (response.hasBeenIntercepted) {
      response.hasBeenIntercepted = true;
      onFetchResponse(response);
    }
    return response;
  };
};

export interface CachedStateOptions<T>
  extends Partial<Omit<CachedState<T>, "key" | "fetch">> {
  defaultState: T;
  interceptors?: QueryInterceptor<T>[];
}

export interface QueryInterceptor<T> {
  match: [Page, URLSearchParams];
  callback: (state: CachedState<T>, response: Responselike) => Promise<void>;
}

export interface CachedStateQueryOptions {
  ignoreCache?: boolean;
}

export class CachedState<T> {
  key: StorageKey;
  defaultState: T;
  timeout: number; // seconds
  updatedAt: Date;
  fetch: () => Promise<T | undefined>;
  getting: Promise<T | undefined> | undefined;
  updateListeners: ((value: T | undefined) => void)[];
  persist: boolean;

  constructor(
    key: StorageKey,
    fetch: CachedState<T>["fetch"],
    {
      defaultState,
      timeout,
      updatedAt,
      interceptors = [],
      persist = true,
    }: CachedStateOptions<T>
  ) {
    this.key = key;
    this.defaultState = defaultState;
    this.updatedAt = updatedAt ?? new Date(0);
    this.timeout = timeout ?? 60;
    this.fetch = fetch;
    this.updateListeners = [];
    this.persist = persist;

    for (const interceptor of interceptors) {
      queryInterceptors.push([this, interceptor]);
    }

    rootState[this.key] = JSON.stringify(defaultState || undefined);
    this.load();
  }

  onUpdate(callback: () => void): void {
    this.updateListeners.push(callback);
  }

  async get({ ignoreCache }: CachedStateQueryOptions = {}): Promise<
    T | undefined
  > {
    if (this.getting) {
      console.debug(`[STATE] Waiting for ${this.key} fetch`, this.getting);
      return await this.getting;
    }
    this.getting = new Promise<T | undefined>((resolve) => {
      if (
        !rootState[this.key] ||
        ignoreCache ||
        this.updatedAt.getTime() + this.timeout * 1000 < Date.now()
      ) {
        console.debug(`[STATE] Fetching ${this.key}`, {
          ignoreCache,
          updatedAt: this.updatedAt,
          timeout: this.timeout,
          previous: rootState[this.key],
        });
        this.fetch().then((result) => {
          this.set(result);
          resolve(result);
        });
      } else {
        // console.debug(`[STATE] Returning cached ${this.key}`, {
        //   ignoreCache,
        //   updatedAt: this.updatedAt,
        //   timeout: this.timeout,
        //   previous: rootState[this.key],
        // });
        const raw = rootState[this.key];
        resolve(raw ? JSON.parse(raw) : undefined);
      }
    });
    const result = await this.getting;
    this.getting = undefined;
    return result;
  }

  async set(input: Partial<T> | undefined): Promise<void> {
    const value: T = isObject(this.defaultState)
      ? { ...this.defaultState, ...input }
      : ((input ?? this.defaultState) as T);
    console.debug(`[STATE] Setting ${this.key}`, value);
    const encoded = JSON.stringify(value);
    this.updatedAt = value === undefined ? new Date(0) : new Date();
    rootState[this.key] = encoded;
    for (const listener of this.updateListeners) {
      listener(value);
    }
    if (this.persist) {
      await GM.setValue(
        this.key,
        JSON.stringify([this.updatedAt.getTime(), encoded])
      );
    }
  }

  async load(): Promise<void> {
    if (!this.persist) {
      return;
    }

    const raw = (await GM.getValue(this.key)) as string;
    if (!raw) {
      return;
    }

    const result = JSON.parse(raw);
    if (
      !Array.isArray(result) ||
      result.length !== 2 ||
      typeof result[0] !== "number" ||
      typeof result[1] !== "string"
    ) {
      await this.set(this.defaultState);
      return;
    }
    const [timestamp, encoded] = result;
    this.updatedAt = new Date(timestamp);
    rootState[this.key] = encoded;
  }

  reset(): Promise<void> {
    return this.set(this.defaultState);
  }
}
