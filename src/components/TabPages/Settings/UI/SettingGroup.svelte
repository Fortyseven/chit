<script>
    export let name;
</script>

<fieldset>
    <legend>{name}</legend>
    <div>
        <slot />
    </div>
</fieldset>

<style lang="scss">
    fieldset {
        padding: 1em;
        border: 1px solid #333;
        border-radius: 14px;
        border-left-color: #444 !important;
        border-right-color: #444 !important;
        border-bottom-color: #888 !important;
        background-color: #222;
        background-image: linear-gradient(
            0deg,
            var(--core-color-darker2) 50%,
            var(--core-color-darker1) 100%
        );

        legend {
            font-size: 1.2em;
            font-weight: bold;
            padding-left: 0.25em;
            padding-right: 0.25em;
            color: var(--primary-fg);
        }
        > div {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 1em;
            gap: 1em;
        }
    }
</style>
