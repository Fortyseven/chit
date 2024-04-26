<script>
    import {
        appState,
        DEFAULT_OL_ENDPOINT,
        DEFAULT_PB_ENDPOINT
    } from '$stores/stores';
    import SettingControl from './UI/SettingControl.svelte';
    import SettingGroup from './UI/SettingGroup.svelte';

    let pbAdminLink = '';

    $: {
        try {
            pbAdminLink = new URL(`_/`, $appState?.pbEndpoint);
        } catch (e) {
            pbAdminLink = '';
        }
    }
</script>

<SettingGroup name="General">
    <SettingControl
        defaultValue={DEFAULT_OL_ENDPOINT}
        bind:value={$appState.apiEndpoint}
        label="API Endpoint"
        placeholder="API Endpoint..."
    />
</SettingGroup>
