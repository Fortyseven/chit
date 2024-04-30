import { Writable, writable } from 'svelte/store';

export const DEFAULT_OL_ENDPOINT = 'http://localhost:11434';
export const DEFAULT_PB_ENDPOINT = 'http://localhost:8090/';

export const models = writable([]);
export const chatTimeline = writable([]);
export const responseInProgress_AbortController: Writable<AbortController | null> =
    writable(null);
export const inputText = writable('');
export const errorMessage = writable('');
export const defaultModelName = writable(undefined);

export const contentEl = writable(null);

type AppStateUI = {
    selectedTab: string;
    constrainChatWidth: boolean;
    lock_model: boolean;
    lock_system: boolean;
    lock_values: boolean;
    play_sounds: boolean;
};

export type AppState = {
    ui: AppStateUI;
    apiEndpoint: string;
    pbEndpoint: string;
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
        play_sounds: true
    },
    apiEndpoint: DEFAULT_OL_ENDPOINT,
    pbEndpoint: DEFAULT_PB_ENDPOINT,
    savedSystemPrompts: []
});

/* ------------------------------ */

export const defaultMarkdown = writable(true);

/* ------------------------------ */

// key value pairs
export const userVariables = writable([
    {
        key: 'user',
        value: 'Human'
    },
    {
        key: 'char',
        value: 'Assistant'
    }
]);

export const sysVariables = writable([
    {
        key: 'date',
        desc: 'The current date.',
        value: () => {
            return new Date().toLocaleDateString();
        }
    }
]);
