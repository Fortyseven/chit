import { appState } from '$stores/stores';
import { get } from 'svelte/store';

const audioResponse = new Audio('assets/response.wav');
audioResponse.preload = 'auto';

const audioFail = new Audio('assets/fail.wav');
audioResponse.preload = 'auto';

export function playSndResponse() {
    if (get(appState).ui.play_sounds) {
        audioResponse.play();
    }
}

export function playSndFail() {
    if (get(appState).ui.play_sounds) {
        audioFail.play();
    }
}
