import { writable, derived } from 'svelte/store';

export const DEFAULT_API_ENDPOINT = 'http://localhost:11434';

export let models = writable([]);
export let currentModelIndex = writable(0);
export let chatTimeline = writable([]);
export let isInferring = writable(false);
export let inputText = writable('');
export let errorMessage = writable('');

export let defaultModelName = writable(undefined);

export let selectedTab = writable('chat');

export let apiEndpoint = writable(DEFAULT_API_ENDPOINT);
/* ------------------------------ */

export let defaultMarkdown = writable(true);

/* ------------------------------ */

// export let model_settings = {
//     /* ollama-specific settings */
//     embeddingonly: writable(false),
//     f16kv: writable(true),
//     frequencypenalty: writable(1.0),
//     lowvram: writable(false),
//     maingpu: writable(0),
//     mirostat: writable(1),
//     mirostateta: writable(0.6),
//     mirostattau: writable(0.8),
//     numbatch: writable(2),
//     numctx: writable(1024),
//     numgpu: writable(1),
//     numgqa: writable(1),
//     numkeep: writable(5),
//     numpredict: writable(100),
//     numthread: writable(8),
//     numa: writable(false),
//     penalizenewline: writable(true),
//     presencepenalty: writable(1.5),
//     repeatlastn: writable(33),
//     repeatpenalty: writable(1.2),
//     ropefrequencybase: writable(1.1),
//     ropefrequencyscale: writable(0.8),
//     seed: writable(42),
//     stop: writable(['\n', 'user:']),
//     temperature: writable(0.8),
//     tfsz: writable(0.5),
//     topk: writable(20),
//     topp: writable(0.9),
//     typicalp: writable(0.7),
//     usemlock: writable(false),
//     usemmap: writable(true),
//     vocabonly: writable(false)
// };

/* ollama-specific settings */
// export let maingpu = writable(0);
// export let numa = writable(false);
// export let numgpu = writable(1);
// export let numgqa = writable(1);
// export let numkeep = writable(5);
// export let numpredict = writable(100);
// export let numthread = writable(8);
// export let penalizenewline = writable(true);
// export let presencepenalty = writable(1.5);
// export let ropefrequencybase = writable(1.1);
// export let ropefrequencyscale = writable(0.8);
// export let tfsz = writable(0.5);
// export let usemlock = writable(false);
// export let usemmap = writable(true);
// export let vocabonly = writable(false);
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

export const currentModel = derived(
    [models, currentModelIndex],
    ([$models, $currentModelIndex]) => {
        if (!$models || $models.length === 0) {
            return null;
        }
        return $models[$currentModelIndex];
    }
);
