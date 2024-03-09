import { writable } from 'svelte/store';

export const eventBus__keyboard = new writable(null);

export function ebk_inputBoxFocus() {
    eventBus__keyboard.set('inputbox-focus');
}

export function ebk_inputBoxBack() {
    eventBus__keyboard.set('inputbox-back');
}
