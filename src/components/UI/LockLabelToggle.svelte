<script>
    export let locked = false;
</script>

<div class="flex flex-row pb-2" on:click={() => (locked = !locked)}>
    <button class="flex-auto block flex-shrink-0 flex-grow-0" {...$$restProps}>
        {locked ? '🔒' : '🔓'}
    </button>
    <div class="flex-grow-0 mr-4" class:locked>
        <slot />
    </div>
    <div class="flex-auto">
        <hr class:locked />
    </div>
</div>

<style lang="scss">
    div {
        align-items: center;
        font-weight: bold;
        padding: 0.5em 0;
        cursor: pointer;

        button {
            background: none;
            border: none;
            font-size: 1.5rem;
            transition: all 0.2s;
            padding: 0 0.25em;

            &:hover {
                transform: scale(1.1);
            }
        }
        hr {
            border: none;
            border-bottom: 1px solid var(--accent-color-darker3);
            &.locked {
                border-bottom-color: var(--accent-color);
            }
        }
    }
</style>
