<script>
    import PresetMemory from './PresetMemory.svelte';

    import { chatState } from '$stores/chatState';
    import SYSTEM_PROMPTS from '../../../preset-prompts';
    import { appState } from '$stores/stores';
    import { refreshTemplateVars, templateIncomplete } from '$stores/templates';

    export let value;

    let selectorEl = null;
    let previous_prompt_key = '';

    function setPrompt(prompt, selected_prompt_key) {
        previous_prompt_key = selected_prompt_key;
        $chatState.system_prompt =prompt;
        $appState.ui.system_prompt_modified = false;
        selectorEl.value = selected_prompt_key;
        $chatState.stateFilename = "untitled.json";
    }

    function usePrompt() {
        let selected_prompt_key = selectorEl.value;

        if (!selected_prompt_key) {
            previous_prompt_key = selected_prompt_key;
            return;
        }

        $appState.ui.selectedPresetId = selected_prompt_key;

        // don't bother asking for confirmation if the system prompt is empty
        if (!$chatState.system_prompt || !$appState.ui.system_prompt_modified) {
            setPrompt(SYSTEM_PROMPTS[selected_prompt_key].prompt, selected_prompt_key);
            return;
        }

        // is this is a different selection from the prior one?
        if (
            !previous_prompt_key ||
            previous_prompt_key != selected_prompt_key
        ) {
            if (
                confirm(
                    'Are you sure you want to use this system prompt? This will overwrite your current prompt.'
                )
            ) {
                if (selected_prompt_key) {
                    setPrompt(SYSTEM_PROMPTS[selected_prompt_key].prompt, selected_prompt_key);
                }
            } else {
                $appState.ui.selectedPresetId = previous_prompt_key;
            }
        }

        refreshTemplateVars();
    }

    appState.subscribe((state) => {
        if ($appState.ui.system_prompt_modified && selectorEl) {
            selectorEl.value = '';
        }
    });

    function modified() {
        $appState.ui.system_prompt_modified = true;
        refreshTemplateVars();
    }
</script>

<div class="textarea-wrapper">
    <textarea
        bind:value
        placeholder="None"
        on:input={modified}
        on:keyup={modified}
        on:focus={refreshTemplateVars}
        class="bg-core-color-darker2 text-accent-color-lighter2"
        class:template_incomplete={$templateIncomplete}
        {...$$restProps}
    />
    <div class="mt-4 grid grid-cols-6 gap-4 place-content-center">
        <select
            on:change={usePrompt}
            bind:this={selectorEl}
            class="col-span-5"
            disabled={$appState.ui.lock_system}
        >
            <option value="">Custom</option>
            {#each Object.keys(SYSTEM_PROMPTS) as key}
                <option value={key}>{SYSTEM_PROMPTS[key].name}</option>
            {/each}
        </select>
        <div class="col-span-1">
            <PresetMemory />
        </div>
    </div>
        <div class="grid place-content-end mt-4">
            <button
                class="w-fit px-2"
                on:click={() => {
                    $appState.ui.popout_variables =
                        !$appState.ui.popout_variables;
                }}
            >
                Variables
            </button>
        </div>
</div>

<style lang="scss">
    .textarea-wrapper {
        display: flex;
        flex-direction: column;

        textarea {
            border: none;
            border-radius: 10px;
            height: 6em;
            padding: 0.5em;
            outline: none;
        }
    }

    select:disabled {
        opacity: 0.25;
    }

    .template_incomplete {
        outline: 3px inset rgb(161, 0, 0) !important;
    }

    button {
        @apply transition-all;
        @apply duration-300;
        @apply rounded-md;

        display: grid;
        place-content: center;
        place-items: center;

        background-color: var(--accent-color-darker3);

        flex: auto;

        &:disabled {
            opacity: 0.5;
        }
        &:hover {
            opacity: 0.5;
        }
    }
</style>
