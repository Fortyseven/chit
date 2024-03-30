<script>
    export let onClick = () => {};
</script>

<button
    class="bg-ui-primary-bg text-ui-primary-fg"
    {...$$restProps}
    on:click={onClick}
>
    <slot />
</button>

<style lang="scss">
    button {
        flex: auto;
        border: none;
        padding: 0 1em;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        font-weight: bold;
        margin: 4px 2px;
        cursor: pointer;

        transition: all 0.2s ease;

        &:hover {
            transform: scale(1.1);
            box-shadow: 0px 0px 14px rgb(42, 42, 42);
        }
    }
</style>
