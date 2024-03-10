<script>
    import Settings__General from './Settings__General.svelte';
    import Settings__ImportExport from './Settings__ImportExport.svelte';
    import Settings__UI from './Settings__UI.svelte';

    import { appState, DEFAULT_API_ENDPOINT } from '$stores/stores';
</script>

<div class="settings">
    <Settings__General />
    <Settings__ImportExport />
    <Settings__UI />
</div>

<style lang="scss">
</style>
