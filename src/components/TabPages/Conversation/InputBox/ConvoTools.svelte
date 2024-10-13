<script>
    import { Copy } from 'carbon-icons-svelte';
    import {
        pendingContinuedAssistantChat,
        responseInProgress,
        wasAborted
    } from '$lib/api/api';
    import { chatTimeline } from '$stores/stores';

    import { followUpType, getFollowUps } from './ConvoTools.store';

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

<div class="h-12 p-2 flex gap-4">
    <div class="flex-auto grid place-content-start">
        <label
            title="Generate follow-up response suggestions. This may be slow if the model is too big."
        >
            <input type="checkbox" bind:checked={$getFollowUps} />
            Follow-ups
            <select
                bind:value={$followUpType}
                disabled={!$getFollowUps}
                style:opacity={!$getFollowUps ? '0.25' : '1'}
            >
                <option selected value="questions">Questions</option>
                <option value="rp_choices">Story Choices</option>
            </select>
        </label>
    </div>
    <div class="flex-auto grid place-content-end">
        {#if true || (!$responseInProgress && $chatTimeline.length > 0)}
            <button
                class="button rounded-md disabled:opacity-0.25"
                on:click={copyChatToClipboard}
            >
                <Copy /> Copy Chat
            </button>
        {/if}
    </div>
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
    label {
        opacity: 0.75;
    }
</style>
