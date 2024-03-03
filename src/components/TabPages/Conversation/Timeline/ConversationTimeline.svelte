<script>
    import TimelineResponse_User from './TimelineResponse_User.svelte';

    import {
        chatTimeline,
        inferringInProgress
    } from '../../../../stores/stores.js';
    import TimelineResponse_Assistant from './TimelineResponse_Assistant.svelte';

    let pendingIndex = null;

    inferringInProgress.subscribe(async (value) => {
        console.log('inferringInProgress UPDATED', value);
        pendingIndex = value;
    });
</script>

<div class="timeline">
    {#each $chatTimeline as line, index}
        {#if line}
            {#if line.role === 'user'}
                <TimelineResponse_User {line} {index} {pendingIndex} />
            {:else if line.role === 'assistant'}
                <TimelineResponse_Assistant {line} {index} />
            {:else if line.role === 'error'}
                <div class="bot error">
                    {line.content}
                </div>
            {/if}
        {:else}
            <div class="bot">💀</div>
        {/if}
    {/each}
</div>

<style lang="scss">
    .timeline {
        // overflow: hidden;
        display: flex;
        flex-direction: column;
        gap: 0.75em;
        font-size: 1.35em;
        .user {
            flex: auto;

            border-radius: 10px;
        }
    }
</style>
