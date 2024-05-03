import { Writable, writable } from 'svelte/store';

export const pastedImage: Writable<string | undefined> = writable(undefined);
