<script>
    import MenuBarButton from './UI/MenuBar__Button.svelte';
    import MenuBarCustomButton from './UI/MenuBar__CustomButton.svelte';
</script>

<div id="MenuBar" class="w-full h-full bg-core-color">
    <!-- <TabBar /> -->
    <div class="flex flex-col h-full gap-4 p-4">
        <MenuBarButton icon="message" label="Presets" menuId="presets" />
        <span class="block xl:hidden">
            <MenuBarButton icon="table" label="Variables" menuId="variables" />
        </span>
        <MenuBarButton icon="settings" label="Settings" menuId="settings" />
        <MenuBarCustomButton
            emoji="☢"
            label="Nuke"
            onclick={() =>
                confirm('Kill localStorage?') && window.localStorage.clear()}
        />
    </div>
</div>

<style lang="scss">
    #MenuBar {
        display: inline-block;
    }
</style>
