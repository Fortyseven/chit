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
    fieldset {
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 1em;
        margin-bottom: 1em;
        legend {
            font-size: 1.25em;
            font-weight: bold;
            padding: 0 0.5em;
        }
    }

    label,
    input {
        padding: 0.25em 0.5em;
    }
</style>
