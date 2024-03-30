import { writable } from 'svelte/store';

/* these are just out of nowhere sane defaults; actual defaults will
come from the modelfile refresh */
export const chatState_defaults = {
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

export const chat_log = writable([]);

export const chatState = writable({
    // preset_id: '',
    // title: '',
    model_name: '',
    system_prompt:
        'The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.',
    template: '',
    guid: undefined,
    values: {
        mirostat: chatState_defaults.mirostat,
        mirostat_eta: chatState_defaults.mirostat_eta,
        mirostat_tau: chatState_defaults.mirostat_tau,
        num_ctx: chatState_defaults.num_ctx,
        num_predict: chatState_defaults.num_predict,
        repeat_last_n: chatState_defaults.repeat_last_n,
        repeat_penalty: chatState_defaults.repeat_penalty,
        seed: chatState_defaults.seed,
        // stop: chatState_defaults.stop,
        temperature: chatState_defaults.temperature,
        tfs_z: chatState_defaults.tfs_z,
        top_k: chatState_defaults.top_k,
        top_p: chatState_defaults.top_p
    },
    loadedKoboldState: undefined,
    stateFilename: 'untitled.json'
});

export const chatState_resetToDefaults = () => {
    chatState.update((state) => {
        state.preset_id = '';
        state.title = '';
        state.system_prompt =
            'The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.';
        state.template = '';
        state.guid = undefined;
        state.values = {
            mirostat: chatState_defaults.mirostat,
            mirostat_eta: chatState_defaults.mirostat_eta,
            mirostat_tau: chatState_defaults.mirostat_tau,
            num_ctx: chatState_defaults.num_ctx,
            num_predict: chatState_defaults.num_predict,
            repeat_last_n: chatState_defaults.repeat_last_n,
            repeat_penalty: chatState_defaults.repeat_penalty,
            seed: chatState_defaults.seed,
            // stop: chatState_defaults.stop,
            temperature: chatState_defaults.temperature,
            tfs_z: chatState_defaults.tfs_z,
            top_k: chatState_defaults.top_k,
            top_p: chatState_defaults.top_p
        };
        return state;
    });
};

export const chatState_type = {
    // num_gpu:Number,
    // num_gqa:Number,
    // num_thread:Number,
    mirostat_eta: Number,
    mirostat_tau: Number,
    mirostat: Number,
    num_ctx: Number,
    num_predict: Number,
    repeat_last_n: Number,
    repeat_penalty: Number,
    seed: Number,
    stop: Array,
    temperature: Number,
    tfs_z: Number,
    top_k: Number,
    top_p: Number
};
