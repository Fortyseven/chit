<script>
    import { getContext, onMount } from 'svelte';
    import { ollama } from '../../../../lib/api/ollama.js';

    import { chatTimeline } from '$stores/stores';
    import { chatState } from '$stores/chatState';

    import Loading from '../../../UI/Loading.svelte';
    import { scrollToBottom } from '$lib/chat';

    let promise = undefined;

    const PROMPT_FOLLOWUP = `You will be provided with an AI assistant's response. Generate a JSON array of 4 suggested follow-up queries written from the user's perspective..

For example, follow-up queries might be among:
- "Tell me more about..."
- "What is..."
- "Rewrite that response in a more professional tone..."
- "Why does..."
- "Does it say..."

Only respond with valid JSON in this format: ["suggestion", "suggestion2"]`;

    async function _getFollowUps(lastResponse) {
        let response = await ollama().generate({
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
                num_ctx: $chatState.values.num_ctx || 2048
            }
        });

        response = response.response;

        try {
            const parsed = JSON.parse(response);
            if (Array.isArray(parsed) && parsed.length > 0) {
                parsed.sort();
                console.log('🟢 LLM returned followups:', parsed);
                return parsed;
            }
            // retries--;
        } catch (e) {
            throw '🛑 LLM returned malformed json response';
        }
    }

    async function regenerateFollowUps() {
        const lastResponse = $chatTimeline[$chatTimeline.length - 1]?.content;

        console.log('🔁 Regenerating followups for:', lastResponse);
        promise = await _getFollowUps(lastResponse);

        // let retries = 3;
        // console.info('regenerating followups for ', lastResponse, retries);

        // // while (retries > 0) {
        // try {
        //     $followUpSuggestions = [];
        //     $isLoadingFollowups = true;
        // } finally {
        //     $isLoadingFollowups = false;

        //     $followUpSuggestions = _getFollowUps(lastResponse);

        //     setTimeout(() => {
        //         scrollToBottom();
        //     }, 100);
        // }
        // }
        // // we failed

        // $followUpSuggestions = [];
        // console.error("Couldn't generate followups");
    }

    getContext('event-bus').subscribe(async (ev) => {
        if (ev && ev.name === 'onResponseComplete') {
            console.log('⭐ FollowUps event-bus RECEIVED EVENT:', ev.name);
            await regenerateFollowUps();
        }
    });

    onMount(() => {
        scrollToBottom();
    });
</script>

<div>
    {#await promise}
        <div class="w-full col-span-2">
            <Loading />
        </div>
    {:then suggestions}
        {#if suggestions?.length > 0}
            <div class="grid grid-cols-2 gap-3">
                {#each suggestions as sug}
                    <div class="suggestion-entry">
                        <button class="w-full">{sug}</button>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="flex">
                <div class="w-full col-span-2">
                    <p>No follow-up suggestions available</p>
                </div>
            </div>
        {/if}
    {:catch error}
        <div class="w-full col-span-2">
            <p>Failed to generate follow-up suggestions</p>
        </div>
    {/await}
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
</style>
