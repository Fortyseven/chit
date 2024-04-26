import { appState } from '$stores/stores';
import { get } from 'svelte/store';

const audioResponse = new Audio('assets/response.wav');

// Preload the audio
audioResponse.preload = 'auto';

// Play the audio
export function playSndResponse() {
    if (get(appState).ui.play_sounds) {
        audioResponse.play();
    }
}
