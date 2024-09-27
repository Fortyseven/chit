import { Writable, writable } from 'svelte/store';

export const DEFAULT_OL_ENDPOINT = 'http://localhost:11434';

export const models = writable([]);
export const chatTimeline = writable([]);
export const responseInProgress_AbortController: Writable<AbortController | null> =
    writable(null);
export const inputText = writable('');
export const errorMessage = writable('');
export const defaultModelName = writable(undefined);

export const contentEl = writable(null);

export const isBeingEditedIndex = writable(undefined); // index of the chat item being edited, if any

type AppStateUI = {
    selectedTab: string;
    constrainChatWidth: boolean;
    lock_model: boolean;
    lock_system: boolean;
    lock_values: boolean;
    play_sounds: boolean;
    popout_variables: boolean;
};

export type AppState = {
    ui: AppStateUI;
    apiEndpoint: string;
    savedSystemPrompts: string[];
};

/* FIXME: This is absurd having this AND the same-named store in
  stores_ui. This needs to be fixed ASAP. */
export const appState: Writable<AppState> = writable({
    ui: {
        // autoImportDefaults: true,
        selectedTab: 'presets',
        constrainChatWidth: true,
        lock_model: false,
        lock_system: false,
        // lock_template: false,
        lock_values: false,
        play_sounds: true,
        selectedPresetId: undefined,
        system_prompt_modified: false,
        popout_variables: false
    },
    apiEndpoint: DEFAULT_OL_ENDPOINT,
    savedSystemPrompts: []
});

/* ------------------------------ */

export const defaultMarkdown = writable(true);

/* ------------------------------ */
