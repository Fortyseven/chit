import { writable } from 'svelte/store';

export const chat_state_defaults = {
    mirostat_eta: 0.5,
    mirostat_tau: 3.0,
    mirostat: 1,
    num_ctx: 2048,
    num_predict: 1024,
    repeat_last_n: 64,
    repeat_penalty: 1.2,
    seed: -1,
    stop: ['<|end_of_turn|>', '<|endoftext|>'],
    temperature: 0.7,
    tfs_z: 2,
    top_k: 10,
    top_p: 0.6
};

export const chat_log = writable([]);

export const chat_state = writable({
    model_name: '',
    system_prompt:
        'The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.',
    template: '',
    guid: undefined,
    values: {
        mirostat: chat_state_defaults.mirostat,
        mirostat_eta: chat_state_defaults.mirostat_eta,
        mirostat_tau: chat_state_defaults.mirostat_tau,
        num_ctx: chat_state_defaults.num_ctx,
        num_predict: chat_state_defaults.num_predict,
        repeat_last_n: chat_state_defaults.repeat_last_n,
        repeat_penalty: chat_state_defaults.repeat_penalty,
        seed: chat_state_defaults.seed,
        stop: chat_state_defaults.stop,
        temperature: chat_state_defaults.temperature,
        tfs_z: chat_state_defaults.tfs_z,
        top_k: chat_state_defaults.top_k,
        top_p: chat_state_defaults.top_p
    }
});

export const chat_state_type = {
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
