<script>
    import { updateModelDetails } from '$lib/api/api';
    import { appState, defaultModelName } from '$stores/stores';
    import { chatState } from '$stores/chatState';

    import Icon from '../../../UI/Icon.svelte';

    function onMakeDefault() {
        $defaultModelName = $chatState.model_name;
    }

    async function onModelLoadDefaults() {
        if (confirm('Are you sure you want to load the default values?')) {
            if (!$appState.ui.lock_system && $chatState.system_prompt) {
                if (
                    !confirm(
                        'This will likely overwrite the unlocked system prompt -- ARE YOU SURE?'
                    )
                ) {
                    return;
                }
            }
            await updateModelDetails($chatState.model_name);
        }
    }
</script>

<div class="control-container">
    <button
        class="button is-primary"
        on:click={onModelLoadDefaults}
        title="Load Modelfile Defaults"
        disabled={!$chatState.model_name}
    >
        <Icon icon="circle-arrow-down" />
    </button>
</div>

<style lang="scss">
    .control-container {
        flex: auto;
        display: flex;
        flex-direction: row;
        gap: 0.5em;
    }

    .button {
        width: 1em;
    }
</style>
