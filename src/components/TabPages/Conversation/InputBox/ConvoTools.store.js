import { writable } from 'svelte/store';

export const getFollowUps = writable(false);
export const followUpSuggestions = writable([]);
export const isLoadingFollowups = writable(false);
export const followUpType = writable('questions');
export const followAutoSubmit = writable(true);
