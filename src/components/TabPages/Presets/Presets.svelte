<script>
    import { onMount } from 'svelte';

    import { chatState } from '$stores/chatState.js';
    import { appState } from '$stores/stores';
    import { updateModelDetails } from '$lib/api/api';
    import { getPresets, loadPreset } from '$lib/presets';

    import Presets__SystemPrompt from './Presets__SystemPrompt.svelte';
    import Presets__Template from './Presets__Template.svelte';
    import ModelList from '../Conversation/ModelList/ModelList.svelte';

    function savePrompt() {
        appState.update((state) => {
            state.savedSystemPrompts.push($chatState.system_prompt);
            return state;
        });
    }

    let available_presets = undefined;
    let selected_preset_id = undefined;

    let save_model = true;
    let save_template = true;

    onMount(async () => {
        available_presets = await getPresets();
    });

    // -------------------------
    async function beginLoadPreset() {
        console.log('Loading preset:', selected_preset_id);

        let preset_data = await loadPreset(selected_preset_id);

        // let preset = available_presets.filter((p) => p.id === selected)[0];

        // if (preset.model_name) {
        //     console.log('Loading model presets for ', preset.model_name);
        //     await updateModelDetails(preset.model_name);
        //     console.log('After loading:', get(chatState));
        // }

        // chatState.update(async (chat_state) => {
        //     chat_state.preset_id = preset.id;
        //     chat_state.title = preset.title;
        //     chat_state.system_prompt = preset.system;

        //     if (preset.model_name) {
        //         chat_state.model_name = preset.model_name;
        //     }

        //     if (preset.template) {
        //         chat_state.template = preset.template;
        //     }

        //     if (preset.options) {
        //         chat_state.values = { ...chat_state.values, ...preset.options };
        //     }

        //     console.table({ state: chat_state });
        //     console.log('preset', preset);
        //     return chat_state;
        // });
    }
</script>

<!-- ----------------------------------------------------------------------- -->

<div id="Presets" class="w-full h-full text-white">
    <div class="pb-4 text-3xl">Presets</div>

    {#if available_presets}
        <!-- dropdown -->
        <div class="flex w-full gap-1">
            <select
                bind:value={selected_preset_id}
                class="w-full px-4 py-2 mb-2 text-white bg-[#888]"
            >
                {#each available_presets as preset}
                    <option value={preset.id}>{preset.title}</option>
                {/each}
            </select>
            <!-- {#if selected == $chatState.preset_id}
                <button class="update" on:click={loadPreset}>Updt</button>
            {:else} -->
            <button class="load" on:click={beginLoadPreset}>Load</button>
            <!-- {/if} -->
            <button class="del" on:click={beginLoadPreset}> Del </button>
        </div>

        <hr />
    {/if}

    <!-- ---------------------- -->
    <!-- {@debug chatState} -->
    {#if $chatState}
        <div class="preset-title">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>Title</label>
            <input type="text" bind:value={$chatState.title} />
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
            {#if $chatState.values}
                <ul>
                    {#each Object.keys($chatState.values) as key}
                        <li>
                            <!-- svelte-ignore a11y-label-has-associated-control -->
                            <label>{key}</label>
                            <input bind:value={$chatState.values[key]} />
                        </li>
                    {/each}
                </ul>
            {/if}
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
