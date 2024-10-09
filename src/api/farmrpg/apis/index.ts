import { CachedState, StorageKey } from "~/utils/state";

export const usernameState = new CachedState<string>(
  StorageKey.USERNAME,
  () =>
    Promise.resolve(
      document.querySelector("#logged_in_username")?.textContent || undefined
    ),
  {
    timeout: Number.POSITIVE_INFINITY, // never expire
    persist: false,
    defaultState: "",
  }
);

export const userIdState = new CachedState<number>(
  StorageKey.USERNAME,
  () => {
    const userIdRaw = document.querySelector("#logged_in_userid")?.textContent;
    return Promise.resolve(userIdRaw ? Number(userIdRaw) : undefined);
  },
  {
    timeout: Number.POSITIVE_INFINITY, // never expire
    persist: false,
    defaultState: -1,
  }
);

export const betaState = new CachedState<boolean>(
  StorageKey.IS_BETA,
  () =>
    Promise.resolve(document.querySelector("#is_beta")?.textContent === "1"),
  {
    timeout: Number.POSITIVE_INFINITY, // never expire
    persist: false,
    defaultState: false,
  }
);

export const darkModeState = new CachedState<boolean>(
  StorageKey.IS_DARK_MODE,
  () =>
    Promise.resolve(document.querySelector("#dark_mode")?.textContent === "1"),
  {
    timeout: Number.POSITIVE_INFINITY, // never expire
    persist: false,
    defaultState: false,
  }
);

export const musicState = new CachedState<boolean>(
  StorageKey.IS_MUSIC_ENABLED,
  () =>
    Promise.resolve(document.querySelector("#dark_mode")?.textContent === "1"),
  {
    timeout: Number.POSITIVE_INFINITY, // never expire
    persist: false,
    defaultState: true,
  }
);

export const chatState = new CachedState<boolean>(
  StorageKey.IS_CHAT_ENABLED,
  () => Promise.resolve(document.querySelector("#chat")?.textContent === "1"),
  {
    timeout: Number.POSITIVE_INFINITY, // never expire
    persist: false,
    defaultState: true,
  }
);
