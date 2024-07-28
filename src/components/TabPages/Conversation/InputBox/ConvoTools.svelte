<script lang="ts">
    import { Copy } from 'carbon-icons-svelte';
    import {
        pendingContinuedAssistantChat,
        responseInProgress,
        wasAborted
    } from '$lib/api/api';
    import { chatState } from '$stores/chatState';
    import { chatTimeline } from '$stores/stores';

    function copyChatToClipboard() {
        const chatText = $chatTimeline
            // .slice($chatState.system_prompt_id === 'general' ? 0 : 1)
            .map(({ role, content }) => {
                if (role === 'user') {
                    return '> ' + content;
                } else {
                    return content;
                }
            })
            .join('\n\n---------------------------\n\n');

        navigator.clipboard.writeText(chatText);
    }
</script>

<div class="p-2 flex place-content-end gap-4">
    <button
        class="button rounded-md disabled:opacity-0.25"
        on:click={copyChatToClipboard}
        disabled={$responseInProgress}
    >
        <Copy /> Copy Chat
    </button>
</div>

<style lang="scss">
    button {
        // padding-inline: 0.5rem;
        // background-color: var(--accent-color-darker5);
        display: flex;
        align-items: center;
        gap: 0.5rem /* 8px */;
        opacity: 0.75;
        transition: opacity 0.2s;
        &:hover {
            opacity: 1;
        }
    }
</style>
