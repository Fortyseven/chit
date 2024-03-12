import { chatTimeline, inputText } from '../stores/stores';
import { OL_chat } from '$lib/api';
import { ebk_inputBoxFocus } from '$lib/events/eventBus__keyboard';
import { get } from 'svelte/store';
import { chat_state } from '../stores/chat_state';

export function clearChat() {
    chatTimeline.set([]);
    inputText.set('');

    // starting from scratch, so no guid yet unless saved
    chat_state.update((state) => {
        state.guid = undefined;
        return state;
    });

    ebk_inputBoxFocus();
}

/**
 * Truncates the up to the given index in the chat timeline.
 * @param {*} index
 */
export function rewindChatToIndex(index) {
    chatTimeline.update((timeline) => {
        return timeline.slice(0, index + 1);
    });
}

/**
 * Rerolls the last response in the chat timeline. If an index is provided, the
 * chat timeline will be truncated to that index before rerolling.
 *
 * @param {*} rewindToIndex if an index is provided, the chat timeline will be
 * truncated to that index
 */
export async function rerollLastResponse(rewindToIndex = undefined) {
    if (rewindToIndex) {
        // we're rerolling back to a specific response
        rewindChatToIndex(rewindToIndex);
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

/**
 * Removes the last message from the chat timeline.
 */
export function popLastMessage() {
    chatTimeline.update((timeline) => {
        timeline.pop();
        return timeline;
    });
}
