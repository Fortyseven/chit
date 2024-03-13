<script>
    import { chat_state } from '$stores/chat_state';
    import { inputText } from '$stores/stores';
</script>

<div class="status-bar">
    <label>User:</label>
    {$inputText.length} | <label>System:</label>
    {$chat_state.system_prompt.length} | <label>Total:</label>
    <span
        class:overflow={$inputText.length + $chat_state.system_prompt.length >=
            $chat_state.values.num_ctx}
    >
        {$inputText.length + $chat_state.system_prompt.length} /
        {$chat_state.values.num_ctx}</span
    >
</div>

<style lang="scss">
    .status-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 0.5em;
        background-color: #0008;
        font-family: monospace;
        color: white;
        font-size: 0.9em;
        line-height: 1em;
        text-align: center;
        width: 100%;
        label {
            font-weight: bold;
        }
        .overflow {
            color: #f00;
            font-weight: bold;
        }
    }
</style>
