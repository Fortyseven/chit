<script>
    // @ts-nocheck

    import { getContext, onMount } from 'svelte';

    import {
        chatTimeline,
        inputText,
        errorMessage,
        appState,
        isBeingEditedIndex,
        inputSubmitDisabled
    } from '$stores/stores';
    import { pastedImage } from '$stores/imageState';
    import { chatState, completedResponse } from '$stores/chatState';

    import {
        pendingContinuedAssistantChat,
        responseInProgress,
        wasAborted
    } from '$lib/api/api';

    import { clearChat, rerollLastResponse } from '$lib/chat';
    import { eventBus__keyboard } from '$lib/events/eventBus__keyboard';

    import GlobalInputs from './GlobalInputs.svelte';
    import InputBox__ImagePasteListener from './InputBox__ImagePasteListener.svelte';
    import ConvoTools from './ConvoTools.svelte';
    import {
        AddComment,
        ChatBot,
        Continue,
        NextFilled,
        SendAlt,
        Chat,
        Add,
        AddAlt
    } from 'carbon-icons-svelte';

    import { Readability } from '@mozilla/readability';
    import { templateVariables } from '$stores/templates';
    import { isUrl } from '../../../../utils.js';
    import { dispatchToEventBus } from '$lib/events';

    const QUICK_ART_PROMPT =
        '[Write a paragraph visually describing the current moment for an AI art generator. Describe the scene, the mood, etc.]';

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

    /* --------------------------------------------------------- */
    async function processSlashCommand(msg) {
        if (msg === '/clear') {
            onClear(true);
            return true;
        } else if (msg === '/debug') {
            console.group('Stores');
            console.log('chatTimeline:', $chatTimeline);
            console.log('chatState:', $chatState);
            console.log('appState:', $appState);
            console.log('templateVariables:', $templateVariables);
            console.groupEnd();

            $inputText = '';
            return true;
        } else if (msg === '/art') {
            $inputText = QUICK_ART_PROMPT;
            return true;
        } else if (isUrl(msg?.trim())) {
            // if we have a solo URL in the input, fetch it and use the text body as the input
            try {
                let response = await fetch(msg);
                let data = await response.text();

                // strip html and css, just return text
                let parser = new DOMParser();
                let doc = parser.parseFromString(data, 'text/html');

                const reader = new Readability(doc);
                const article = reader.parse();

                $inputText = article.textContent;

                submit();
            } catch (err) {
                errorMessage.set(`There was an error fetching ${msg}. (CORS?)`);
            } finally {
                return true;
            }
        }

        return false;
    }

    getContext('event-bus').subscribe(async (ev) => {
        if (ev && ev.name) {
            console.log('⭐ InputBox event-bus RECEIVED EVENT:', ev);
            switch (ev.name) {
                case 'onResponseComplete':
                    console.log('ZZZ InputBox event-bus RECEIVED EVENT:', ev);
                    if ($completedResponse && !$wasAborted) {
                        chatTimeline.update((timeline) => {
                            console.log(
                                'Updating timeline:',
                                $completedResponse
                            );
                            timeline.push($completedResponse);
                            return timeline;
                        });
                    }
                    inputEl?.focus();

                    break;
            }
        }
    });

    /* --------------------------------------------------------- */
    async function submit() {
        const cont_mode = !$inputText.trim() && $chatTimeline.length > 0;
        const msg = cont_mode ? null : $inputText.trim();
        const pasted_image = $pastedImage || undefined;

        if (msg !== '') {
            if (await processSlashCommand(msg)) {
                return;
            }

            // "accept" the input
            $inputText = '';
            $pastedImage = undefined;

            try {
                dispatchToEventBus('runInference', {
                    user_message: msg,
                    continue_chat: cont_mode,
                    pasted_image
                });

                // if (!$wasAborted && $completedResponse) {
                // }

                // if (result && !$wasAborted) {
                //     chatTimeline.update((timeline) => {
                //         console.log('Updating timeline:', result);
                //         timeline.push(result);
                //         return timeline;
                //     });
                //     inputEl?.focus();
                // }
                // if ($wasAborted) {
                //     $wasAborted = false;
                //     $inputText = msg;
                // }
                console.log('New timeline:', $chatTimeline);
            } catch (e) {
                errorMessage.set(e.message);
                $inputText = msg;
            }
        } else {
            // let the model add to it's last conversation

            try {
                dispatchToEventBus('runInference', {
                    user_message: msg,
                    continue_chat: true
                });

                if (result && result.content.trim() && !$wasAborted) {
                    chatTimeline.update(async (timeline) => {
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
                // last message was from the user
                last_user_message = last_message.content;

                if (last_message.hasOwnProperty('image_blob')) {
                    $pastedImage = image_blob;
                }
            } else {
                // we're going back after the assistant as responded,
                // probably, so we need to discard that, and then check if the
                // last message was from the user and restore that to the input
                let next_last = timeline.pop();

                if (next_last && next_last.role === 'user') {
                    last_user_message = next_last.content;

                    if (next_last.hasOwnProperty('image_blob')) {
                        $pastedImage = next_last.image_blob;
                    }
                } else {
                    // leave it alone?
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
<InputBox__ImagePasteListener />
<!-- ---------------------------------------------------------------------->
<div class="wrapper flex flex-col">
    <div class="flex flex-col">
        <div
            id="InputBox"
            class="grid grid-cols-[1fr,7rem,6rem] gap-4 text-white h-auto p-2 bg-gray-800"
            on:keypress={onInputKeypress}
            on:inputbox-focus={() => inputEl?.focus()}
            on:inputbox-back={() => onBack()}
        >
            <textarea
                class="caret-[--accent-color2]"
                disabled={$responseInProgress || $isBeingEditedIndex}
                placeholder="Type a message..."
                bind:this={inputEl}
                bind:value={$inputText}
            />

            <!-- ---------------------------- -->

            <button
                class="button is-primary bg-green-800 rounded-md"
                disabled={$responseInProgress ||
                    !$chatState.model_name ||
                    $isBeingEditedIndex ||
                    (!$inputText && $chatTimeline.length == 0)}
                title="Submit query"
                on:click={submit}
            >
                <div
                    class="grid grid-flow-col place-content-center items-center gap-2"
                >
                    {#if $inputText || $chatTimeline.length == 0}
                        <SendAlt /> Submit
                    {:else}
                        <AddAlt /> Continue
                    {/if}
                </div>
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
        <div>
            <ConvoTools />
        </div>
    </div>
</div>

<style lang="scss">
    .wrapper {
        background: linear-gradient(0deg, rgb(60, 0, 60), rgb(69, 36, 0));

        #InputBox {
            // background-color: var(--core-color-darker1);
            background-color: transparent;
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
    }
</style>
