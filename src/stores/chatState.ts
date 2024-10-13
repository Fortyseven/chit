import { get, Writable, writable } from 'svelte/store';
import { appState } from './stores';

type ChatStateValues = {
    mirostat: number;
    mirostat_eta: number;
    mirostat_tau: number;
    num_ctx: number;
    num_predict: number;
    repeat_last_n: number;
    repeat_penalty: number;
    seed: number;
    // stop: string[];
    temperature: number;
    tfs_z: number;
    top_k: number;
    top_p: number;
};

type ChatState = {
    model_name: string;
    system_prompt: string;
    guid: string | undefined;
    loadedKoboldState: object | undefined;
    stateFilename: string;
    values: ChatStateValues;
};

/* these are just out of nowhere sane defaults; actual defaults will
come from the modelfile refresh */
const DEFAULTS: ChatStateValues = {
    mirostat_eta: 0.1,
    mirostat_tau: 5.0,
    mirostat: 0,
    num_ctx: 2048,
    num_predict: -1,
    repeat_last_n: 64,
    repeat_penalty: 1.1,
    seed: -1,
    // stop: ['<|end_of_turn|>', '<|endoftext|>'],
    temperature: 0.8,
    tfs_z: 1.0,
    top_k: 40,
    top_p: 0.9
};

export const chatState: Writable<ChatState> = writable({
    model_name: '',
    system_prompt:
        'The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.',
    guid: undefined,
    loadedKoboldState: undefined,
    stateFilename: 'untitled.json',
    values: {
        mirostat: DEFAULTS.mirostat,
        mirostat_eta: DEFAULTS.mirostat_eta,
        mirostat_tau: DEFAULTS.mirostat_tau,
        num_ctx: DEFAULTS.num_ctx,
        num_predict: DEFAULTS.num_predict,
        repeat_last_n: DEFAULTS.repeat_last_n,
        repeat_penalty: DEFAULTS.repeat_penalty,
        seed: DEFAULTS.seed,
        // stop: chatState_defaults.stop,
        temperature: DEFAULTS.temperature,
        tfs_z: DEFAULTS.tfs_z,
        top_k: DEFAULTS.top_k,
        top_p: DEFAULTS.top_p
    }
});

export const chatState_resetToDefaults = () => {
    chatState.update((state) => {
        state.guid = undefined;

        if (!get(appState).ui.lock_system) {
            state.system_prompt =
                'The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.';
        }

        if (!get(appState).ui.lock_values) {
            state.values = {
                mirostat: DEFAULTS.mirostat,
                mirostat_eta: DEFAULTS.mirostat_eta,
                mirostat_tau: DEFAULTS.mirostat_tau,
                num_ctx: DEFAULTS.num_ctx,
                num_predict: DEFAULTS.num_predict,
                repeat_last_n: DEFAULTS.repeat_last_n,
                repeat_penalty: DEFAULTS.repeat_penalty,
                seed: DEFAULTS.seed,
                // stop: chatState_defaults.stop,
                temperature: DEFAULTS.temperature,
                tfs_z: DEFAULTS.tfs_z,
                top_k: DEFAULTS.top_k,
                top_p: DEFAULTS.top_p
            };
        }
        return state;
    });
};

export const completedResponse = writable(undefined);
