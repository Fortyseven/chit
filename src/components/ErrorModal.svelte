<script>
    import { errorMessage } from '../stores/stores';
    export let message = '';

    function dismiss() {
        $errorMessage = '';
    }
</script>

<span class="modal">
    <dialog open on:keypress={dismiss}>
        <h1>Error</h1>
        <code>{message}</code>
        <br />
        <button on:click={() => ($errorMessage = '')}>Bummer</button>
    </dialog>
</span>

<style lang="scss">
    .modal {
        display: block;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        display: grid;
        place-content: center;

        dialog {
            position: fixed;
            z-index: 1000;
            border-radius: 10px;
            box-shadow: 0px 0px 40px black;
            background: #666;
            min-width: 35vw;
            color: white;
            border: none;
            text-align: center;
            h1 {
                font-weight: bold;
                font-size: 1.5em;
            }
        }
    }
</style>
