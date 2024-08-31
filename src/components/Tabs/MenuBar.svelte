<script>
    import MenuBarButton from './UI/MenuBar__Button.svelte';
</script>

<div id="MenuBar" class="w-full h-full bg-core-color">
    <!-- <TabBar /> -->
    <div class="flex flex-col h-full gap-4 p-4">
        <MenuBarButton icon="message" label="Presets" menuId="presets" />
        <MenuBarButton icon="table" label="Variables" menuId="variables" />
        <MenuBarButton icon="settings" label="Settings" menuId="settings" />
    </div>
</div>

<style lang="scss">
    #MenuBar {
        display: inline-block;
    }
</style>
