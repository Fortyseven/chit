<script>
    import { onMount } from 'svelte';
    import { responseInProgress } from '$lib/api/api';
    import {
        getFollowUps,
        followUpSuggestions,
        isLoadingFollowups
    } from '../InputBox/ConvoTools.store.js';
    import { chatTimeline } from '$stores/stores';
    import { chatState } from '$stores/chatState';

    import { ollama } from '../../../../lib/api/ollama.js';

    import Loading from '../../../UI/Loading.svelte';
    import { scrollToBottom } from '$lib/chat';

    const PROMPT_FOLLOWUP = `You will be provided with an AI assistant's response. Generate a JSON array of 4 suggested follow-up queries written from the user's perspective..

For example, follow-up queries might be among:
- "Tell me more about..."
- "What is..."
- "Rewrite that response in a more professional tone..."
- "Why does..."
- "Does it say..."

Only respond with valid JSON in this format: ["suggestion", "suggestion2"]`;

    async function regenerateFollowUps() {
        const lastResponse = $chatTimeline[$chatTimeline.length - 1]?.content;

        try {
            $followUpSuggestions = [];
            $isLoadingFollowups = true;

            let { response } = await ollama().generate({
                model: 'llama3.1:latest',
                prompt: lastResponse,
                system: PROMPT_FOLLOWUP,
                // format: 'json',
                options: {
                    temperature: 0.8,
                    // if we don't use the current context size
                    // we may incur a penalty as ollama readjusts
                    // to the new size; and then the user gets hit
                    // with another as it returns to their existing
                    // one; so just use what we have
                    num_ctx: $chatState.values.num_ctx
                }
            });

            console.log('JSON:', response);

            try {
                const parsed = JSON.parse(response);
                if (Array.isArray(parsed)) {
                    parsed.sort();

                    $followUpSuggestions = parsed;
                } else {
                    $followUpSuggestions = [];
                }
            } catch (e) {
                console.warn('LLM returned malformed json response');
            }
        } finally {
            $isLoadingFollowups = false;
            setTimeout(() => {
                scrollToBottom();
            }, 100);
        }
    }

    onMount(() => {
        scrollToBottom();
        responseInProgress.subscribe((value) => {
            if (value == false && $getFollowUps && !$isLoadingFollowups) {
                console.log('regenerating followups');
                regenerateFollowUps();
            }
        });
        // regenerateFollowUps();
    });
</script>

<div>
    <div class="grid grid-cols-2 gap-3 m-auto mr-6">
        {#if $isLoadingFollowups}
            <div class="w-full col-span-2">
                <Loading />
            </div>
        {:else}
            {#each $followUpSuggestions as sug}
                <div class="suggestion-entry text-center">
                    <button>{sug}</button>
                </div>
            {/each}
        {/if}
    </div>
</div>

<style lang="scss">
    .suggestion-entry {
        font-size: 0.9em;
        button {
            font-family: var(--font-primary-condensed);
            border: 1px solid $accent-color-darker5;
            border-radius: 10px;
            padding: 0.25em 1em;
            color: $accent-color-darker1;
            width: 100%;
            height: 4em;
            transition: all 0.15s;
            // opacity: 0.75;
            &:hover {
                // background-color: $accent-color-darker5;
                // color: white;
                opacity: 1;
                border-color: $accent-color;
                color: $accent-color-lighter1;
            }
        }
    }
</style>
