<script>
    import { chatState } from '$stores/chatState.js';

    export let value;
</script>

<div class="template">
    <textarea
        bind:value
        placeholder="None"
        class="bg-core-color-darker2 text-accent-color-lighter3"
        {...$$restProps}
    />
</div>

<style lang="scss">
    .template {
        display: flex;
        flex-direction: column;
        label {
            color: white;
            margin-bottom: 0.5em;
        }
        textarea {
            border: none;
            border-radius: 10px;
            height: 6em;
            padding: 0.5em;
            font-family: monospace !important;
            outline: none;
        }
    }

    input[type='text'] {
        width: 4em;
        height: 2em;
        font-family: monospace !important;
    }
</style>
