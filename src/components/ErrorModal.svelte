<script lang="ts">
    import { playSndFail } from '$lib/audio';
    import { errorMessage } from '$stores/stores';
    import { onMount } from 'svelte';

    function dismiss() {
        $errorMessage = '';
    }

    onMount(() => {
        playSndFail();
    });

    $: console.log('ErrorModal', $errorMessage);
</script>

<span class="error-modal" on:click={dismiss}>
    <dialog open on:keypress={dismiss}>
        <h1>Error</h1>
        <p>{$errorMessage}</p>
        <button on:click={() => ($errorMessage = '')}>Bummer</button>
    </dialog>
</span>

<style lang="scss">
    .error-modal {
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
            position: relative;
            z-index: 1000;
            border-radius: 1em;
            box-shadow: 0px 0px 40px black;
            background: #666;
            min-width: 35vw;
            color: var(--color-error, #fff);
            border: none;
            text-align: center;
            padding: 1em;
            h1 {
                font-weight: bold;
                font-size: 1.5em;
                padding-bottom: 1em;
            }
            p {
                color: white;
                margin-bottom: 2em;
            }

            button {
                background: #fff1;
                padding: 0.5em 1em;
                &:hover {
                    background: #fff3;
                    transition: all 0.3s;
                }
            }
        }
    }
</style>
