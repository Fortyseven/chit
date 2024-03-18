<script>
    import Settings__General from './Settings__General.svelte';
    import Settings__Appearance from './Settings__Appearance.svelte';
</script>

<div class="settings">
    <Settings__General />
    <!-- <Settings__ImportExport /> -->
    <Settings__Appearance />
    <div class="note">
        Double click on field labels to reset to default values where
        applicable. (This is true throughout the app.)
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
