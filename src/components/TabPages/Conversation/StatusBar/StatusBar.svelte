<script>
    import { chatState } from '$stores/chatState';
    import { inputText } from '$stores/stores';

    $: overflow =
        $inputText.length + $chatState.system_prompt?.length >=
        $chatState.values.num_ctx;
</script>

<div class="bg-core-color-darker1 text-accent-color text-center">
    <label>User:</label>
    {$inputText.length} | <label>System:</label>
    {$chatState.system_prompt?.length} | <label>Total:</label>
    <span class:overflow>
        {$inputText.length + $chatState.system_prompt?.length} /
        {$chatState.values.num_ctx}</span
    >
</div>
