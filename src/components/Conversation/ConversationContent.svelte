<script>
    import { chatTimeline, isInferring } from '$stores';

    let pendingIndex = null;

    isInferring.subscribe(async (value) => {
        console.log('isInferring UPDATED', value);
        pendingIndex = value;
    });
</script>

<div class="timeline">
    {#each $chatTimeline as line, index}
        {#if line.role === 'user'}
            <div
                class="user"
                style:color={pendingIndex == index ? 'red' : 'white'}
            >
                {line.content}
            </div>
            {#if pendingIndex == index}
                <div class="bot">
                    <div class="loader"></div>
                </div>
            {/if}
        {:else if line.role === 'assistant'}
            <div class="bot">
                {line.content}
            </div>
        {/if}
    {/each}
</div>

<style lang="scss">
    .timeline {
        // overflow: hidden;
        display: flex;
        flex-direction: column;
        gap: 1em;
        .user {
            flex: auto;
            // background-color: #fff1;
            padding: 1em 0;
            border-radius: 10px;
        }

        .bot {
            flex: auto;
            background-color: #0004;
            padding: 1em;
            border-radius: 10px;
            background-image: linear-gradient(180deg, #1d1d1d 0%, #000 100%);
            border-top: 1px solid black;
            border-bottom: 1px solid #fff3;
            color: white;
        }
    }
</style>
