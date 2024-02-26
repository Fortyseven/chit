<script>
    import { onDestroy, onMount } from 'svelte';
    import { OL_chat } from '../../lib/api';
    import { popLastMessage, rerollLastResponse } from '../../lib/chat';
    import {
        chatTimeline,
        isInferring,
        inputText,
        errorMessage
    } from '../../stores/stores';

    let inputEl = undefined;

    onMount(() => {
        inputEl.focus();
        attachKeyboardShortcuts();
    });

    onDestroy(() => {
        detachKeyboardShortcuts();
    });

    function attachKeyboardShortcuts() {
        window.addEventListener('keydown', onGlobalKeypress);
    }

    function detachKeyboardShortcuts() {
        window.removeEventListener('keydown', onGlobalKeypress);
    }

    function onGlobalKeypress(ev) {
        if (ev.key === 'Escape') {
            inputEl.value = '';
            inputEl.focus();
            $isInferring = false;
            // TODO: This should abort the current inference
        }

        // if (ev.key === '2' && ev.ctrlKey) {
        if (ev.key === 'F3') {
            if ($chatTimeline.length > 0) {
                let last_user_message = '';
                for (let i = $chatTimeline.length - 1; i >= 0; i--) {
                    if ($chatTimeline[i].role === 'user') {
                        last_user_message = $chatTimeline[i].content;
                        break;
                    }
                }
                inputEl.value = last_user_message;
                inputEl.focus();
                ev.preventDefault();
            }
        }
    }

    function onInputKeypress(ev) {
        if (ev.key === 'Enter') {
            if (!ev.ctrlKey) {
                submit();
                ev.preventDefault();
            } else {
                inputEl.value += '\n';
                ev.preventDefault();
            }
        }
    }

    async function submit() {
        let msg = inputEl.value;

        if (msg && msg.trim() !== '') {
            if (msg === '/clear') {
                chatTimeline.set([]);
                inputEl.value = '';
                return;
            }

            inputEl.value = '';

            try {
                var result = await OL_chat(msg);

                if (result) {
                    // appendToTimeline(result.message);
                    chatTimeline.update((timeline) => {
                        timeline.push(result.message);
                        return timeline;
                    });
                }
            } catch (e) {
                console.error(e);
                errorMessage.set(e.message);
                popLastMessage();
                inputEl.value = msg;
            }
        }
    }

    function onClear() {
        if (confirm('Are you sure you want to clear the chat?')) {
            chatTimeline.set([]);
        }
    }

    function onBack() {
        let last_user_message = '';

        chatTimeline.update((timeline) => {
            timeline.pop();
            last_user_message = timeline[timeline.length - 1].content;
            timeline.pop();
            return timeline;
        });
        inputEl.value = last_user_message;
        inputEl.focus();
    }

    isInferring.subscribe(async (value) => {
        if (!value && inputEl) {
            inputEl.focus();
        }
    });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="container" on:keypress={onInputKeypress}>
    <textarea
        class="has-text-light has-background-black-ter"
        disabled={$isInferring}
        placeholder="Type a message..."
        bind:this={inputEl}
        bind:value={$inputText}
    />
    <button
        class="button is-primary"
        disabled={$isInferring}
        title="Submit query"
        on:click={submit}
    >
        <i class="mi-send with-text">Send</i>
    </button>
    <div class="input-buttons-extra">
        <button
            class="button is-primary"
            on:click={onClear}
            title="Clear the current chat"
            disabled={$isInferring || $chatTimeline.length === 0}
        >
            <i class="mi-delete with-text">Clear</i>
        </button>
        <button
            class="button is-primary"
            on:click={async () => {
                if (!$isInferring) await onBack();
            }}
            title="Step back one response"
            disabled={$isInferring || $chatTimeline.length === 0}
            ><i class="mi-arrow-left with-text">Back</i>
        </button>
        <button
            class="button is-primary"
            on:click={async () => {
                if (!$isInferring) await rerollLastResponse();
            }}
            title="Retry the last response"
            disabled={$isInferring || $chatTimeline.length === 0}
        >
            <i class="mi-refresh with-text">Reroll</i>
        </button>
    </div>
</div>

<style lang="scss">
    .container {
        display: grid;
        grid-template-columns: 1fr 7rem 6rem;
        gap: 0.45em;

        textarea {
            flex: auto;
            width: 100%;
            padding: 1em;
            border: none;
            outline-style: none;
            border-radius: 4px;
            border-top: 1px solid #0004;
            border-bottom: 1px solid #fff4;
            background-image: linear-gradient(0deg, #1118 25%, #3338 100%);
            &:focus {
                outline-color: #ffaa0033;
                outline-style: solid;
            }
            &:disabled {
                animation: throb 1s infinite;
            }

            @keyframes throb {
                0% {
                    opacity: 1;
                    transform: scale(1);
                }
                50% {
                    opacity: 0.5;
                    transform: scale(0.99);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        }

        button {
            flex: none;
            display: block;
            height: 100% !important;
        }
        .input-buttons-extra {
            display: flex;
            flex-direction: column;
            gap: 0.5em;
            button {
                height: 2em !important;
                line-height: 0;
            }
        }
    }
</style>
