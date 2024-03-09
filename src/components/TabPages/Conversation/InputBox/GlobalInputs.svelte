<script>
    import { onDestroy, onMount } from 'svelte';
    import {
        chatTimeline,
        inputText,
        inferringInProgress
    } from '$stores/stores';
    import {
        ebk_inputBoxBack,
        ebk_inputBoxFocus,
        eventBus__keyboard
    } from '$lib/events/eventBus__keyboard';
    import { rerollLastResponse } from '$lib/chat';

    import HelpKeyboard from './Modal_KeyboardHelp.svelte';

    let isVisible = false;

    onMount(() => {
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

    async function onGlobalKeypress(ev) {
        if (ev.key === 'Escape') {
            $inputText = '';
            $inferringInProgress = false;
            ebk_inputBoxFocus();
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
                $inputText = last_user_message;
                ebk_inputBoxFocus();
                ev.preventDefault();
            }
        }

        // ctrl+backspace
        if (ev.key === 'Backspace' && ev.ctrlKey) {
            if ($inputText.length === 0 && $chatTimeline.length > 0) {
                ebk_inputBoxBack();
                ev.preventDefault();
            }
        }

        // ctrl+e
        if (ev.key === 'e' && ev.ctrlKey) {
            if ($chatTimeline.length > 0) {
                await rerollLastResponse();
                ebk_inputBoxFocus();
                ev.preventDefault();
            }
        }

        // ctrl+space
        if (ev.key === ' ' && ev.ctrlKey) {
            ebk_inputBoxFocus();
            ev.preventDefault();
        }

        // ctrl+/
        if (ev.key === '/' && ev.ctrlKey) {
            isVisible = !isVisible;
            ev.preventDefault();
        }
    }
</script>

<HelpKeyboard {isVisible} />
