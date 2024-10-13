import { get, writable } from 'svelte/store';

import { models, chatTimeline, appState } from '../../stores/stores';

import { chatState_resetToDefaults, chatState } from '../../stores/chatState';

//@ts-ignore
import { ebk_inputBoxBack } from '../events/eventBus__keyboard.js';
import { ollama } from '../../lib/api/ollama.js';

export const pendingResponse = writable({
    role: 'assistant',
    content: ''
});
export const responseInProgress = writable(false);
export const pendingContinuedAssistantChat = writable(false);

export const wasAborted = writable(false);

const utf8Decoder = new TextDecoder('utf-8');

/* ------------------------------------------------ */

export const cancelInference = () => {
    // const ac = get(responseInProgress_AbortController);

    try {
        ollama().abort();
    } catch (err) {
        console.error('Error aborting inference: ', err);
    }

    console.debug('cancelInference; RIP false');
    responseInProgress.set(false);
    wasAborted.set(true);
    _clearPendingResponse();

    ebk_inputBoxBack();
    // }
};

/* ------------------------------------------------ */

export const refreshModelList = async () => {
    console.info('Refreshing models');

    const response = await ollama().list();

    models.set(response.models.sort((a, b) => a.model.localeCompare(b.model)));
};

/**
 * Get the details of a model from the server.
 * @param {*} model_name
 * @returns {Promise} A promise that resolves to the model details.
 */
export async function OL_model_details(model_name) {
    try {
        const response = await fetch(`${get(appState).apiEndpoint}/api/show`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: model_name
            })
        });

        let details = await response.json();

        return details;
    } catch (err) {
        console.error('OL_model_details error: ', err);
        throw Error('Error connecting to server: ' + err.message);
    }
}

function _parseConfigString(configString) {
    const configArray = configString.split('\n');
    const configObject = {};

    configArray.forEach((entry) => {
        const [key, value] = entry.split(/\s+/);
        if (key && value !== undefined) {
            configObject[key] = isNaN(value) ? value : parseFloat(value);
        }
    });

    return configObject;
}

export async function updateModelDetails(model_name) {
    chatState_resetToDefaults();

    await OL_model_details(model_name).then((details) => {
        chatState.update((state) => {
            if (!get(appState).ui.lock_system && details.system) {
                state.system_prompt = details.system;
            }

            // iterate state.values properties and replace
            // with values from details.parameters

            if (!get(appState).ui.lock_values && details.parameters) {
                const params = _parseConfigString(details.parameters);
                for (const key of Object.keys(state.values)) {
                    if (params[key]) {
                        console.log('PARAM', key, params[key]);
                        state.values[key] = params[key];
                    }
                }
            }

            return state;
        });
    });
}

export const appendToTimeline = (message) => {
    get(chatTimeline).push(message);
};
