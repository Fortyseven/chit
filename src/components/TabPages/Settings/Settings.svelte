<script>
    import Settings__General from './Settings__General.svelte';
    import Settings__ImportExport from './Settings__ImportExport.svelte';

    import { appState, DEFAULT_API_ENDPOINT } from '$stores/stores';
</script>

<div class="settings">
    <Settings__General />
    <Settings__ImportExport />
</div>

<style lang="scss">
</style>
