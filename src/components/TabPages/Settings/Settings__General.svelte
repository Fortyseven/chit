<script>
    import { appState, DEFAULT_OL_ENDPOINT } from '$stores/stores';
    import SettingControl from './UI/SettingControl.svelte';
    import SettingGroup from './UI/SettingGroup.svelte';
</script>

<SettingGroup name="General">
    <SettingControl
        defaultValue={DEFAULT_OL_ENDPOINT}
        bind:value={$appState.apiEndpoint}
        label="API Endpoint"
        placeholder="API Endpoint..."
    />
</SettingGroup>
