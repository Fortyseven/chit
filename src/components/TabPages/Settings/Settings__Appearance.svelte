<script>
    import { appState } from '$stores/stores';
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
                bind:checked={$appState.ui.constrainChatWidth}
            />
        </label>
    </div>
</fieldset>

<style lang="scss">
    fieldset {
        color: white;
        > div {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 1em;
            gap: 1em;
        }
    }
</style>
