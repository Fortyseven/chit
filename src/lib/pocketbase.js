import { get, writable } from 'svelte/store';
import PocketBase from 'pocketbase';
import { appState } from '../stores/stores';

export const pb = new PocketBase(get(appState).pbEndpoint);

export const currentUser = writable(pb.authStore.model);
