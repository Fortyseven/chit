<script>
    export let defaultValue;
    export let value;
    export let supplementalUrl;
    export let supplementalUrlName;
</script>

<div class="text-core-color-lighter5">
    <label
        for="pb-endpoint"
        on:dblclick={() => {
            value = defaultValue;
        }}
    >
        <slot />
    </label>
    <input type="checkbox" bind:checked={value} />

    {#if supplementalUrl}
        <a href={supplementalUrl} target="_blank">{supplementalUrlName}</a>
    {/if}
</div>

<style lang="scss">
    div {
        align-items: center;
        display: flex;
        flex-direction: row;

        label {
            text-wrap: nowrap;
            display: block;
            padding: 0;
            padding-right: 1em;
            text-align: right;
            color: var(--accent-color);
        }
        input {
            display: block;
            font-family: monospace;
            background-color: var(--core-color-darker3);
            accent-color: var(--accent-color);
            margin-left: 0.5em;
        }
    }
</style>
