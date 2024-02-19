import { writable, derived } from 'svelte/store';

export let models = writable([]);
export let currentModelIndex = writable(0);

// derived

export const currentModel = derived(
    [models, currentModelIndex],
    ([$models, $currentModelIndex]) => {
        return $models[$currentModelIndex];
    }
);
