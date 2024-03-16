<script>
    export let defaultValue;
    export let value;
    export let label;
    export let supplementalUrl;
    export let supplementalUrlName;
    export let placeholder;
</script>

<div>
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
        align-items: center;

        label {
            flex: 0 0 auto;
            padding: 0;
            padding-right: 1em;
            text-align: right;
        }

        input {
            flex: auto;
            display: block;
            padding: 0.5em;
            border-radius: 5px;
            border: 1px solid var(--color-primary);
            font-family: monospace;
        }

        a {
            text-decoration: underline;
            display: block;
            padding-left: 1em;
            color: lightblue;
        }
    }
</style>
