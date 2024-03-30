<script>
    import { onMount } from 'svelte';

    import { chatState } from '$stores/chatState.js';
    import { appState } from '$stores/stores';
    import { updateModelDetails } from '$lib/api/api';

    import Presets__TextArea from './Presets__TextArea.svelte';
    import ModelList from '../Conversation/ModelList/ModelList.svelte';
    import Button from '$components/UI/Button.svelte';
    import { mergeDeep } from '$lib/utils';

    import { saveAs } from '../../../lib/vendor/FileSaver.min.js';
    import LockLabelToggle from '$components/UI/LockLabelToggle.svelte';

    function savePrompt() {
        appState.update((state) => {
            state.savedSystemPrompts.push($chatState.system_prompt);
            return state;
        });
    }

    let lock_model = false;
    let lock_system = false;
    let lock_template = false;
    let lock_values = false;

    onMount(async () => {
        $chatState.loadedKoboldState = undefined;
    });

    function _onHaveLoadedKobold(data) {
        if (lock_model && lock_system && lock_template && lock_values) {
            console.warn('All settings are locked, aborted by default');
            return;
        }

        chatState.update((state) => {
            if (!lock_model) {
                if (data.savedsettings?.model_name) {
                    state.model_name = data.savedsettings.model_name;
                }
            }

            if (!lock_system) {
                if (data?.memory) {
                    state.system_prompt = data.memory;
                }
            }

            if (!lock_values) {
                //temperature: chatState_defaults.temperature,
                if (data.savedsettings?.temperature) {
                    state.values.temperature = data.savedsettings.temperature;
                }
                // top_k: chatState_defaults.top_k,
                if (data.savedsettings?.top_k) {
                    state.values.top_k = data.savedsettings.top_k;
                }
                //top_p: chatState_defaults.top_p
                if (data.savedsettings?.top_p) {
                    state.values.top_p = data.savedsettings.top_p;
                }
                if (data.savedsettings?.rep_pen) {
                    state.values.repeat_penalty = data.savedsettings.rep_pen;
                }
                if (data.savedsettings?.max_length) {
                    state.values.max_length = data.savedsettings.max_length;
                }
                if (data.savedsettings?.max_context_length) {
                    state.values.num_ctx =
                        data.savedsettings.max_context_length;
                }
                // end native kobold settings

                if (data.savedsettings?.repeat_last_n) {
                    state.values.repeat_last_n =
                        data.savedsettings.repeat_last_n;
                }

                //  mirostat: chatState_defaults.mirostat,
                if (data.savedsettings?.mirostat) {
                    state.values.mirostat = data.savedsettings.mirostat;
                }
                // mirostat_eta: chatState_defaults.mirostat_eta,
                if (data.savedsettings?.mirostat_eta) {
                    state.values.mirostat_eta = data.savedsettings.mirostat_eta;
                }
                // mirostat_tau: chatState_defaults.mirostat_tau,

                if (data.savedsettings?.mirostat_tau) {
                    state.values.mirostat_tau = data.savedsettings.mirostat_tau;
                }

                // num_predict: chatState_defaults.num_predict,
                if (data.savedsettings?.num_predict) {
                    state.values.num_predict = data.savedsettings.num_predict;
                }

                // repeat_last_n: chatState_defaults.repeat_last_n,
                if (data.savedsettings?.repeat_last_n) {
                    state.values.repeat_last_n =
                        data.savedsettings.repeat_last_n;
                }

                //repeat_penalty: chatState_defaults.repeat_penalty,
                if (data.savedsettings?.repeat_penalty) {
                    state.values.repeat_penalty =
                        data.savedsettings.repeat_penalty;
                }

                // seed: chatState_defaults.seed,
                if (data.savedsettings?.seed) {
                    state.values.seed = data.savedsettings.seed;
                }

                //tfs_z: chatState_defaults.tfs_z,
                if (data.savedsettings?.tfs_z) {
                    state.values.tfs_z = data.savedsettings.tfs_z;
                }
            }

            // so we preserve the loaded state if we try to save it, even
            // if we don't support all the settings
            state.loadedKoboldState = data;

            return state;
        });
    }

    function loadPresetFromFile() {
        console.log('Loading preset from file');

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = JSON.parse(e.target.result);
                console.log('Loaded preset:', data);
                $chatState.stateFilename = file.name;
                _onHaveLoadedKobold(data);
            };
            reader.readAsText(file);
        };
        input.click();
    }

    function savePresetToFile() {
        console.log('Saving preset to file');
        const data = {
            savedsettings: {
                model_name: $chatState.model_name,
                temperature: $chatState.values.temperature,
                top_k: $chatState.values.top_k,
                top_p: $chatState.values.top_p,
                rep_pen: $chatState.values.repeat_penalty,
                max_length: $chatState.values.max_length,
                max_context_length: $chatState.values.num_ctx,
                repeat_last_n: $chatState.values.repeat_last_n,
                mirostat: $chatState.values.mirostat,
                mirostat_eta: $chatState.values.mirostat_eta,
                mirostat_tau: $chatState.values.mirostat_tau,
                num_predict: $chatState.values.num_predict,
                repeat_last_n: $chatState.values.repeat_last_n,
                repeat_penalty: $chatState.values.repeat_penalty,
                seed: $chatState.values.seed,
                tfs_z: $chatState.values.tfs_z
            },
            memory: $chatState.system_prompt
        };

        // deep merge $chatState.loadedKoboldState with this data object

        const merged_data = mergeDeep(
            $chatState?.loadedKoboldState || {},
            data
        );

        console.debug('Merged data:', merged_data);

        // use a "Save As" dialogue to allow user to save the file to a filename
        // of their choosing

        const blob = new Blob([JSON.stringify(merged_data)], {
            type: 'application/json'
        });

        saveAs(blob, $chatState.stateFilename || 'untitled.json');

        // const url = URL.createObjectURL(blob);
        // const a = document.createElement('a');
        // a.href = url;
        // a.download = $chatState.stateFilename || 'kobold_state.json';
        // a.click();
        // URL.revokeObjectURL(url);
    }
</script>

<!-- ----------------------------------------------------------------------- -->

<div id="Presets" class="w-full h-full text-primary">
    <div class="pb-4 text-3xl">Presets</div>

    <div class="flex">
        <Button onClick={loadPresetFromFile} title="Load preset from file">
            Load
        </Button>
        <Button onClick={savePresetToFile} title="Save preset to file">
            Save
        </Button>
    </div>

    <!-- ---------------------- -->
    <!-- {@debug chatState} -->
    {#if $chatState}
        <!-- --------------- -->
        <div class="model-list flex flex-col">
            <LockLabelToggle bind:locked={lock_model}>Model</LockLabelToggle>
            <div class="row flex">
                <ModelList />
            </div>
        </div>

        <!-- --------------- -->
        <LockLabelToggle bind:locked={lock_system}
            >System Prompt</LockLabelToggle
        >

        <Presets__TextArea bind:value={$chatState.system_prompt} />

        <!-- --------------- -->
        <LockLabelToggle bind:locked={lock_template}>Template</LockLabelToggle>
        <Presets__TextArea bind:value={$chatState.template} />

        <!-- --------------- -->
        <div class="chat-values">
            <LockLabelToggle bind:locked={lock_values}>Values</LockLabelToggle>
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
            background-color: var(--core-color-darker2);
            color: var(--accent-color);
            border: none;
            padding: 0.5em;
        }
    }
</style>
