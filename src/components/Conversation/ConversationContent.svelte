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
                <div class="bot">
                    <div class="text">
                        {line.content}
                    </div>
                    <div class="controls">
                        <button title="Retry">R</button>
                        <button title="To Clipboard">C</button>
                    </div>
                </div>
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

        .bot {
            flex: auto;
            background-color: #0004;
            padding: 1em;
            border-radius: 10px;
            background-image: linear-gradient(180deg, #1d1d1d 0%, #000 100%);
            border-top: 1px solid black;
            border-bottom: 1px solid #fff3;
            color: white;
            &.error {
                color: #fff;
            }
            display: flex;
            .text {
                flex: auto;
                color: #ddd;
            }
            .controls {
                flex: none;
                width: 24px;
                margin-left: 1em;
                display: flex;
                flex-direction: column;
                gap: 0.25em;
                button {
                    background: #333;
                    border-radius: 4px;
                    color: white;
                    border: none;
                    font-size: 10pt;
                    &:hover {
                        background: #444;
                        cursor: pointer;
                    }
                }
            }
        }
    }
</style>
