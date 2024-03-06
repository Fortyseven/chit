import { writable } from 'svelte/store';

export let isSidebarOpen = writable(false);
export let selectedTab = writable('chat');
