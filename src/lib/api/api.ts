import { get, writable } from 'svelte/store';

import { convertBlobUrlToBase64, stripIncompleteSentence } from '$lib/utils';

import {
    models,
    chatTimeline,
    appState,
    responseInProgress_AbortController,
    errorMessage
} from '../../stores/stores';

import { chatState_resetToDefaults, chatState } from '../../stores/chatState';

import { systemPromptTemplated } from '../../stores/templates';

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

/**
 * Append the response fragment to the pending response.
 * @param response_fragment
 */
function _updatePendingResponse(response_fragment: string) {
    pendingResponse.update((pr) => {
        pr.content += response_fragment;
        return pr;
    });
}

/**
 * Clear the pending response.
 */
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
        ac.abort();

        responseInProgress_AbortController.set(null);
        responseInProgress.set(false);
        wasAborted.set(true);
        _clearPendingResponse();

        ebk_inputBoxBack();
    }
};

/* ------------------------------------------------ */

export const refreshModelList = async () => {
    console.info('Refreshing models');

    const response = await ollama().list();

    models.set(response.models.sort((a, b) => a.model.localeCompare(b.model)));
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
/* ------------------------------------------------ */
/* if user_message === null, we're continuing a chat */
/* ------------------------------------------------ */
export async function OL_chat(
    user_message = null,
    continue_chat = false,
    pasted_image = undefined
) {
    if (get(chatState)?.model_name === null) {
        throw new Error('No model selected');
    }

    let should_continue_assistant_chat = false;

    if (continue_chat) {
        // was last chat message's role an 'assistant' type?
        const last_message_role =
            get(chatTimeline)[get(chatTimeline).length - 1].role;

        if (last_message_role === 'assistant') {
            should_continue_assistant_chat = true;
            pendingContinuedAssistantChat.set(true);
        } else {
            // throw new Error(
            //     "Can't continue chat: last message was not from assistant."
            // );
            // return;
        }
    }

    // if we don't have a message, it's for use when there's already
    // a user message in the timeline, so skip adding it again
    if (user_message !== null && !should_continue_assistant_chat) {
        const msg_packet = {
            role: 'user',
            content: user_message,
            images: []
        };

        if (pasted_image) {
            let img64 = await convertBlobUrlToBase64(pasted_image);
            msg_packet.images.push(img64);
        }

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
            //format: 'json',
            options: {
                ..._getChatParamObject()
                // stop: ['[INST]', '[/INST]', '<<SYS>>', '<</SYS>>']
                // TODO: let's get this into the preset manager
            }
        };

        const sys_prompt =
            get(chatState)?.system_prompt && get(systemPromptTemplated);

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

        // we're going to sneak back in the original image since the
        // one we sent to the server was base64 encoded, etc. This way
        // we can keep the original image for restoration onBack
        if (pasted_image) {
            chatTimeline.update((timeline) => {
                const last_message = timeline.pop();

                if (last_message) {
                    // we're saving the original blob for reference
                    // in case the user goes 'back'
                    last_message.image_blob = pasted_image;

                    timeline.push(last_message);

                    return timeline;
                }
            });
        }

        if (stream.status >= 300) {
            console.error('Error connecting to server: ' + stream.body);
            errorMessage.set(stream.statusText);
            return null;
        }

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

        let pending = get(pendingResponse);

        if (get(chatState).values.num_predict > -1) {
            // strip incomplete sentence from end of last message if we're restricting
            // the number of tokens returned
            pending.content = stripIncompleteSentence(pending.content);
        }

        return pending;
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
