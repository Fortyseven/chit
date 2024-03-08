<script>
    export let onClick;
    export let tooltip;
    export let iconName;
    export let label = '';
    export let enabled = false;
</script>

<div>
    <button
        class="has-tooltip-left"
        class:has-label={label}
        data-tooltip={tooltip}
        on:click={onClick}
        class:on={enabled}
    >
        {#if label}
            <i class="mi-{iconName}">&nbsp;{label}</i>
        {:else}
            <i class="mi-{iconName}" />
        {/if}
    </button>
</div>

<style lang="scss">
    div {
        display: flex;
        button {
            background: #333;
            border-radius: 4px;
            border: none;
            color: white;
            font-size: 10pt;
            width: 100%;

            &:hover {
                background: #444;
                cursor: pointer;
            }
            &.on {
                animation: fadein 0.5s;
                background-color: #777;
                color: black;
                @keyframes fadein {
                    from {
                        border: 1px solid #fff0;
                    }
                    to {
                        border: 1px solid #ffff;
                    }
                }
            }
        }
    }
</style>
