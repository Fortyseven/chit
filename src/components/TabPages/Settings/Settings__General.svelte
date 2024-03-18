<script>
    import {
        appState,
        DEFAULT_OL_ENDPOINT,
        DEFAULT_PB_ENDPOINT
    } from '$stores/stores';
    import SettingControl from './UI/SettingControl.svelte';

    let pbAdminLink = '';

    $: {
        try {
            pbAdminLink = new URL(`_/`, $appState?.pbEndpoint);
        } catch (e) {
            pbAdminLink = '';
        }
    }
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
            supplementalUrl={pbAdminLink || ''}
            supplementalUrlName="Admin"
        />
    </div>
</fieldset>

<style lang="scss">
    fieldset {
        color: white;
        > div {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 1em;
            gap: 1em;
        }
    }
</style>
