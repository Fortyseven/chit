<script>
    import { appState } from '$stores/stores';
    import SettingCheckbox from './UI/SettingCheckbox.svelte';
    import SettingGroup from './UI/SettingGroup.svelte';
</script>

<SettingGroup name="Appearance">
    <div class="flex flex-row flex-wrap gap-4">
        <SettingCheckbox bind:value={$appState.ui.constrainChatWidth}>
            Constrain Chat Width
        </SettingCheckbox>
        <SettingCheckbox bind:value={$appState.ui.play_sounds}>
            Audio Notifications
        </SettingCheckbox>
    </div>
</SettingGroup>

<style lang="scss">
</style>
