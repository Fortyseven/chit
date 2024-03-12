<script>
    import { updateModelDetails } from '$lib/api/api';
    import { defaultModelName } from '$stores/stores';
    import { chat_state } from '$stores/chat_state';

    import Icon from '../../../UI/Icon.svelte';

    function onMakeDefault() {
        $defaultModelName = $chat_state.model_name;
    }

    async function onModelLoadDefaults() {
        if (confirm('Are you sure you want to load the default values?')) {
            await updateModelDetails($chat_state.model_name);
        }
    }
</script>

<div class="control-container">
    <button
        class="button is-primary"
        on:click={onMakeDefault}
        title="Set As Default"
    >
        <Icon icon="favorite" />
    </button>
    <button
        class="button is-primary"
        on:click={onModelLoadDefaults}
        title="Load Modelfile Defaults"
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
