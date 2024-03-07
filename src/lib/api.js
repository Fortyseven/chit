import { get } from 'svelte/store';
import {
    models,
    chatTimeline,
    inferringInProgress,
    appState
} from '../stores/stores';
import { chat_state } from '../stores/chat_state';

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

/* ------------------------------------------------ */
/* Returns null or the response from the server.    */
export async function OL_chat(user_message = null) {
    if (get(chat_state)?.model_name === null) {
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
        // sets the pending message index to expect for the response
        inferringInProgress.set(get(chatTimeline).length - 1);

        const body = {
            model: get(chat_state).model_name,
            stream: false,
            messages: [...get(chatTimeline)]
        };

        const sys_prompt = get(chat_state).system_prompt.trim();

        // TODO: only prepend the system prompt if it's not empty, otherwise
        // you'll override the default model prompt. Then again, this may
        // be desired behavior, so we can add a setting for it?

        if (sys_prompt) {
            body.messages = [
                {
                    role: 'system',
                    content: sys_prompt
                },
                ...body.messages
            ];
        }

        console.log('OL_chat body: ', body);

        const response = await fetch(`${get(appState).apiEndpoint}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        let new_msg = await response.json();

        console.log('OL_chat response: ', new_msg);

        return new_msg;
    } catch (err) {
        console.error('OL_chat error: ', err);
        throw Error('Error connecting to server: ' + err.message);
    } finally {
        inferringInProgress.set(null);
    }
}

/*
curl http://localhost:11434/api/show -d '{
  "name": "llama2"
}'
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
    OL_model_details(model_name).then((details) => {
        chat_state.update((state) => {
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

            console.log('FINAL', state);

            return state;
        });
    });
}

export const appendToTimeline = (message) => {
    get(chatTimeline).push(message);
};
