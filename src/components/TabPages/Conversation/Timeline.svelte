<script>
    import { onMount, tick } from 'svelte';

    import { chatTimeline, isInferring } from '../../../stores/stores';
    import ConversationTimeline from './Timeline/ConversationTimeline.svelte';
    import InputBox from './InputBox/InputBox.svelte';
    import ModelList from './ModelList/ModelList.svelte';

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
</style>
