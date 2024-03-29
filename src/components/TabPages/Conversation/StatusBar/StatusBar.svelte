<script>
    import { chatState } from '$stores/chatState';
    import { inputText } from '$stores/stores';

    $: overflow =
        $inputText.length + $chatState.system_prompt?.length >=
        $chatState.values.num_ctx;
</script>

<div class="bg-black text-white text-center">
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label>User:</label>
    {$inputText.length} | <label>System:</label>
    {$chatState.system_prompt?.length} | <label>Total:</label>
    <span class:overflow>
        {$inputText.length + $chatState.system_prompt?.length} /
        {$chatState.values.num_ctx}</span
    >
</div>
