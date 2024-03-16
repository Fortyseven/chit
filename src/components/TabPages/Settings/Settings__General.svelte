<script>
    import {
        appState,
        DEFAULT_OL_ENDPOINT,
        DEFAULT_PB_ENDPOINT
    } from '$stores/stores';
</script>

<fieldset>
    <legend>General</legend>
    <div>
        <div>
            <label
                for="api-endpoint"
                on:dblclick={() => {
                    $appState.apiEndpoint = DEFAULT_OL_ENDPOINT;
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
        <div>
            <label
                for="pb-endpoint"
                on:dblclick={() => {
                    $appState.pbEndpoint = DEFAULT_PB_ENDPOINT;
                }}
            >
                PocketBase Endpoint <small>(Optional)</small>
            </label>
            <input
                type="text"
                bind:value={$appState.pbEndpoint}
                placeholder="API Endpoint..."
            />
        </div>
    </div>
</fieldset>

<style lang="scss">
    fieldset {
        > div {
            display: flex;
            flex-direction: column;
            margin-bottom: 1em;
            gap: 1em;
            > div {
                display: flex;

                label {
                    display: block;
                    flex: 0 0 300px;
                    margin-bottom: 0.5em;
                    padding: 0;
                }

                input {
                    flex: auto;
                    display: block;
                    padding: 0.5em;
                    border-radius: 5px;
                    border: 1px solid var(--color-primary);
                    font-family: monospace;
                }
            }
        }
    }
</style>
