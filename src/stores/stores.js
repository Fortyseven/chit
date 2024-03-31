import { writable, derived } from 'svelte/store';

export const DEFAULT_OL_ENDPOINT = 'http://localhost:11434';
export const DEFAULT_PB_ENDPOINT = 'http://localhost:8090/';

export const models = writable([]);
export const chatTimeline = writable([]);
export const responseInProgress_AbortController = writable(null);
export const inputText = writable('');
export const errorMessage = writable('');
export const defaultModelName = writable(undefined);

export const contentEl = writable(null);

/* FIXME: This is absurd having this AND the same-named store in
  stores_ui. This needs to be fixed ASAP. */
export const appState = writable({
    ui: {
        // autoImportDefaults: true,
        selectedTab: 'presets',
        constrainChatWidth: true,
        lock_model: false,
        lock_system: false,
        // lock_template: false,
        lock_values: false
    },
    apiEndpoint: DEFAULT_OL_ENDPOINT,
    pbEndpoint: DEFAULT_PB_ENDPOINT,
    savedSystemPrompts: []
});

/* ------------------------------ */

export const defaultMarkdown = writable(true);

export const model_favorites = writable([]);
