<script>
    import { onMount } from 'svelte';
    import { eventBus__keyboard } from '$lib/events/eventBus__keyboard';

    export let isVisible = false;

    // close on any key
    onMount(() => {
        console.log('ModalKeyboardHelp mounted');
        window.addEventListener('keydown', (ev) => {
            if (isVisible) {
                // if (ev.key === 'Escape') {
                isVisible = false;
                ev.preventDefault();
                // remove
                window.removeEventListener('keydown', (ev) => {});
                $eventBus__keyboard = 'inputbox-focus';
                // }
            }
        });
    });
</script>

{#if isVisible}
    <div id="ModalKeyboardHelp" class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-card">
            <h1>Keyboard Shortcuts</h1>
            <div class="msg">These are some of the less obvious shortcuts.</div>
            <hr />
            <table>
                <thead>
                    <tr>
                        <th>Key</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Enter</td>
                        <td>Send message</td>
                    </tr>
                    <tr>
                        <td>Ctrl + Enter</td>
                        <td>Send message</td>
                    </tr>
                    <tr>
                        <td>Ctrl + Backspace</td>
                        <td>Back one response</td>
                    </tr>
                    <tr>
                        <td>Ctrl + E</td>
                        <td>Reroll last response</td>
                    </tr>
                    <tr>
                        <td>Ctrl + /</td>
                        <td>Show Keyboard Shortcuts (hi!)</td>
                    </tr>
                </tbody>
            </table>
            <button class="modal-close is-large" aria-label="close"></button>
        </div>
    </div>

    <style lang="scss">
        #ModalKeyboardHelp .modal-card {
            background-color: gold;
            color: black;
            padding: 1em;
            border-radius: 10px;

            .msg {
                text-align: center;
            }

            h1 {
                font-size: 1.5em;
                text-align: center;
            }

            hr {
                margin: 0.5em 0;
                background: transparent;
                border-bottom: 1px solid #0005;
            }

            table {
                margin: auto;
                thead {
                    th {
                        padding: 0.5em;
                        text-align: left;
                        text-transform: uppercase;
                    }
                }
                tr {
                    td {
                        padding: 0 0.5em;
                        text-align: left;
                    }
                }
            }
        }
    </style>
{/if}
