<script>
    import { chat_state } from '$stores/chat_state';
    import { inputText } from '$stores/stores';

    $: overflow =
        $inputText.length + $chat_state.system_prompt.length >=
        $chat_state.values.num_ctx;
</script>

<div class="bg-black text-white text-center">
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label>User:</label>
    {$inputText.length} | <label>System:</label>
    {$chat_state.system_prompt.length} | <label>Total:</label>
    <span class:overflow>
        {$inputText.length + $chat_state.system_prompt.length} /
        {$chat_state.values.num_ctx}</span
    >
</div>
