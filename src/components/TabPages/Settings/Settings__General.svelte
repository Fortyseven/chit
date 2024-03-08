<script>
    import { appState, DEFAULT_API_ENDPOINT } from '$stores/stores';
</script>

<fieldset>
    <legend>General</legend>
    <div>
        <label
            for="api-endpoint"
            on:dblclick={() => {
                $appState.apiEndpoint = DEFAULT_API_ENDPOINT;
            }}
        >
            API Endpoint
        </label>
        <input
            type="text"
            bind:value={$appState.apiEndpoint}
            placeholder="API Endpoint..."
        />
    </div>
</fieldset>

<style lang="scss">
</style>
