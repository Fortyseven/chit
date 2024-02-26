import { get } from 'svelte/store';
import {
    chatTimeline,
    currentModelIndex,
    defaultModelName,
    models
} from '../stores/stores';
import { refreshModelList } from './api';
import {
    setLocalStorageSubscriptions,
    syncLocalStorageStores
} from './localStorage_stores';

export async function init() {
    console.log('🟢 Initializing app...');

    syncLocalStorageStores();
    setLocalStorageSubscriptions();

    // set default model if a chat is not already in progress
    if (get(chatTimeline).length === 0) {
        // if we have a default model, set it
        if (get(defaultModelName)) {
            console.log('⭐ Setting default model...');
            const modelIndex = get(models).findIndex(
                (model) => model.name === get(defaultModelName)
            );
            if (modelIndex !== -1) {
                currentModelIndex.set(modelIndex);
            }
        }
    }

    await refreshModelList();
    console.log('🔴 ...init complete.');
}
