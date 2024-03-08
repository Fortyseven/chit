<script>
    import Icon from '/src/components/UI/Icon.svelte';
    import { appState, DEFAULT_API_ENDPOINT } from '$stores/stores';
</script>

<fieldset>
    <legend>Import/Export Everything</legend>
    <div>
        <button
            on:click={() => {
                console.log('Export Everything');
            }}
        >
            <Icon name="cloud-download" label="Export Everything" />
        </button>
        <button
            on:click={() => {
                console.log('Export Everything');
            }}
        >
            <Icon name="cloud-upload" label="Import Everything" />
        </button>
    </div>
</fieldset>

<style lang="scss">
</style>
