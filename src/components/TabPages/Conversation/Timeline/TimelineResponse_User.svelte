<script>
    export let pendingIndex = null;
    export let index;
    export let line;
</script>

<div class="user" style:font-weight={pendingIndex == index ? 'bold' : 'normal'}>
    {line.content}
</div>
{#if pendingIndex == index}
    <div class="bot">
        <div class="loader"></div>
    </div>
{/if}

<style lang="scss">
    //
</style>
