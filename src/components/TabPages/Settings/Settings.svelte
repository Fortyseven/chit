<script>
    import Settings__General from './Settings__General.svelte';
    import Settings__Appearance from './Settings__Appearance.svelte';
    import Settings__Footer from './Settings__Footer.svelte';
</script>

<div class="settings h-full">
    <div class="flex flex-col h-full">
        <div><h1 class="text-primary pb-4 text-3xl">Settings</h1></div>
        <div class="flex-none">
            <Settings__General />
        </div>
        <div class="flex-none">
            <Settings__Appearance />
        </div>
        <div class="note flex-grow">
            Double click on field labels to reset to default values where
            applicable. (This is true throughout the app.)
        </div>
        <div clss="flex-none">
            <Settings__Footer />
        </div>
    </div>
</div>

<style lang="scss">
    .settings {
        width: 100%;
        margin: auto;

        .note {
            text-align: center;
            font-size: 0.9em;
        }
    }
</style>
