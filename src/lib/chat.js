import { chatTimeline } from '../stores/stores';
import { OL_chat } from '../lib/api';
import { get } from 'svelte/store';

/**
 * Truncates the up to the given index in the chat timeline.
 * @param {*} index
 */
export function rewindChatToIndex(index) {
    chatTimeline.update((timeline) => {
        return timeline.slice(0, index + 1);
    });
}

export async function rerollLastResponse(index = undefined) {
    if (index) {
        // we're rerolling back to a specific response
        rewindChatToIndex(index);
    }

    // check if previous entry in chatTimeline is a bot response
    const priorChatEntry = get(chatTimeline)[get(chatTimeline).length - 1];

    if (priorChatEntry.role !== 'user') {
        popLastMessage();

        // rerun inference
        let response = await OL_chat();

        if (response) {
            // add new response to timeline
            chatTimeline.update((timeline) => {
                timeline.push(response.message);
                return timeline;
            });
        } else {
            console.error('Failed to reroll last response');
        }
    }
}

export function popLastMessage() {
    chatTimeline.update((timeline) => {
        timeline.pop();
        return timeline;
    });
}
