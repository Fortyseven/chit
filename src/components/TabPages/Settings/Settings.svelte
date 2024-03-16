<script>
    import Settings__General from './Settings__General.svelte';
    import Settings__ImportExport from './Settings__ImportExport.svelte';
    import Settings__UI from './Settings__UI.svelte';
</script>

<div class="settings">
    <Settings__General />
    <Settings__ImportExport />
    <Settings__UI />
    <div class="note">
        Double click on field labels to reset to default values where
        applicable. (This is true throughout the app.)
    </div>
</div>

<style lang="scss">
    .settings {
        width: 100%;
        max-width: 1280px;
        margin: auto;

        .note {
            text-align: center;
            font-size: 0.9em;
        }
    }
</style>
