import { isObject } from "~/utils/object";
import { Page } from "~/utils/page";
import { registerQueryInterceptor } from "~/api/farmrpg/utils/requests";
import { Responselike } from "./requests";

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
  ITEM_DATA = "items",
  KITHCEN_STATUS = "kitchenStatus",
  LATEST_VERSION = "latestVersion",
  MAILBOX = "mailbox",
  MEALS_STATUS = "mealsStatus",
  NOTES = "notes",
  PAGE_DATA = "pageData",
  PERKS_SETS = "perkSets",
  PETS = "pets",
  PLAYER_MAILBOXES = "playerMailboxes",
  PLAYERS = "players",
  RECENT_UPDATE = "recentUpdate",
  STATS = "stats",
  USERNAME = "username",
  USER_ID = "userId",
}

type Query = string | void;
const QUERYLESS_KEY = "__QUERYLESS__";

const toQueryKey = (query: Query): string => query ?? QUERYLESS_KEY;

export interface CachedStateOptions<T, Q extends Query>
  extends Partial<Omit<CachedState<T, Q>, "key" | "fetch">> {
  defaultState?: T;
  interceptors?: QueryInterceptor<T, Q>[];
}

export interface QueryInterceptor<T, Q extends Query> {
  match: [Page, URLSearchParams];
  callback: (
    state: CachedState<T, Q>,
    previous: T,
    response: Responselike
  ) => Promise<void>;
}

export interface CachedStateQueryOptions<Q> {
  ignoreCache?: boolean;
  doNotFetch?: boolean;
  query?: Q;
  lazy?: boolean;
}

type UpdateListener<T> = (value: T | undefined) => void;

export interface State<T> {
  [query: string]: T;
}

const lazyQueue: Array<() => Promise<any>> = [];
let isProcessingQueue = false;

setInterval(async () => {
  if (isProcessingQueue) {
    return;
  }
  isProcessingQueue = true;
  while (lazyQueue.length > 0) {
    const task = lazyQueue.shift();
    if (task) {
      await task();
    }
  }
  // eslint-disable-next-line require-atomic-updates
  isProcessingQueue = false;
}, 1000);

export class CachedState<T, Q extends Query = void> {
  defaultState: T | undefined;
  gettingByQuery: Record<string, Promise<T | undefined>>;
  key: string;
  persist: boolean;
  state = {} as State<T>;
  timeout: number; // seconds
  updateListeners: UpdateListener<T>[];
  updatedAtByQuery: Record<string, number>;
  fetch: (
    state: CachedState<T, Q>,
    query: Q | undefined
  ) => Promise<T | undefined>;

  constructor(
    key: StorageKey,
    fetch: CachedState<T, Q>["fetch"],
    {
      defaultState,
      timeout,
      interceptors = [],
      persist = true,
    }: CachedStateOptions<T, Q>
  ) {
    this.defaultState = defaultState;
    this.fetch = fetch;
    this.gettingByQuery = {};
    this.key = `state_${key}`;
    this.persist = persist;
    this.state = {};
    this.timeout = timeout ?? 60;
    this.updateListeners = [];
    this.updatedAtByQuery = {};

    for (const interceptor of interceptors) {
      registerQueryInterceptor([this, interceptor]);
    }

    this.load();
  }

  onUpdate(callback: UpdateListener<T>): void {
    this.updateListeners.push(callback);
  }

  read(query: Q | undefined): T | undefined {
    return this.state[toQueryKey(query)];
  }

  async get({
    ignoreCache,
    doNotFetch,
    query,
    lazy,
  }: CachedStateQueryOptions<Q> = {}): Promise<T | undefined> {
    const queryKey = toQueryKey(query);
    const existingPromise = this.gettingByQuery[queryKey];
    if (existingPromise) {
      console.debug(`[STATE] Waiting for ${this.key} fetch`, existingPromise);
      return await existingPromise;
    }
    const newPromise = new Promise<T | undefined>((resolve) => {
      const queryKey = toQueryKey(query);
      const previous = this.read(query);
      const expires = this.updatedAtByQuery[queryKey] + this.timeout * 1000;
      if (!doNotFetch && (!previous || ignoreCache || expires < Date.now())) {
        if (lazy) {
          resolve(previous);
          lazyQueue.push(() =>
            this.fetch(this, query).then((result) => this.set(result, query))
          );
          return;
        }
        console.debug(`[STATE] Fetching ${this.key} (query: ${queryKey})`, {
          ignoreCache,
          updatedAt: this.updatedAtByQuery[queryKey],
          timeout: this.timeout,
          previous,
        });
        this.fetch(this, query).then((result) =>
          resolve(this.set(result, query))
        );
      } else {
        console.debug(
          `[STATE] Returning cached ${this.key} (query: ${queryKey})`,
          {
            ignoreCache,
            updatedAt: this.updatedAtByQuery[queryKey],
            timeout: this.timeout,
            previous,
          }
        );
        resolve(this.read(query));
      }
    });
    this.gettingByQuery[queryKey] = newPromise;
    const result = await newPromise;
    delete this.gettingByQuery[queryKey];
    return result;
  }

  async set(
    input: T | undefined,
    query?: Q | undefined
  ): Promise<T | undefined> {
    const queryKey = toQueryKey(query);
    const previous = this.state[queryKey];
    const value = isObject(this.defaultState)
      ? { ...this.defaultState, ...previous, ...input }
      : input ?? previous ?? this.defaultState;
    if (!value) {
      delete this.state[queryKey];
      console.debug(
        `[STATE] Deleting ${this.key}.${queryKey}`,
        undefined,
        this.state
      );
      return;
    }
    console.debug(`[STATE] Setting ${this.key}.${queryKey}`, value, this.state);
    this.state[queryKey] = value;
    this.updatedAtByQuery[queryKey] = value === undefined ? 0 : Date.now();
    for (const listener of this.updateListeners) {
      listener(value);
    }
    await this.save();
    return value;
  }

  async save(): Promise<void> {
    if (!this.persist) {
      return;
    }
    await GM.setValue(this.key, [this.updatedAtByQuery, this.state] as any);
  }

  // reads the persisted tuples out of GM storage
  // [updatedAtByQuery, state]
  async load(): Promise<void> {
    if (!this.persist) {
      return;
    }

    const [updatedAtByQuery, state] = await GM.getValue<
      [(typeof this)["updatedAtByQuery"], State<T>]
    >(this.key, [{}, {}]);
    this.updatedAtByQuery = updatedAtByQuery;
    this.state = state;
  }
}
