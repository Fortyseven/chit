<script>
    import { chatState } from '$stores/chatState';

    let isEditing = false;
    let editInputEl = undefined;

    function startEdit() {
        isEditing = true;
    }

    function autofocus(node) {
        if (node && isEditing) {
            node.focus();
            // select the text in the input
            node.setSelectionRange(0, node.value.length);

            return {
                destroy() {
                    if (!$chatState.stateFilename.endsWith('.json')) {
                        $chatState.stateFilename += '.json';
                    }
                }
            };
        }
    }
</script>

{#if isEditing}
    <input
        type="text"
        use:autofocus
        on:blur={() => (isEditing = false)}
        on:keydown={(e) => {
            if (e.key === 'Enter' || e.key === 'Escape' || e.key === 'Tab') {
                isEditing = false;
            }
        }}
        bind:this={editInputEl}
        bind:value={$chatState.stateFilename}
    />
{:else}
    <span on:dblclick={startEdit} alt="CUM">{$chatState.stateFilename}</span>
{/if}

<style lang="scss">
    span {
        color: var(--accent-color-lighter3);
        cursor: text;
        user-select: none;
    }
    input {
        padding: 0 0.2em;
        color: var(--primary-fg);
        outline: none;
    }
</style>
