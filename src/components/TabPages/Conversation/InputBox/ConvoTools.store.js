import { writable } from 'svelte/store';

export const getFollowUps = writable(true);
export const followUpSuggestions = writable([]);
export const isLoadingFollowups = writable(false);
export const followUpType = writable('questions');
