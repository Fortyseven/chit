<script>
    // @ts-nocheck

    export let key;
    export let value;
    export let forceExpand = false;
    export let highlight = false;

    let valueType = undefined;
    let bg = '';

    $: {
        valueType = Array.isArray(value) ? 'array' : typeof value;
        bg =
            valueType === 'object'
                ? 'object'
                : valueType === 'array'
                  ? 'array'
                  : !!value
                    ? 'truthy'
                    : 'falsy';
    }
</script>

<div class="dsp-value {bg}" title={key}>
    <div class="dsp-value-name">
        {#if highlight}
            <span class="highlight">⭐</span>
        {/if}
        {key}
    </div>

    <div
        class="dsp-value-content"
        class:italic={value === undefined}
        class:opacity-50={value === undefined}
    >
        {#if valueType === 'object' || valueType === 'array'}
            <details class="expandable-entry" open={forceExpand}>
                <summary>{valueType}({Object.keys(value).length})</summary>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                <pre on:click={console.log(key, value)}>{JSON.stringify(
                        value,
                        null,
                        1
                    )}</pre>
            </details>
        {:else if valueType === 'array'}
            [ {value} ] ({value.length})
        {:else}
            {@html value}
        {/if}
    </div>
</div>

<style lang="scss">
    .dsp-value {
        width: 100%;
        overflow: hidden;
        display: flex;
        flex-wrap: nowrap;
        color: black;
        border-top: 1px dashed black;

        &.object {
            background: #ddd;
        }
        &.array {
            background: #ccf;
        }
        &.truthy {
            background-color: #dfd;
        }
        &.falsy {
            background-color: #fdf;
        }

        .dsp-value-name {
            flex: 0 0 10em;
            white-space: nowrap;
            font-weight: bold;
            padding-left: 1em;
            border-left: 1px dashed black;
            text-overflow: ellipsis;
        }

        .dsp-value-content {
            flex: 0 0 100%;
            font-family: monospace;
            padding-right: 1em;
        }
    }
    .highlight {
        text-shadow: 0px 0px 3px rgba(0, 0, 0, 0.75);
        animation: spin_highlight 2000ms linear infinite;
        transform-origin: 50% 60%;
        position: relative;
        bottom: 0.1em;
        display: inline-block;
    }
    @keyframes spin_highlight {
        from {
            transform: rotate(0deg) rotateY(0deg);
        }
        to {
            transform: rotate(360deg) rotateY(360deg);
        }
    }

    .expandable-entry {
        cursor: pointer;
    }

    details {
        summary {
        }
        pre {
            font-size: 0.9em;
            overflow: scroll;
            max-height: 100px;
            color: black;
        }
    }
</style>
