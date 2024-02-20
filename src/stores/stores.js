import { writable, derived } from 'svelte/store';

export let models = writable([]);
export let currentModelIndex = writable(0);
export let chatTimeline = writable([]);
export let isInferring = writable(false);
export let model_settings = {
    /* ollama-specific settings */
    embeddingonly: writable(false),
    f16kv: writable(true),
    frequencypenalty: writable(1.0),
    lowvram: writable(false),
    maingpu: writable(0),
    mirostat: writable(1),
    mirostateta: writable(0.6),
    mirostattau: writable(0.8),
    numbatch: writable(2),
    numctx: writable(1024),
    numgpu: writable(1),
    numgqa: writable(1),
    numkeep: writable(5),
    numpredict: writable(100),
    numthread: writable(8),
    numa: writable(false),
    penalizenewline: writable(true),
    presencepenalty: writable(1.5),
    repeatlastn: writable(33),
    repeatpenalty: writable(1.2),
    ropefrequencybase: writable(1.1),
    ropefrequencyscale: writable(0.8),
    seed: writable(42),
    stop: writable(['\n', 'user:']),
    temperature: writable(0.8),
    tfsz: writable(0.5),
    topk: writable(20),
    topp: writable(0.9),
    typicalp: writable(0.7),
    usemlock: writable(false),
    usemmap: writable(true),
    vocabonly: writable(false)
};

// derived

export const currentModel = derived(
    [models, currentModelIndex],
    ([$models, $currentModelIndex]) => {
        return $models[$currentModelIndex];
    }
);

// export const chatContext = derived(chatTimeline, ($chatTimeline) => {
//     let ctx = $chatTimeline
//         .map((msg) => `${msg.role}: ${msg.content}`)
//         .join('\n');

//     console.error('chatContext: ', ctx);
//     return ctx;
// });
