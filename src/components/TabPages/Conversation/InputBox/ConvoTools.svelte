<script>
    import { Copy, PaintBrush } from 'carbon-icons-svelte';
    import { responseInProgress } from '$lib/api/api';
    import { chatTimeline } from '$stores/stores';
    import { concatenateEntries } from '$src/utils.js';

    import {
        followAutoSubmit,
        followUpType,
        getFollowUps
    } from './ConvoTools.store';
    import { systemPromptTemplated } from '$stores/templates';
    import { chatState } from '$stores/chatState';
    import { ollama } from '$lib/api/ollama';
    import Dialog from '$components/UI/Dialog.svelte';

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

    let showArtPrompt = false;
    let artPromptText = '';

    async function generateArtPrompt(isreload = false) {
        const SPROMPT =
            'Write a single detailed paragraph visually describing the current moment in a way that can be processed bv an AI art generator. Describe the composition and details using vivid language.  Only respond with the paragraph.';

        const lastResponse = concatenateEntries([
            ...$chatTimeline,
            { role: 'USER', content: `[${SPROMPT}]` }
        ]);

        let response = await ollama().generate({
            model: $chatState.model_name,
            prompt: lastResponse,

            options: {
                temperature: 0.8,
                // if we don't use the current context size
                // we may incur a penalty as ollama readjusts
                // to the new size; and then the user gets hit
                // with another as it returns to their existing
                // one; so just use what we have
                num_ctx: parseInt($chatState.values.num_ctx || 2048)
            }
        });

        if (!isreload) {
            showArtPrompt = true;
        }
        artPromptText = response.response;
    }
</script>

{#if showArtPrompt}
    <Dialog
        onClose={() => (showArtPrompt = false)}
        onCopy={() => {
            navigator.clipboard.writeText(artPromptText);
            console.log('Copied to clipboard');
        }}
        onReload={async () => {
            await generateArtPrompt(true);
        }}
        title="Art Prompt"
    >
        <p>{artPromptText}</p>
    </Dialog>
{/if}

<div class="h-12 p-2 flex gap-4">
    <div class="flex-auto flex items-center gap-3 place-content-start">
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
        <label>
            <input
                type="checkbox"
                bind:checked={$followAutoSubmit}
                disabled={!$getFollowUps}
            />
            Auto-submit
        </label>
    </div>
    <div class="flex-auto flex gap-3 place-content-end">
        <button
            class="button rounded-md disabled:opacity-0.25"
            on:click={async () => await generateArtPrompt()}
        >
            <PaintBrush /> Art Prompt
        </button>
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
        font-weight: bold;
        &:hover {
            opacity: 1;
        }
    }
    label {
        opacity: 0.75;
        font-weight: bold;
    }
</style>
