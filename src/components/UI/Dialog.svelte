<script>
    import { eventBus__keyboard } from '$lib/events/eventBus__keyboard';
    import { onMount } from 'svelte';

    export let title = 'Dialog Box';
    export let onClose = () => {};
    export let onReload = undefined;
    export let onCopy = undefined;

    let copyText = 'Copy';

    function dismiss() {
        setTimeout(() => {
            $eventBus__keyboard = 'inputbox-focus';
        }, 250);
    }

    onMount(() => {
        document.body.onkeydown = (ev) => {
            if (ev.key === 'Escape') {
                document.body.onkeydown = null;
                dismiss();
            }
        };
    });
</script>

<span
    class="modal"
    on:click={dismiss}
    on:keypress={(ev) => console.log(ev.key)}
>
    <dialog open on:keypress={dismiss}>
        <h1>{title}</h1>
        <div class="slot">
            <slot />
        </div>
        <div class="flex buttons place-content-center gap-3">
            {#if onReload}<button on:click={onReload}>Reload</button>{/if}
            {#if onCopy}<button
                    on:click={() => {
                        copyText = 'Copied!';
                        setTimeout(() => {
                            copyText = 'Copy';
                        }, 1000);
                        onCopy();
                    }}>{copyText}</button
                >{/if}
            <button on:click={onClose}>OK</button>
        </div>
    </dialog>
</span>

<style lang="scss">
    .modal {
        background: rgba(0, 0, 0, 0.5);
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        display: grid;
        place-content: center;
        width: 100vw;
        height: 100vh;
        z-index: 1000;

        dialog {
            font-family: --font-primary;
            position: relative;
            z-index: 1000;
            border-radius: 1em;
            box-shadow: 0px 0px 40px black;
            background: $core-color;
            min-width: 35vw;
            color: var(--accent-color);
            border: none;
            text-align: center;
            padding: 1em;
            max-width: 800px;

            .slot {
                margin: 1em;
                text-align: left;
                font-family: monospace;
                white-space: pre-wrap;
                color: var(--accent-color-lighter4);
                max-height: 50vh;
                overflow: scroll;
            }

            h1 {
                font-weight: bold;
                font-size: 1.5em;
            }

            button {
                background: #fff1;
                padding: 0.5em 1em;
                color: $accent-color-lighter6;
                border-radius: 10px;
                &:hover {
                    background: #fff3;
                    transition: all 0.3s;
                }
            }
        }
    }
</style>
