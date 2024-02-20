<script>
    import { chatTimeline } from '$stores';
</script>

<div>
    {#each $chatTimeline as line}
        {#if line.role === 'user'}
            <div class="user">
                {line.content}
            </div>
        {:else if line.role === 'assistant'}
            <div class="bot">
                {line.content}
            </div>
        {/if}
    {/each}
</div>

<style lang="scss">
    div {
        display: flex;
        flex-direction: column;
        gap: 1em;

        .user {
            display: flex;
            // background-color: #fff1;
            padding: 1em 0;
            border-radius: 10px;
        }

        .bot {
            display: flex;
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
