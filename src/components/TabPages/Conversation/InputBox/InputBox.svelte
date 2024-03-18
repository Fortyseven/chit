<script>
    // @ts-nocheck

    import { onMount } from 'svelte';

    import {
        chatTimeline,
        inputText,
        errorMessage,
        appState
    } from '$stores/stores';

    import { responseInProgress } from '$lib/api/api';

    import { OL_chat } from '$lib/api/api';
    import { clearChat, popLastMessage, rerollLastResponse } from '$lib/chat';
    import { eventBus__keyboard } from '$lib/events/eventBus__keyboard';

    import GlobalInputs from './GlobalInputs.svelte';
    import { saveChatStateToLog } from '$lib/log';
    import { chat_state } from '$stores/chat_state';

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

    function onInputKeypress(ev) {
        if (ev.key === 'Enter') {
            if (!ev.shiftKey) {
                submit();
                ev.preventDefault();
            }
        }
    }

    async function submit() {
        let msg = $inputText.trim();

        if (msg !== '') {
            if (msg === '/clear') {
                onClear(true);
                return;
            } else if (msg === '/save') {
                saveChatStateToLog();
                $inputText = '';
                return;
            } else if (msg === '/debug') {
                console.group('Stores');
                console.log('chatTimeline:', $chatTimeline);
                console.log('chat_state:', $chat_state);
                console.log('appState:', $appState);
                console.groupEnd();

                $inputText = '';
                return;
            }

            $inputText = '';

            try {
                var result = await OL_chat(msg);
                if (result) {
                    chatTimeline.update((timeline) => {
                        timeline.push(result);
                        return timeline;
                    });
                    inputEl?.focus();
                }
                console.log('New timeline:', $chatTimeline);
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

        clearChat();
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

    responseInProgress.subscribe(async (value) => {
        if (!value) {
            inputEl?.focus();
        }
    });
</script>

<GlobalInputs />
<!-- ---------------------------------------------------------------------->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    id="InputBox"
    class="grid grid-cols-[1fr,7rem,6rem] gap-4 text-white h-[150px] p-2 bg-gray-800"
    on:keypress={onInputKeypress}
    on:inputbox-focus={() => inputEl?.focus()}
    on:inputbox-back={() => onBack()}
>
    <textarea
        disabled={$responseInProgress}
        placeholder="Type a message..."
        bind:this={inputEl}
        bind:value={$inputText}
        class:overflow={$inputText.length + $chat_state.system_prompt.length >=
            $chat_state.values.num_ctx}
    />

    <!-- ---------------------------- -->
    <button
        class="button is-primary bg-green-800 rounded-md"
        disabled={$responseInProgress}
        title="Submit query"
        on:click={submit}
    >
        <i class="mi-send with-text">Send</i>
    </button>
    <!-- ---------------------------------------------------------------------->
    <div class="flex flex-col h-full gap-2">
        <!-- ---------------------------- -->
        <button
            class="button"
            on:click={async () => {
                if (!$responseInProgress) await rerollLastResponse();
            }}
            title="Retry the last response"
            disabled={$responseInProgress || $chatTimeline.length === 0}
        >
            <i class="mi-refresh with-text">Reroll</i>
        </button>
        <!-- ---------------------------- -->
        <button
            class="button"
            on:click={async () => {
                if (!$responseInProgress) await onBack();
            }}
            title="Step back one response"
            disabled={$responseInProgress ||
                ($inputText.length === 0 && $chatTimeline.length === 0)}
            ><i class="mi-arrow-left with-text">Back</i>
        </button>
        <!-- ---------------------------- -->
        <button
            id="BtnClear"
            class="button"
            on:click={() => onClear()}
            title="Clear the current chat"
            disabled={$responseInProgress ||
                ($inputText.length === 0 && $chatTimeline.length === 0)}
        >
            <i class="mi-delete with-text">Clear</i>
        </button>
    </div>
</div>

<style lang="scss">
    button {
        @apply transition-all;
        @apply duration-300;
        @apply rounded-md;
        @apply bg-gray-600;

        flex: auto;
        &:disabled {
            opacity: 0.5;
        }
        &:hover {
            opacity: 0.5;
        }
    }

    #BtnClear {
        @apply bg-red-900;
    }

    textarea {
        flex: auto;
        width: 100%;
        padding: 0.5em;
        border: none;
        outline-style: none;
        border-radius: 4px;
        border-top: 1px solid #0004;
        border-bottom: 1px solid #fff4;
        font-size: 1.2em;
        background-color: lighten(#161920, 3%);
        color: white;
        font-family: inherit;
        &:focus {
            outline-color: #ffaa0033;
            outline-style: solid;
        }
        &:disabled {
            opacity: 0.5;
        }

        &.overflow {
            color: #f44;
        }
    }

    .xinput-container {
        display: grid;
        grid-template-columns: 1fr 7rem 6rem;
        gap: 0.45em;

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
