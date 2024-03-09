import { writable } from 'svelte/store';

export let appState = writable({
    autoImportDefaults: true,
    isSidebarOpen: false,
    selectedTab: 'chat'
});
