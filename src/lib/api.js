import { get } from 'svelte/store';
import {
    models,
    currentModel,
    chatTimeline,
    isInferring,
    errorMessage
    // chatContext
} from '../stores/stores';

export const API_ENDPOINT = 'http://localhost:11434';

/* ------------------------------------------------ */

export const OL_listLocalModels = async () => {
    const response = await fetch(`${API_ENDPOINT}/api/tags`);
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
export async function OL_chat(message = null) {
    if (get(currentModel) === null) {
        errorMessage.set('No model selected');
        return null;
    }

    // if we don't have a message, it's for use when there's already
    // a user message in the timeline, so skip adding it again
    if (message !== null) {
        const msg_packet = {
            role: 'user',
            content: message
        };

        chatTimeline.update((timeline) => {
            timeline.push(JSON.parse(JSON.stringify(msg_packet)));
            return timeline;
        });
    }

    try {
        isInferring.set(get(chatTimeline).length - 1);

        const response = await fetch(`${API_ENDPOINT}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: get(currentModel).name,
                stream: false,
                messages: get(chatTimeline)
            })
        });

        let new_msg = await response.json();

        console.log('OL_chat response: ', new_msg);

        return new_msg;
    } catch (err) {
        console.error('OL_chat error: ', err);
        errorMessage.set('Error connecting to server: ' + err.message);
        return null;
    } finally {
        isInferring.set(null);
    }
}

// export const continueChat = async (message) => {
//     const response = await OL_chat(message);
//     return response;
// };

export const appendToTimeline = (message) => {
    get(chatTimeline).push(message);
};
