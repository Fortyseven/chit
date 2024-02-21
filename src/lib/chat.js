import { chatTimeline } from '../stores/stores';
import { OL_chat } from '../lib/api';
import { get } from 'svelte/store';

export async function rerollLastResponse() {
    // check if last entry in chatTimeline is a bot response
    const last = get(chatTimeline)[get(chatTimeline).length - 1];
    console.log(last);
    if (last.role !== 'user') {
        console.log('Last message is user message, rerolling');
        console.warn('Timeline A: ', get(chatTimeline));
        // remove last entry
        // let timeline = get(chatTimeline);
        // timeline.pop();
        // chatTimeline.set(timeline);
        // chatTimeline.update((timeline) => {
        //     timeline.pop();
        //     return timeline;
        // });
        popLastMessage();
        console.warn('Timeline B: ', get(chatTimeline));

        // rerun inference
        let response = await OL_chat();

        if (response) {
            // add new response to timeline
            chatTimeline.update((timeline) => {
                timeline.push(response.message);
                return timeline;
            });

            console.warn('Timeline C: ', get(chatTimeline));
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
