import { get } from 'svelte/store';
import { models, currentModel, chatTimeline } from '../stores/stores';

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

export const OL_chat = async (message) => {
    const msg_packet = {
        role: 'user',
        content: message
    };

    chatTimeline.update((timeline) => {
        timeline.push(msg_packet);
        return timeline;
    });

    const response = await fetch(`${API_ENDPOINT}/api/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: get(currentModel).name,
            stream: false,
            messages: [msg_packet]
        })
    });
    return response.json();
};

export const continueChat = async (message) => {
    const response = await OL_chat(message);
    return response;
};

export const appendToTimeline = (message) => {
    get(chatTimeline).push(message);
};
