<script>
    import { onMount } from 'svelte';

    import { chatState } from '$stores/chatState';
    import { appState } from '$stores/stores';

    import Presets__TextArea from './Presets__TextArea.svelte';
    import ModelList from '../Conversation/ModelList/ModelList.svelte';
    import Button from '$components/UI/Button.svelte';
    import { mergeDeep } from '$lib/utils';

    import { saveAs } from '../../../lib/vendor/FileSaver.min.js';
    import LockLabelToggle from '$components/UI/LockLabelToggle.svelte';
    import PresetFilename from './PresetFilename.svelte';

    onMount(async () => {
        $chatState.loadedKoboldState = undefined;
    });

    function _onHaveLoadedKobold(data) {
        if (
            $appState.ui.lock_template &&
            $appState.ui.lock_system &&
            $appState.ui.lock_model &&
            $appState.ui.lock_values
        ) {
            console.warn('All settings are locked, aborted by default');
            return;
        }

        chatState.update((state) => {
            if (!$appState.ui.lock_model) {
                if (data.savedsettings?.model_name) {
                    state.model_name = data.savedsettings.model_name;
                }
            }

            if (!$appState.ui.lock_system) {
                if (data?.memory) {
                    state.system_prompt = data.memory;

                    // $appState.ui.lock_system = true;
                }
            }

            if (!$appState.ui.lock_values) {
                if (data.savedsettings?.temperature) {
                    state.values.temperature = data.savedsettings.temperature;
                }

                if (data.savedsettings?.top_k) {
                    state.values.top_k = data.savedsettings.top_k;
                }

                if (data.savedsettings?.top_p) {
                    state.values.top_p = data.savedsettings.top_p;
                }
                if (data.savedsettings?.rep_pen) {
                    state.values.repeat_penalty = data.savedsettings.rep_pen;
                }

                if (data.savedsettings?.num_predict) {
                    state.values.num_predict = data.savedsettings.num_predict;
                } else if (data.savedsettings?.max_length) {
                    state.values.num_predict = data.savedsettings.max_length;
                }

                if (data.savedsettings?.num_ctx) {
                    state.values.num_ctx = data.savedsettings.num_ctx;
                } else if (data.savedsettings?.max_context_length) {
                    state.values.num_ctx =
                        data.savedsettings.max_context_length;
                }

                // end native kobold settings

                if (data.savedsettings?.repeat_last_n) {
                    state.values.repeat_last_n =
                        data.savedsettings.repeat_last_n;
                }

                if (data.savedsettings?.mirostat) {
                    state.values.mirostat = data.savedsettings.mirostat;
                }

                if (data.savedsettings?.mirostat_eta) {
                    state.values.mirostat_eta = data.savedsettings.mirostat_eta;
                }

                if (data.savedsettings?.mirostat_tau) {
                    state.values.mirostat_tau = data.savedsettings.mirostat_tau;
                }

                if (data.savedsettings?.num_predict) {
                    state.values.num_predict = data.savedsettings.num_predict;
                }

                if (data.savedsettings?.repeat_last_n) {
                    state.values.repeat_last_n =
                        data.savedsettings.repeat_last_n;
                }

                if (data.savedsettings?.repeat_penalty) {
                    state.values.repeat_penalty =
                        data.savedsettings.repeat_penalty;
                }

                if (data.savedsettings?.seed) {
                    state.values.seed = data.savedsettings.seed;
                }

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
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = JSON.parse(e.target.result);
                $chatState.stateFilename = file.name;
                _onHaveLoadedKobold(data);
            };
            reader.readAsText(file);
        };
        input.click();
    }

    function savePresetToFile() {
        const data = {
            savedsettings: {
                model_name: $chatState.model_name,
                temperature: $chatState.values.temperature,
                top_k: $chatState.values.top_k,
                top_p: $chatState.values.top_p,
                rep_pen: $chatState.values.repeat_penalty,
                num_predict: $chatState.values.num_predict,
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

        // use a "Save As" dialogue to allow user to save the file to a filename
        // of their choosing

        const blob = new Blob([JSON.stringify(merged_data)], {
            type: 'application/json'
        });

        saveAs(blob, $chatState.stateFilename || 'untitled.json');
    }

    function onBlurValue(key) {
        if (key == 'num_ctx') {
            if ($chatState.values.num_ctx <= 1024) {
                $chatState.values.num_ctx *= 1024;
            }
        }
    }
</script>

<!-- ----------------------------------------------------------------------- -->

<div id="Presets" class="w-full h-full text-primary">
    <div class="pb-4 text-3xl">Preset: <PresetFilename /></div>

    <div class="flex">
        <Button onClick={loadPresetFromFile} title="Load preset from file">
            Load
        </Button>
        <Button onClick={savePresetToFile} title="Save preset to file">
            Save
        </Button>
    </div>

    <!-- ---------------------- -->

    {#if $chatState}
        <!-- --------------- -->

        <div class="model-list flex flex-col">
            <LockLabelToggle bind:locked={$appState.ui.lock_model}>
                Model
            </LockLabelToggle>
            <div class="row flex">
                <ModelList />
            </div>
        </div>

        <!-- --------------- -->
        <LockLabelToggle bind:locked={$appState.ui.lock_system}>
            System Prompt
        </LockLabelToggle>

        <Presets__TextArea
            bind:value={$chatState.system_prompt}
            style="height:30em"
        />

        <!-- --------------- -->
        <div class="chat-values">
            <LockLabelToggle bind:locked={$appState.ui.lock_values}>
                Values
            </LockLabelToggle>
            {#if $chatState.values}
                <ul>
                    {#each Object.keys($chatState.values) as key}
                        <li>
                            <label>{key}</label>
                            <input
                                bind:value={$chatState.values[key]}
                                on:blur={() => onBlurValue(key)}
                            />
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
            display: grid;
            grid-template-columns: 1fr 1fr;
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
                text-transform: capitalize;
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
