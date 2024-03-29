import { get, writable } from 'svelte/store';

import {
    models,
    chatTimeline,
    appState,
    responseInProgress_AbortController
} from '../../stores/stores';

import { chatState_resetToDefaults, chatState } from '../../stores/chatState';

import { ebk_inputBoxBack } from '../../lib/events/eventBus__keyboard';

export const pendingResponse = writable({
    role: 'assistant',
    content: ''
});
export const responseInProgress = writable(false);

export const wasAborted = writable(false);

const utf8Decoder = new TextDecoder('utf-8');

function _updatePendingResponse(response) {
    pendingResponse.update((pr) => {
        pr.content += response;
        return pr;
    });
}

function _clearPendingResponse() {
    pendingResponse.set({
        role: 'assistant',
        content: ''
    });
}

/* ------------------------------------------------ */

export const cancelInference = () => {
    const ac = get(responseInProgress_AbortController);

    if (ac) {
        console.log('🛑 Cancelling inference: ', ac);
        get(responseInProgress_AbortController).abort();

        responseInProgress_AbortController.set(null);
        responseInProgress.set(false);
        wasAborted.set(true);
        _clearPendingResponse();

        ebk_inputBoxBack();
    }
};

/* ------------------------------------------------ */

export const OL_listLocalModels = async () => {
    const response = await fetch(`${get(appState).apiEndpoint}/api/tags`);
    return response.json();
};

export const refreshModelList = async () => {
    console.log('Refreshing models');
    const response = await OL_listLocalModels();
    models.set(response.models);
    console.log('Models: ', get(models));
};

function _getChatParamObject() {
    const chat_parameters = get(chatState).values;

    //FIXME:
    delete chat_parameters.stop;

    let new_chat_parameters = {};

    for (const key of Object.keys(chat_parameters)) {
        if (chat_parameters[key] !== undefined && chat_parameters[key] != -1) {
            try {
                new_chat_parameters[key] = parseFloat(chat_parameters[key]);
            } catch (e) {
                new_chat_parameters[key] = chat_parameters[key];
            }
        }
    }

    return new_chat_parameters;
}

/* ------------------------------------------------ */
/* Returns null or the response from the server.    */
export async function OL_chat(user_message = null) {
    if (get(chatState)?.model_name === null) {
        throw new Error('No model selected');
    }

    // if we don't have a message, it's for use when there's already
    // a user message in the timeline, so skip adding it again
    if (user_message !== null) {
        const msg_packet = {
            role: 'user',
            content: user_message
        };

        chatTimeline.update((timeline) => {
            timeline.push(JSON.parse(JSON.stringify(msg_packet)));
            return timeline;
        });
    }

    try {
        const ac = new AbortController();

        // sets the pending message index to expect for the response

        const body = {
            model: get(chatState).model_name,
            stream: true,
            messages: [...get(chatTimeline)],
            template: get(chatState).template,
            options: {
                ..._getChatParamObject()
            }
        };

        const sys_prompt = get(chatState)?.system_prompt?.trim();

        if (sys_prompt) {
            body.messages = [
                {
                    role: 'system',
                    content: sys_prompt
                },
                ...body.messages
            ];
        }

        _clearPendingResponse();
        wasAborted.set(false);
        responseInProgress.set(true);
        responseInProgress_AbortController.set(ac);

        console.log('OL_chat REQUEST body: ', body);

        const stream = await fetch(`${get(appState).apiEndpoint}/api/chat`, {
            signal: ac.signal,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        for await (const chunk of stream.body) {
            const objects = utf8Decoder
                .decode(chunk)
                .split('\n')
                .filter((x) => x.length > 0)
                .map((x) => JSON.parse(x));

            for (const obj of objects) {
                if (obj.message) {
                    _updatePendingResponse(obj.message.content);
                }
            }
        }

        responseInProgress.set(false);

        return get(pendingResponse);
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error('OL_chat error: ', err);
            throw Error('Error connecting to server: ' + err.message);
        } else {
            return null;
        }
    } finally {
        responseInProgress_AbortController.set(null);
        responseInProgress.set(false);
    }
}

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
            state.system_prompt = details.system;
            state.template = details.template;
            // iterate state.values properties and replace with values from details.parameters

            if (details.parameters) {
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
