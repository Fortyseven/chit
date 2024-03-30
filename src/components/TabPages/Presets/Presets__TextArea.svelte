<script>
    import { chatState } from '$stores/chatState.js';

    export let value;
</script>

<div class="template">
    <textarea
        bind:value
        placeholder="None"
        class="bg-core-color-darker2 text-accent-color-lighter2"
        {...$$restProps}
    />
</div>

<style lang="scss">
    .template {
        display: flex;
        flex-direction: column;

        textarea {
            border: none;
            border-radius: 10px;
            height: 6em;
            padding: 0.5em;
            // font-family: monospace !important;
            outline: none;
        }
    }
</style>
