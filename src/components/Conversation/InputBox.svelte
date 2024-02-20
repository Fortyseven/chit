<script>
    import { onMount } from 'svelte';
    import { continueChat, appendToTimeline } from '../../lib/api';
    import { chatTimeline } from '../../stores/stores';

    let inputEl = undefined;

    async function submit() {
        let msg = inputEl.value;

        if (msg && msg.trim() !== '') {
            inputEl.value = '';
            var result = await continueChat(msg);

            console.log('RESULT: ', result.message);

            // appendToTimeline(result.message);
            chatTimeline.update((timeline) => {
                timeline.push(result.message);
                return timeline;
            });
        }
    }

    function onKeyPress(ev) {
        if (ev.key === 'Enter' && ev.ctrlKey) {
            submit();
            ev.preventDefault();
        }
    }

    onMount(() => {
        inputEl.focus();
    });
</script>

<div class="container">
    <textarea
        class="has-text-light has-background-black-ter"
        placeholder="Type a message..."
        bind:this={inputEl}
        on:keypress={onKeyPress}
    />
    <button class="button is-primary" on:click={submit}>Send</button>
</div>

<style lang="scss">
    .container {
        display: grid;
        grid-template-columns: 1fr 100px;
        gap: 1em;

        textarea {
            flex: auto;
            width: 100%;
            padding: 1em;
            border: none;
            outline-style: none;
            border-radius: 10px;
            border-top: 1px solid #0004;
            border-bottom: 1px solid #fff4;
            background-image: linear-gradient(0deg, #1118 25%, #3338 100%);
            &:focus {
                outline-color: #ffaa0033;
                outline-style: solid;
            }
        }
        button {
            flex: none;
            display: block;
            height: 100% !important;
        }
    }
</style>
