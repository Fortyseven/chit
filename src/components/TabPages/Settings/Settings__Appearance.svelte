<script>
    import { appState } from '$stores/stores';
    import SettingCheckbox from './UI/SettingCheckbox.svelte';
    import SettingGroup from './UI/SettingGroup.svelte';
</script>

<SettingGroup name="Appearance">
    <div>
        <SettingCheckbox bind:value={$appState.ui.constrainChatWidth}>
            Constrain Chat Width
        </SettingCheckbox>
    </div>
</SettingGroup>

<style lang="scss">
</style>
