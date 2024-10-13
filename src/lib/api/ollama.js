import { get } from 'svelte/store';
import { Ollama } from 'ollama/browser';
import { appState } from '$stores/stores';

let ollamaInstance = undefined;
let currentHost = undefined;

function generateOllamaInstance(host) {
    if (currentHost == host) {
        console.log('Returning existing Ollama instance');
        return ollamaInstance;
    }

    console.log('Creating new Ollama instance at', host);
    currentHost = host;
    return new Ollama({ host });
}

/* Catch changes to the endpoint and update the Ollama instance */
appState.subscribe((appState) => {
    if (ollamaInstance && currentHost !== appState.apiEndpoint) {
        console.log('Updating Ollama instance host to ', appState.apiEndpoint);
        ollamaInstance = generateOllamaInstance(appState.apiEndpoint);
    }
    return appState;
});

/* On first run, create the Ollama instance if it doesn't exist. */
export const ollama = function () {
    if (!ollamaInstance) {
        ollamaInstance = generateOllamaInstance(get(appState).apiEndpoint);
    }
    return ollamaInstance;
};
