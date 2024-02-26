<script>
    import { defaultModelName, currentModel } from '../../../stores/stores';
    import Icon from '../../UI/Icon.svelte';

    function onMakeDefault() {
        $defaultModelName = $currentModel.name;
    }
</script>

<div class="container">
    <button class="button is-primary" on:click={onMakeDefault}>
        <Icon icon="favorite" label="Set as Default" />
    </button>
    <button class="button is-primary" on:click={onMakeDefault}>
        <Icon icon="document" label="New Chat" />
    </button>
</div>

<style lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
    }

    .button {
    }
</style>
