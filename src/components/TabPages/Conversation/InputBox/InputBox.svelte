<script>
    // @ts-nocheck

    import { onMount } from 'svelte';

    import {
        chatTimeline,
        isInferring,
        inputText,
        errorMessage
    } from '../../../../stores/stores';
    import { isSidebarOpen } from '../../../../stores/stores_ui';

    import GlobalInputs from './GlobalInputs.svelte';
    import { eventBus__keyboard } from '../../../../lib/events/eventBus__keyboard';
    import { OL_chat } from '../../../../lib/api';
    import { popLastMessage, rerollLastResponse } from '../../../../lib/chat';

    let inputEl = undefined;

    onMount(() => {
        inputEl?.focus();
    });

    eventBus__keyboard.subscribe((value) => {
        switch (value) {
            case 'inputbox-focus':
                inputEl?.focus();
                $eventBus__keyboard = null;
                break;
            case 'inputbox-back':
                onBack();
                $eventBus__keyboard = null;
                break;
        }
    });

    isSidebarOpen.subscribe((value) => {
        if (value) {
            // detachKeyboardShortcuts();
        } else {
            // attachKeyboardShortcuts();
            inputEl?.focus();
        }
    });

    function onInputKeypress(ev) {
        if (ev.key === 'Enter') {
            if (!ev.shiftKey) {
                submit();
                ev.preventDefault();
            }
        }
    }

    async function submit() {
        let msg = $inputText;

        if (msg && msg.trim() !== '') {
            if (msg === '/clear') {
                onClear(true);
                return;
            }

            $inputText = '';

            try {
                var result = await OL_chat(msg);

                if (result) {
                    chatTimeline.update((timeline) => {
                        timeline.push(result.message);
                        return timeline;
                    });
                    inputEl?.focus();
                }
            } catch (e) {
                console.error(e);
                errorMessage.set(e.message);
                popLastMessage();
                $inputText = msg;
            }
        }
    }

    function onClear(skip_confirm = false) {
        if (
            !skip_confirm &&
            !confirm('Are you sure you want to clear the chat?')
        ) {
            return;
        }

        chatTimeline.set([]);
        $inputText = '';
    }

    function onBack() {
        console.log('onBack');
        if ($chatTimeline.length === 0) {
            $inputText = '';
            inputEl?.focus();
            return;
        }

        let last_user_message = '';

        chatTimeline.update((timeline) => {
            timeline.pop();
            last_user_message = timeline[timeline.length - 1].content;
            timeline.pop();
            return timeline;
        });
        $inputText = last_user_message;
        inputEl?.focus();
    }

    isInferring.subscribe(async (value) => {
        if (!value) {
            inputEl?.focus();
        }
    });
</script>

<GlobalInputs />
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class="container"
    on:keypress={onInputKeypress}
    on:inputbox-focus={() => inputEl?.focus()}
    on:inputbox-back={() => onBack()}
>
    <textarea
        class="has-text-light has-background-black-ter"
        disabled={$isInferring}
        placeholder="Type a message..."
        bind:this={inputEl}
        bind:value={$inputText}
    />
    <!-- ---------------------------- -->
    <button
        class="button is-primary"
        disabled={$isInferring}
        title="Submit query"
        on:click={submit}
    >
        <i class="mi-send with-text">Send</i>
    </button>
    <!-- ---------------------------------------------------------------------->
    <div class="input-buttons-extra">
        <!-- ---------------------------- -->
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
        <!-- ---------------------------- -->
        <button
            class="button is-primary"
            on:click={async () => {
                if (!$isInferring) await onBack();
            }}
            title="Step back one response"
            disabled={$isInferring ||
                ($inputText.length === 0 && $chatTimeline.length === 0)}
            ><i class="mi-arrow-left with-text">Back</i>
        </button>
        <!-- ---------------------------- -->
        <button
            class="button is-primary"
            on:click={() => onClear()}
            title="Clear the current chat"
            disabled={$isInferring ||
                ($inputText.length === 0 && $chatTimeline.length === 0)}
        >
            <i class="mi-delete with-text">Clear</i>
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
            // background-image: linear-gradient(0deg, #1118 25%, #3338 100%);
            &:focus {
                outline-color: #ffaa0033;
                outline-style: solid;
            }
            &:disabled {
                opacity: 0.5;
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
