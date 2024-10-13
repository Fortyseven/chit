<script>
    import { getContext, onDestroy, onMount } from 'svelte';
    import { ollama } from '../../../../lib/api/ollama.js';

    import { chatTimeline, inputText } from '$stores/stores';
    import { chatState } from '$stores/chatState';

    import Loading from '../../../UI/Loading.svelte';
    import { scrollToBottom } from '$lib/chat';
    import {
        followUpSuggestions,
        isLoadingFollowups
    } from '../InputBox/ConvoTools.store.js';

    /* ----------------------------------------------------------*/

    const MAX_RETRIES = 3;
    const PROMPT_FOLLOWUP = `You will be provided with a chat fragment between a user and an assistant. Generate a JSON array of 4 suggested follow-up queries written from the user's perspective..

For example, follow-up queries might be among:
- "Tell me more about..."
- "What is..."
- "Rewrite that response in a more professional tone..."
- "Why does..."
- "Does it say..."

Only respond with valid JSON in this format: ["suggestion", "suggestion2"]`;

    /* ----------------------------------------------------------*/

    async function _getFollowUps(lastResponse, called_by = undefined) {
        console.debug('🔁 Generating followups...');

        let response = await ollama().generate({
            model: 'llama3.2:latest',
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
                num_ctx: $chatState.values.num_ctx || 2048
            }
        });

        response = response.response;

        try {
            const parsed = JSON.parse(response);
            if (Array.isArray(parsed) && parsed.length > 0) {
                parsed.sort();
                // console.log('🟢 LLM returned followups:', parsed);
                return parsed;
            } else {
                console.error(
                    '🛑 LLM returned malformed json response; retrying'
                );
                return null;
            }
        } catch (e) {}
    }

    /* ----------------------------------------------------------*/
    let isRegenerating = false;

    async function regenerateFollowUps(called_by = undefined) {
        if (isRegenerating) {
            console.log('🛑 Already regenerating followups');
            return;
        }

        if ($chatTimeline.length < 2) {
            console.log('🛑 Not enough chat history to generate followups');
            return;
        }

        const lastResponse =
            `USER: ${$chatTimeline[$chatTimeline.length - 2]?.content}\n\n` +
            `ASSISTANT: ${$chatTimeline[$chatTimeline.length - 1]?.content}`;

        let retries = MAX_RETRIES;

        let suggestions = [];

        try {
            while (retries > 0) {
                $followUpSuggestions = [];
                $isLoadingFollowups = true;
                suggestions = await _getFollowUps(lastResponse, called_by);
                if (suggestions) {
                    // successful
                    $followUpSuggestions = suggestions;
                    return;
                }
                retries--;
            }
        } finally {
            $isLoadingFollowups = false;
            isRegenerating = false;

            setTimeout(() => {
                scrollToBottom();
            }, 100);
        }

        // we failed

        $followUpSuggestions = [];
        console.error(
            `Couldn't generate followups after ${MAX_RETRIES} tries; model may be too dumb.`
        );
    }

    function useSuggestion(suggestion) {
        $inputText = suggestion;
    }

    /* ----------------------------------------------------------*/
    const eventBusContext = getContext('event-bus');
    let eventBusContextHandler = undefined;

    onMount(() => {
        eventBusContextHandler = eventBusContext.subscribe(async (ev) => {
            if (ev && ev.name === 'onResponseComplete') {
                // console.log('⭐ FollowUps event-bus RECEIVED EVENT:', ev.name);
                if (!$isLoadingFollowups)
                    await regenerateFollowUps(
                        'subscribed-event-bus-onResponseComplete'
                    );
            }
        });
        scrollToBottom();
    });

    onDestroy(() => {
        if (eventBusContextHandler) {
            eventBusContextHandler();
        }
    });
</script>

<div>
    {#if $isLoadingFollowups}
        <Loading />
    {:else if $followUpSuggestions?.length > 0}
        <div class="grid grid-cols-2 gap-3">
            {#each $followUpSuggestions as sug}
                <div class="suggestion-entry">
                    <button class="w-full" on:click={() => useSuggestion(sug)}
                        >{sug}</button
                    >
                </div>
            {/each}
        </div>
    {:else}
        <div class="fail flex">
            <div class="w-full col-span-2">
                <div>Failed to generate follow-ups.</div>
                <button class="retry" on:click={regenerateFollowUps}>
                    Retry
                </button>
            </div>
        </div>
    {/if}
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
            min-height: 4em;
            transition: all 0.15s;
            line-height: 1.2;

            &:hover {
                opacity: 1;
                border-color: $accent-color;
                color: $accent-color-lighter1;
            }
        }
    }
    .fail {
        opacity: 0.25;
        text-align: center;
        div {
            margin-bottom: 1em;
        }
        button.retry {
            @apply transition-all;
            @apply duration-300;
            @apply rounded-md;

            padding-inline: 1em;

            background-color: var(--accent-color-darker3);

            flex: auto;
            &:disabled {
                opacity: 0.5;
            }
            &:hover {
                opacity: 0.5;
            }
        }
    }
</style>
