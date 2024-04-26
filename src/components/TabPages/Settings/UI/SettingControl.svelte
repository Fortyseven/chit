<script>
    export let defaultValue;
    export let value;
    export let label;
    export let supplementalUrl;
    export let supplementalUrlName;
    export let placeholder;
</script>

<div class="text-core-color-lighter5">
    <label
        for="pb-endpoint"
        on:dblclick={() => {
            value = defaultValue;
        }}
    >
        {label}
    </label>
    <input type="text" bind:value {placeholder} />

    {#if supplementalUrl}
        <a href={supplementalUrl} target="_blank">{supplementalUrlName}</a>
    {/if}
</div>

<style lang="scss">
    div {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;

        label {
            text-wrap: nowrap;
            display: block;
            flex: 0 0 auto;
            padding: 0;
            padding-right: 1em;
            text-align: right;
            color: var(--accent-color);
        }

        :global(input) {
            display: block;
            width: 100%;
            font-family: monospace;
            background-color: var(--core-color-darker3);
            color: var(--accent-color-lighter4);
        }

        a {
            text-decoration: underline;
            display: block;
            padding-left: 1em;
            color: var(--accent-color-lighter2);
        }
    }
</style>
