import { CachedState, StorageKey } from "../../../utils/state";
import {
  getData,
  getSettings,
  registerExportToNotes,
  setData,
  setSetting,
} from "~/utils/settings";
import { getDocument } from "../../../utils/requests";
import { getHTML, postData } from "../utils/requests";
import { Page, WorkerGo } from "../../../utils/page";
import { showPopup } from "~/utils/popup";

export const FARMHAND_PREFIX = "\n==== START FARMHAND SETTINGS ====\n";
export const FARMHAND_SUFFIX = "\n==== END FARMHAND SETTINGS ====";

export const eraseData = (notes: string): string => {
  const start = notes.indexOf(FARMHAND_PREFIX);
  const end = notes.indexOf(FARMHAND_SUFFIX);
  if (start === -1 || end === -1) {
    return notes;
  }
  return notes.slice(0, start) + notes.slice(end + FARMHAND_SUFFIX.length);
};

export const encodeData = async (): Promise<string> => {
  const exportedSettings = Object.values(getSettings());
  for (const setting of exportedSettings) {
    setting.data = await getData(setting, "");
  }
  return `${FARMHAND_PREFIX}${JSON.stringify(
    exportedSettings
  )}${FARMHAND_SUFFIX}`;
};

export interface NotesState {
  notes: string;
  hasNotes: boolean;
}

const processHome = async (root: Document): Promise<NotesState> => {
  const notesField = root.querySelector<HTMLTextAreaElement>(".player_notes");
  if (!notesField) {
    return { notes: "", hasNotes: false };
  }
  const rawNotes = notesField.value;
  const start = rawNotes.indexOf(FARMHAND_PREFIX);
  const end = rawNotes.indexOf(FARMHAND_SUFFIX);
  if (start === -1 || end === -1) {
    console.debug(`[SYNC] No settings found in notes`);
    return { notes: rawNotes, hasNotes: false };
  }
  const settingsString = rawNotes.slice(start + FARMHAND_PREFIX.length, end);
  const settings = JSON.parse(settingsString);
  let hasChanged = false;
  for (const setting of settings) {
    const settingChanged = await setSetting(setting);
    const dataChanged = await setData(setting, setting.data);
    if (!hasChanged && (settingChanged || dataChanged)) {
      hasChanged = true;
    }
  }
  console.debug(`[SYNC] Imported settings from notes`, settings);
  if (hasChanged) {
    await showPopup({
      title: "Farmhand Settings Synced!",
      contentHTML: "Page will reload to apply",
    });
    location.reload();
  }
  return { notes: eraseData(rawNotes), hasNotes: true };
};

export const notesState = new CachedState<NotesState>(
  StorageKey.NOTES,
  async () => {
    const response = await getHTML(Page.HOME_PATH);
    return processHome(response);
  },
  {
    interceptors: [
      {
        match: [Page.HOME_PATH, new URLSearchParams()],
        callback: async (state, previous, response) => {
          state.set(await processHome(await getDocument(response)));
        },
      },
    ],
    defaultState: {
      notes: "",
      hasNotes: false,
    },
  }
);

export const setNotes = async (notes: string): Promise<void> => {
  await postData(
    Page.WORKER,
    {
      content: `${eraseData(notes)}${await encodeData()}`,
    },
    new URLSearchParams({ go: WorkerGo.NOTES })
  );
};

export const exportToNotes = async (): Promise<void> => {
  const state = await notesState.get();
  if (!state) {
    console.error("Sync failed");
    return;
  }
  if (!state.hasNotes) {
    console.warn(`[SYNC] Notes disabled or not available, skipping sync`);
    return;
  }
  await setNotes(state.notes);
  console.debug(`[SYNC] Exported settings to notes`);
};
registerExportToNotes(exportToNotes);
