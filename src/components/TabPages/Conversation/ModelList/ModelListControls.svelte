<script>
    import { defaultModelName, currentModel } from '$stores/stores';

    import Icon from '../../../UI/Icon.svelte';

    function onMakeDefault() {
        $defaultModelName = $currentModel.name;
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
    <!-- <button class="button is-primary" on:click={onMakeDefault}>
        <Icon icon="document" label="Save Chat" />
    </button> -->
</div>

<style lang="scss">
    .control-container {
        display: flex;
        flex-direction: row;
        gap: 0.5em;
    }

    .button {
        width: 100%;
    }
</style>
