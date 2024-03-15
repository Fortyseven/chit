import { writable } from 'svelte/store';

export const contentEl = writable(null);

export let appState = writable({
    autoImportDefaults: true,
    isSidebarOpen: false,
    selectedTab: 'chat',
    constrainChatWidth: true
});
