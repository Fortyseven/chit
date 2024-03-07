import { writable, derived } from 'svelte/store';

export const DEFAULT_API_ENDPOINT = 'http://localhost:11434';

export let models = writable([]);
export let currentModelIndex = writable(0);
export let chatTimeline = writable([]);
export let inferringInProgress = writable(false);
export let inputText = writable('');
export let errorMessage = writable('');
export let defaultModelName = writable(undefined);

export let apiEndpoint = writable(DEFAULT_API_ENDPOINT);

/* ------------------------------ */

export let defaultMarkdown = writable(true);

export let model_favorites = writable([]);

/* ------------------------------ */

// derived

export const isInferring = derived(
    [inferringInProgress],
    ([$inferringInProgress]) => {
        return $inferringInProgress !== null && $inferringInProgress !== false;
    }
);
