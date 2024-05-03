<script>
    // @ts-nocheck

    import { onMount } from 'svelte';

    import {
        chatTimeline,
        inputText,
        errorMessage,
        appState
    } from '$stores/stores';

    import {
        pendingContinuedAssistantChat,
        responseInProgress,
        wasAborted
    } from '$lib/api/api';

    import { OL_chat } from '$lib/api/api';
    import { clearChat, rerollLastResponse } from '$lib/chat';
    import { eventBus__keyboard } from '$lib/events/eventBus__keyboard';

    import GlobalInputs from './GlobalInputs.svelte';
    import { chatState } from '$stores/chatState';

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
                // } else if (msg === '/save') {
                //     saveChatStateToLog();
                //     $inputText = '';
                //     return;
            } else if (msg === '/debug') {
                console.group('Stores');
                console.log('chatTimeline:', $chatTimeline);
                console.log('chatState:', $chatState);
                console.log('appState:', $appState);
                console.groupEnd();

                $inputText = '';
                return;
            }

            // "accept" the input
            $inputText = '';

            try {
                var result = await OL_chat(msg);

                if (result && !$wasAborted) {
                    chatTimeline.update((timeline) => {
                        console.log('Updating timeline:', result);
                        timeline.push(result);
                        return timeline;
                    });
                    inputEl?.focus();
                }
                if ($wasAborted) {
                    $wasAborted = false;
                    $inputText = msg;
                }
                console.log('New timeline:', $chatTimeline);
            } catch (e) {
                errorMessage.set(e.message);
                $inputText = msg;
            }
        } else {
            // let the model add to it's last conversation

            try {
                let result = await OL_chat(msg, true);

                if (result && result.content.trim() && !$wasAborted) {
                    chatTimeline.update((timeline) => {
                        if ($pendingContinuedAssistantChat) {
                            timeline[timeline.length - 1].content +=
                                result.content;
                            $pendingContinuedAssistantChat = false;
                            return timeline;
                        } else {
                            console.log('Updating timeline:', result);
                            timeline.push(result);
                            return timeline;
                        }
                    });
                    inputEl?.focus();
                }
                if ($wasAborted) {
                    $wasAborted = false;
                    $inputText = msg;
                }
                console.log('New timeline:', $chatTimeline);
            } catch (e) {
                errorMessage.set(e.message);
                if (msg) {
                    $inputText = msg;
                }
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
        if ($responseInProgress) return;

        console.log('onBack');
        if ($chatTimeline.length === 0) {
            $inputText = '';
            inputEl?.focus();
            return;
        }

        let last_user_message = '';

        chatTimeline.update((timeline) => {
            let last_message = timeline.pop();

            if (last_message.role === 'user') {
                last_user_message = last_message.content;
            } else {
                let next_last = timeline.pop();
                if (next_last && next_last.role === 'user') {
                    last_user_message = next_last.content;
                } else {
                    timeline.push(next_last);
                }
            }

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
<div
    id="InputBox"
    class="grid grid-cols-[1fr,7rem,6rem] gap-4 text-white h-[150px] p-2 bg-gray-800"
    on:keypress={onInputKeypress}
    on:inputbox-focus={() => inputEl?.focus()}
    on:inputbox-back={() => onBack()}
>
    <textarea
        class="caret-[--accent-color2]"
        disabled={$responseInProgress}
        placeholder="Type a message..."
        bind:this={inputEl}
        bind:value={$inputText}
    />

    <!-- ---------------------------- -->

    <button
        class="button is-primary bg-green-800 rounded-md"
        disabled={$responseInProgress || !$chatState.model_name}
        title="Submit query"
        on:click={submit}
    >
        <i class="mi-send with-text">
            {#if $inputText === ''}
                Continue
            {:else}
                Send
            {/if}
        </i>
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
    #InputBox {
        background-color: var(--core-color-darker1);
        box-shadow: 0 0px 10px rgba(0, 0, 0, 0.5);
    }

    button {
        @apply transition-all;
        @apply duration-300;
        @apply rounded-md;

        background-color: var(--accent-color-darker3);

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
        border-bottom: 1px solid var(--core-color-lighter1);
        font-size: 1.2em;
        background-color: var(--core-color-darker2);
        color: var(--primary-fg);
        font-family: inherit;

        &:disabled {
            opacity: 0.5;
        }

        &.overflow {
            color: #f44;
        }
    }
</style>
