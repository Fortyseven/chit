<script>
    import { createEventDispatcher, onDestroy, onMount } from 'svelte';
    import {
        chatTimeline,
        inputText,
        inferringInProgress
    } from '../../../../stores/stores';
    import { eventBus__keyboard } from '../../../../lib/events/eventBus__keyboard';
    import { rerollLastResponse } from '../../../../lib/chat';

    const dispatch = createEventDispatcher();

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

    function focusInputBox() {
        // dispatch('inputbox-focus', {});
        $eventBus__keyboard = 'inputbox-focus';
    }

    function onBackInputBox() {
        // dispatch('inputbox-back', {});
        $eventBus__keyboard = 'inputbox-back';
    }

    function onGlobalKeypress(ev) {
        if (ev.key === 'Escape') {
            $inputText = '';
            $inferringInProgress = false;
            focusInputBox();
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
                focusInputBox();
                ev.preventDefault();
            }
        }

        // ctrl+backspace
        if (ev.key === 'Backspace' && ev.ctrlKey) {
            if ($inputText.length === 0 && $chatTimeline.length > 0) {
                onBackInputBox();
                ev.preventDefault();
            }
        }

        // ctrl+e
        if (ev.key === 'e' && ev.ctrlKey) {
            if ($chatTimeline.length > 0) {
                rerollLastResponse();
                ev.preventDefault();
            }
        }
    }
</script>
