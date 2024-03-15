import { chatTimeline, inputText } from '../stores/stores';
import { OL_chat } from '$lib/api/api';
import { ebk_inputBoxFocus } from '$lib/events/eventBus__keyboard';
import { get } from 'svelte/store';
import { chat_state } from '../stores/chat_state';
import { contentEl } from '../stores/stores_ui';

export function scrollToBottom() {
    if (get(contentEl)) {
        setTimeout(() => {
            contentEl.update((el) => {
                el.scrollTop = el.scrollHeight;
                return el;
            });
        }, 50);
        // await tick();
    }
}

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

    let offset = 1;
    let priorChatEntry = undefined;

    // check if previous entry in chatTimeline is a bot response
    while (priorChatEntry?.role !== 'user') {
        let pos = get(chatTimeline).length - offset;
        if (pos < 0) {
            console.error('No user message found in chat timeline');
            return;
        }
        priorChatEntry = get(chatTimeline)[pos];
        offset++;
    }

    popLastMessage();

    // rerun inference
    let response = await OL_chat();

    if (response) {
        // add new response to timeline
        chatTimeline.update((timeline) => {
            timeline.push(response);
            return timeline;
        });
    } else {
        console.error('Failed to reroll last response');
    }
    // }
}

/*
 * Removes the last message from the chat timeline.
 */
export function popLastMessage() {
    chatTimeline.update((timeline) => {
        timeline.pop();
        return timeline;
    });
}
