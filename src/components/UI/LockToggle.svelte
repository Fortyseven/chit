<script>
    export let locked = false;
</script>

<div>
    <button on:click={() => (locked = !locked)} {...$$restProps}>
        {locked ? '🔓' : '🔒'}
        <slot />
    </button>
</div>

<style lang="scss">
    div {
        display: grid;
        place-content: center;

        button {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            transition: all 0.2s;
            padding: 0 0.25em;
            &:hover {
                transform: scale(1.1);
            }
        }
    }
</style>
