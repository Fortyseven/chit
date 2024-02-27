<script>
    import { chatTimeline, isInferring } from '$stores';
    import TimelineResponse_Assistant from './TimelineResponse_Assistant.svelte';

    let pendingIndex = null;

    isInferring.subscribe(async (value) => {
        console.log('isInferring UPDATED', value);
        pendingIndex = value;
    });
</script>

<div class="timeline">
    {#each $chatTimeline as line, index}
        {#if line}
            {#if line.role === 'user'}
                <div
                    class="user"
                    style:font-weight={pendingIndex == index
                        ? 'bold'
                        : 'normal'}
                >
                    {line.content}
                </div>
                {#if pendingIndex == index}
                    <div class="bot">
                        <div class="loader"></div>
                    </div>
                {/if}
            {:else if line.role === 'assistant'}
                <TimelineResponse_Assistant {line} />
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
        .user {
            flex: auto;
            // background-color: #fff1;

            border-radius: 10px;
        }
    }
</style>
