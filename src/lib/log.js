import { get } from 'svelte/store';
import { chat_log, chat_state } from '../stores/chat_state';
import { chatTimeline } from '../stores/stores';

export function saveChatStateToLog() {
    chat_log.update((log) => {
        // make a deep copy
        // const chat = JSON.parse(JSON.stringify(get(chat_state)));
        // chat.guid = chat.guid || Date.now();
        // log.push(chat);
        // console.log('chat_log', log);

        const saved_chat_state = JSON.parse(JSON.stringify(get(chat_state)));
        const saved_chat_timeline = JSON.parse(
            JSON.stringify(get(chatTimeline))
        );

        saved_chat_state.guid = Date.now();

        log.push({
            chat_state: saved_chat_state,
            chat_timeline: saved_chat_timeline
        });

        return log;
    });
}

export function restoreChatStateLog(guid) {
    const log = get(chat_log);
    const chat = log.find((c) => c.chat_state.guid === guid);

    if (chat) {
        chat_state.set(chat.chat_state);
        chatTimeline.set(chat.chat_timeline);
    }
}
