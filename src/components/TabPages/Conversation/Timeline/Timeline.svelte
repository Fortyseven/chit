<script>
    import { onMount } from 'svelte';

    import ConversationTimeline from './ConversationTimeline.svelte';
    import InputBox from '../InputBox/InputBox.svelte';
    import ModelList from '../ModelList/ModelList.svelte';
    import { chatTimeline, isInferring } from '../../../../stores/stores';

    let contentEl = undefined;

    function scrollToBottom() {
        if (contentEl) {
            setTimeout(() => {
                contentEl.scrollTop = contentEl.scrollHeight;
            }, 50);
            // await tick();
        }
    }

    chatTimeline.subscribe(async (value) => {
        console.log('chatTimeline UPDATED', value);
        scrollToBottom();
    });

    isInferring.subscribe(async (value) => {
        console.log('isInferring UPDATED', value);
        scrollToBottom();
    });

    onMount(() => {
        scrollToBottom();
    });
</script>

<div class="container">
    <div class="model-list"><ModelList /></div>
    <div class="content has-background-black-ter" bind:this={contentEl}>
        <ConversationTimeline />
    </div>
    <div class="loading-stripe" class:isLoading={$isInferring}></div>
    <div class="chat-input">
        <InputBox />
    </div>
</div>

<style lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: 0.5em;

        .model-list {
            flex: none;
        }
        .content {
            flex: 1 1 auto;
            background-color: var(--color-bg-1);
            border-radius: 10px;
            padding: 1em;
            margin: 0;
            overflow: scroll;
        }
        .chat-input {
            flex: none;
        }
    }
    .loading-stripe {
        width: 100%;
        height: 1em;
        background-color: #300;
        border-radius: 4px;

        &.isLoading {
            background-color: #f00;
            animation: pulse 750ms infinite;
            border: 1px solid red;
            display: none;
        }
    }
    @keyframes pulse {
        0% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
        100% {
            opacity: 1;
        }
    }
</style>
