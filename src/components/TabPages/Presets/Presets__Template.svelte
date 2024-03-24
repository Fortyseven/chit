<script>
    import { chatState } from '$stores/chatState.js';

    export let save = false;
</script>

<div class="template">
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label>
        <div style:display="flex">
            <div style:flex="auto">
                <input
                    type="checkbox"
                    bind:checked={save}
                    title="Save with preset"
                />
                Template
            </div>
            <div
                style:display={'flex'}
                style="flex: 1 1 auto; justify-content: flex-end;"
            ></div>
        </div>
    </label>
    <textarea bind:value={$chatState.template} placeholder="None" />
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
            background-color: #444;
            color: white;
        }
    }

    input[type='text'] {
        width: 4em;
        height: 2em;
        font-family: monospace !important;
    }
</style>
