<script>
    import { chatState } from '$stores/chatState';
    import { appState } from '$stores/stores';

    export let isOpen = false;
    export let onClose = undefined;

    function useSP(index) {
        console.log('useSP', index);
        $chatState.system_prompt = $appState.savedSystemPrompts[index];
        if (onClose) {
            onClose();
        }
    }

    function deleteSP(index) {
        if (confirm('Delete this prompt?')) {
            appState.update((state) => {
                state.savedSystemPrompts.splice(index, 1);
                return state;
            });
        }
    }

    $: if (isOpen) {
        // bind esc to close
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                if (onClose) {
                    onClose();
                }
            }
        });
    }
</script>

{#if isOpen}
    <div id="ModalKeyboardHelp" class="modal is-active">
        <div class="modal-background" on:click={onClose}></div>

        <div class="modal-card">
            <h1>System Prompt Manager</h1>
            {#each $appState.savedSystemPrompts as prompt, index}
                <div class="prompt">
                    <div class="text">
                        {prompt}
                    </div>
                    <div class="controls">
                        <button on:click={() => useSP(index)}
                            >Use {index}</button
                        >
                        <button on:click={() => deleteSP(index)}>Delete</button>
                    </div>
                </div>
            {/each}
        </div>
    </div>
{/if}

<style lang="scss">
    .modal-card {
        width: 80%;
        height: 100%;
        max-height: 80%;
        overflow-y: auto;
        background: grey;
        padding: 1em;
        color: black;
        h1 {
            color: #eee;
        }
    }
    .prompt {
        display: flex;
        justify-content: space-between;
        padding: 0.5em;
        border-bottom: 1px solid #ccc;
        .text {
            flex: 1;
        }
        .controls {
            flex: 0 0 100px;
        }
    }
</style>
