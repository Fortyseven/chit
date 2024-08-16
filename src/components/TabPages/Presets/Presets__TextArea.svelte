<script>
    import { chatState } from '$stores/chatState';
    import SYSTEM_PROMPTS from '../../../preset-prompts';

    export let value;

    let selectEl = undefined;

    let previous_prompt_key = '';

    function usePrompt() {
        let selected_prompt_key = selectEl.value;

        if (!selected_prompt_key) {
            previous_prompt_key = '';
            return;
        }

        if (
            !previous_prompt_key ||
            previous_prompt_key != selected_prompt_key
        ) {
            if (
                confirm(
                    'Are you sure you want to use this system prompt? This will overwrite your current prompt.'
                )
            ) {
                previous_prompt_key = selected_prompt_key;
                if (selected_prompt_key) {
                    $chatState.system_prompt =
                        SYSTEM_PROMPTS[selected_prompt_key].prompt;
                }
            } else {
                selectEl.value = previous_prompt_key;
            }
        }
    }
</script>

<div class="textarea-wrapper">
    <textarea
        bind:value
        placeholder="None"
        on:input={() => (selectEl.value = '')}
        class="bg-core-color-darker2 text-accent-color-lighter2"
        {...$$restProps}
    />

    <select on:change={usePrompt} bind:this={selectEl} class="mt-4">
        <option value="">Custom</option>
        {#each Object.keys(SYSTEM_PROMPTS) as key}
            <option value={key}>{SYSTEM_PROMPTS[key].name}</option>
        {/each}
    </select>
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
</style>
