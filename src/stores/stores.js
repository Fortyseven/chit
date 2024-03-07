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

export const embeddingonly_default = false;
export let embeddingonly = writable(embeddingonly_default);

export const f16kv_default = true;
export let f16kv = writable(f16kv_default);

export const frequencypenalty_default = 1.0;
export let frequencypenalty = writable(frequencypenalty_default);

export const lowvram_default = false;
export let lowvram = writable(lowvram_default);

export const mirostat_default = 1;
export let mirostat = writable(mirostat_default);

export const mirostateta_default = 0.6;
export let mirostateta = writable(mirostateta_default);

export const mirostattau_default = 0.8;
export let mirostattau = writable(mirostattau_default);

export const numbatch_default = 2;
export let numbatch = writable(numbatch_default);

export const numctx_default = 1024;
export let numctx = writable(numctx_default);

export const repeatlastn_default = 33;
export let repeatlastn = writable(repeatlastn_default);

export const repeatpenalty_default = 1.2;
export let repeatpenalty = writable(repeatpenalty_default);

export const seed_default = 42;
export let seed = writable(42);

export const stop_default = ['\n', 'user:'];
export let stop = writable(stop_default);

export const temperature_default = 0.8;
export let temperature = writable(temperature_default);

export const topk_default = 20;
export let topk = writable(topk_default);

export const topp_default = 0.9;
export let topp = writable(topp_default);

export const typicalp_default = 0.7;
export let typicalp = writable(typicalp_default);

// derived

export const isInferring = derived(
    [inferringInProgress],
    ([$inferringInProgress]) => {
        return $inferringInProgress !== null && $inferringInProgress !== false;
    }
);
