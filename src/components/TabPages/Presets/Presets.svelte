<script>
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';

    import { getPresets, pb } from '$lib/pocketbase';

    import { chat_state } from '$stores/chat_state.js';
    import { appState } from '$stores/stores';

    // import ChatButton from '$components/UI/ChatButton.svelte';
    import Presets__SystemPrompt from './Presets__SystemPrompt.svelte';
    import Presets__Template from './Presets__Template.svelte';
    import ModelList from '../Conversation/ModelList/ModelList.svelte';

    function savePrompt() {
        appState.update((state) => {
            state.savedSystemPrompts.push($chat_state.system_prompt);
            return state;
        });
    }

    let presets = undefined;
    let selected = undefined;

    let save_model = true;
    let save_template = true;

    onMount(async () => {
        presets = await getPresets();
    });

    // -------------------------
    function loadPreset() {
        let preset = presets.filter((p) => p.id === selected)[0];

        chat_state.update((state) => {
            state.preset_id = preset.id;
            state.title = preset.title;
            state.system_prompt = preset.system;

            if (preset.model_name) {
                state.model_name = preset.model_name;
            }

            if (preset.template) {
                state.template = preset.template;
            }

            if (preset.options) {
                state.values = { ...state.values, ...preset.options };
            }

            console.table({ state });
            console.log('preset', preset);
            return state;
        });
    }
</script>

<!-- ----------------------------------------------------------------------- -->

<div id="Presets" class="w-full h-full text-white">
    <div class="pb-4 text-3xl">Presets</div>

    {#if presets}
        <!-- dropdown -->
        <div class="flex w-full gap-1">
            <select
                bind:value={selected}
                class="w-full px-4 py-2 mb-2 text-white bg-[#888]"
            >
                {#each presets as preset}
                    <option value={preset.id}>{preset.title}</option>
                {/each}
            </select>
            {#if selected == $chat_state.preset_id}
                <button class="update" on:click={loadPreset}>Updt</button>
            {:else}
                <button class="load" on:click={loadPreset}>Load</button>
            {/if}
            <button class="del" on:click={loadPreset}> Del </button>
        </div>

        <hr />
    {/if}

    <!-- ---------------------- -->
    <!-- {@debug chat_state} -->
    {#if $chat_state}
        <div class="preset-title">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>Title</label>
            <input type="text" bind:value={$chat_state.title} />
        </div>

        <hr />

        <!-- --------------- -->
        <div class="model-list">
            <ModelList />
        </div>

        <hr />

        <!-- --------------- -->
        <Presets__SystemPrompt bind:save={save_model} />
        <hr />

        <!-- --------------- -->
        <Presets__Template bind:save={save_template} />

        <hr />

        <!-- --------------- -->
        <div class="chat-values">
            <ul>
                {#each Object.keys($chat_state.values) as key}
                    <li>
                        <!-- svelte-ignore a11y-label-has-associated-control -->
                        <label>{key}</label>
                        <input bind:value={$chat_state.values[key]} />
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
</div>

<!-- ----------------------------------------------------------------------- -->

<style lang="scss">
    hr {
        padding: 0;
        margin: 0.75em 0;
        border-color: #888;
    }

    .ass {
        .dropdown {
            // width: 100%;
            // display: flex;
            // gap: 0.25em;

            select {
                width: 100%;
                font-family: var(--font-primary);
                background-color: #888;
                border: none;
            }

            button {
                // font-family: var(--font-primary);
                // cursor: pointer;
                // &.del {
                //     background-color: var(--color-error);
                //     border: none;
                //     border-radius: 4px;
                // }

                // &:hover {
                //     opacity: 0.8;
                // }
            }
        }

        .preset-title {
            display: flex;
            flex-direction: column;
            label {
                padding-bottom: 0.25em;
            }
        }

        .template-prompt {
            display: flex;
            flex-direction: column;
            label {
                color: white;
                margin-bottom: 0.5em;
            }
            textarea {
                border: none;
                border-radius: 10px;
                height: 6em;
                padding: 0.5em;
                font-family: monospace !important;
                outline: none;
                background-color: #444;
                color: white;
            }
        }
    }

    .preset-title {
        display: flex;
        flex-direction: column;
    }

    .chat-values {
        ul {
            list-style: none;
            padding: 0;
            display: flex;
            flex-wrap: wrap;
            margin: auto;
        }

        li {
            flex: 1 1 auto;
            margin: 0;
            padding: 0;
            padding-bottom: 0.25em;
            display: flex;

            label {
                display: block;
                margin-bottom: 0.5em;

                width: 6.5em;
            }

            input {
                width: 4em;
                height: 2em;
                font-family: monospace !important;
            }
        }

        input {
            background-color: #000;
            color: white;
            border: none;
            padding: 0.5em;
        }
    }
</style>
