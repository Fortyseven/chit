<script>
    import { chatState } from '$stores/chatState';
    import { appState } from '$stores/stores';
    import { ArrowUpLeft, TextNewLine } from 'carbon-icons-svelte';

    let saved_prompt = undefined;

    function saveMemory() {
        saved_prompt = $chatState.system_prompt;
    }

    function restoreMemory(ev) {
        if (ev.ctrlKey) {
            saved_prompt = undefined;
            return;
        }
        if (saved_prompt) {
            $chatState.system_prompt = saved_prompt;
        }
    }
</script>

<div class="flex gap-2 h-full">
    <button
        class="grid-cols-1"
        on:click={saveMemory}
        title="Temporarily store system prompt"><TextNewLine /></button
    >
    <button
        class="grid-cols-1"
        on:click={restoreMemory}
        title={saved_prompt?.slice(0, 20) + '...'}
        disabled={!saved_prompt || $appState.ui.lock_system}
        ><ArrowUpLeft /></button
    >
</div>

<style lang="scss">
    button {
        @apply transition-all;
        @apply duration-300;
        @apply rounded-md;

        display: grid;
        place-content: center;
        place-items: center;

        background-color: var(--accent-color-darker3);

        flex: auto;

        &:disabled {
            opacity: 0.5;
        }
        &:hover {
            opacity: 0.5;
        }
    }
</style>
