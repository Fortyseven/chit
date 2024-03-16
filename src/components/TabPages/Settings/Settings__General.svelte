<script>
    import {
        appState,
        DEFAULT_OL_ENDPOINT,
        DEFAULT_PB_ENDPOINT
    } from '$stores/stores';
    import SettingControl from './UI/SettingControl.svelte';

    $: pbAdminLink = new URL('_/', $appState.pbEndpoint);
</script>

<fieldset>
    <legend>General</legend>
    <div>
        <SettingControl
            defaultValue={DEFAULT_OL_ENDPOINT}
            bind:value={$appState.apiEndpoint}
            label="API Endpoint"
            placeholder="API Endpoint..."
        />
        <SettingControl
            defaultValue={DEFAULT_PB_ENDPOINT}
            bind:value={$appState.pbEndpoint}
            label="PocketBase Endpoint"
            placeholder="API Endpoint..."
            supplementalUrl={pbAdminLink}
            supplementalUrlName="Admin"
        />
    </div>
</fieldset>

<style lang="scss">
    fieldset {
        > div {
            display: grid;
            grid-template-columns: 1fr 1fr;
            margin-bottom: 1em;
            flex-wrap: wrap;
            gap: 1em;
        }
    }
</style>
