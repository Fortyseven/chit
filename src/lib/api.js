import { get } from 'svelte/store';
import {
    models,
    currentModel,
    chatTimeline,
    inferringInProgress,
    apiEndpoint
    // errorMessage
    // chatContext
} from '../stores/stores';
import { chat_state } from '../stores/chat_state';

/* ------------------------------------------------ */

export const OL_listLocalModels = async () => {
    const response = await fetch(`${get(apiEndpoint)}/api/tags`);
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
    if (get(currentModel) === null) {
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
            messages: get(chatTimeline)
        };

        console.log('OL_chat body: ', body);

        const response = await fetch(`${get(apiEndpoint)}/api/chat`, {
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

// /* ------------------------------------------------ */
// /* Returns null or the response from the server.    */
// export async function OL_chat(message = null) {
//     if (get(currentModel) === null) {
//         throw new Error('No model selected');
//     }

//     // if we don't have a message, it's for use when there's already
//     // a user message in the timeline, so skip adding it again
//     if (message !== null) {
//         const msg_packet = {
//             role: 'user',
//             content: message
//         };

//         chatTimeline.update((timeline) => {
//             timeline.push(JSON.parse(JSON.stringify(msg_packet)));
//             return timeline;
//         });
//     }

//     try {
//         inferringInProgress.set(get(chatTimeline).length - 1);

//         const response = await fetch(`${get(apiEndpoint)}/api/chat`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 model: get(currentModel).name,
//                 stream: false,
//                 messages: get(chatTimeline)
//             })
//         });

//         let new_msg = await response.json();

//         console.log('OL_chat response: ', new_msg);

//         return new_msg;
//     } catch (err) {
//         console.error('OL_chat error: ', err);
//         throw Error('Error connecting to server: ' + err.message);
//     } finally {
//         inferringInProgress.set(null);
//     }
// }

// export const continueChat = async (message) => {
//     const response = await OL_chat(message);
//     return response;
// };

export const appendToTimeline = (message) => {
    get(chatTimeline).push(message);
};
