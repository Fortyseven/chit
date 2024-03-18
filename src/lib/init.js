import { get } from 'svelte/store';

import {
    appState,
    chatTimeline,
    currentModelIndex,
    defaultModelName,
    errorMessage,
    models
} from '../stores/stores';

import { chatState_resetToDefaults, chat_state } from '../stores/chat_state';

import { refreshModelList, updateModelDetails } from './api/api';

import {
    setLocalStorageSubscriptions,
    restoreLocalStorageStores
} from './localStorage_stores';

import { pb } from '$lib/pocketbase';

export async function init() {
    console.log('🟢 Initializing app...');

    restoreLocalStorageStores();
    setLocalStorageSubscriptions();

    if (!get(appState).apiEndpoint) {
        errorMessage.set(
            'No Ollama API endpoint set. Please set one in the settings.'
        );
    }

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

    if (get(chat_state).model_name) {
        updateModelDetails(get(chat_state).model_name);
    }

    console.log('🔴 ...init complete.');
}
