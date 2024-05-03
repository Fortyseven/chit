<script>
    // @ts-nocheck

    export let key;
    export let value;
    export let forceExpand = false;
    export let highlight = false;
    export let condenseLabel = false;

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

<div class="dsp-value {bg}" title={key} class:expanded={forceExpand}>
    <div class="dsp-value-name" class:condenseLabel>
        {#if highlight}
            <span class="highlight">⭐</span>
        {/if}
        {key}
    </div>

    <div
        class="dsp-value-content cursor-pointer"
        class:italic={value === undefined}
        class:opacity-50={value === undefined}
        on:dblclick={console.log(key, value)}
    >
        {#if valueType === 'object' || valueType === 'array'}
            <details class="expandable-entry" open={forceExpand}>
                <summary>{valueType}</summary>
                <pre>{JSON.stringify(value, null, 1)}</pre>
            </details>
        {:else if valueType === 'array'}
            [ {value} ] ({value.length})
        {:else}
            `{@html value}`
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
        max-height: 6em;
        overflow-y: auto;
        letter-spacing: -1px;
        line-height: 1.2;

        &.expanded {
            max-height: 190em;
            pre {
                max-height: 100%;
            }
        }

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
            padding-left: 0.5em;
            border-left: 1px dashed black;
            text-overflow: ellipsis;
            color: rgba(78, 0, 234, 0.75);
            font-family: 'Roboto Condensed';
            letter-spacing: -0.5px;
            &.condenseLabel {
                flex: 0 1 auto;
                padding-right: 0.5em;
                border-right: 1px dashed red;
            }
        }

        .dsp-value-content {
            font-family: monospace;
            padding-right: 1em;
            font-size: 0.9em;
            height: 100%;
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
        pre {
            font-size: 0.9em;
            overflow: scroll;
            max-height: 100px;
            color: black;
            white-space: normal;
        }
    }
</style>
