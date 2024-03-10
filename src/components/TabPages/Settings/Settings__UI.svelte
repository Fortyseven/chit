<script>
    import { DEFAULT_API_ENDPOINT } from '$stores/stores';
    import { appState } from '$stores/stores_ui';
</script>

<fieldset>
    <legend>Appearance</legend>
    <div>
        <label
            for="api-endpoint"
            title="Makes the chat timeline more readable at wider widths"
        >
            Constrain Chat Width
            <input
                type="checkbox"
                bind:checked={$appState.constrainChatWidth}
            />
        </label>
    </div>
</fieldset>

<style lang="scss">
</style>
