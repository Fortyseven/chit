import { get } from 'svelte/store';
import { chat_log, chatState } from '../stores/chatState';
import { chatTimeline } from '../stores/stores';

export function saveChatStateToLog() {
    chat_log.update((log) => {
        // make a deep copy
        // const chat = JSON.parse(JSON.stringify(get(chatState)));
        // chat.guid = chat.guid || Date.now();
        // log.push(chat);
        // console.log('chat_log', log);

        const saved_chatState = JSON.parse(JSON.stringify(get(chatState)));
        const saved_chat_timeline = JSON.parse(
            JSON.stringify(get(chatTimeline))
        );

        saved_chatState.guid = Date.now();

        log.push({
            chatState: saved_chatState,
            chat_timeline: saved_chat_timeline
        });

        return log;
    });
}

export function restoreChatStateLog(guid) {
    const log = get(chat_log);
    const chat = log.find((c) => c.chatState.guid === guid);

    if (chat) {
        chatState.set(chat.chatState);
        chatTimeline.set(chat.chat_timeline);
    }
}
