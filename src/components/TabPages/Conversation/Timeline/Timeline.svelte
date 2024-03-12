<script>
    import { onMount } from 'svelte';

    import { chatTimeline, isInferring } from '$stores/stores';

    import ChatLog from '../ChatLog/ChatLog.svelte';
    import ChatSettings from '../ChatSettings/ChatSettings.svelte';
    import ConversationTimeline from './ConversationTimeline.svelte';
    import InputBox from '../InputBox/InputBox.svelte';
    import LoadingStripe from './LoadingStripe.svelte';
    import { appState } from '$stores/stores_ui';

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

<div class="timeline-container">
    <div class="left">
        <div class="content">
            <ChatLog />
        </div>
    </div>

    <div class="center" class:constrain-width={$appState.constrainChatWidth}>
        <div class="conversation-timeline" bind:this={contentEl}>
            <ConversationTimeline />
        </div>
        <div class="loading-stripe">
            <LoadingStripe />
        </div>
        <div class="input-box">
            <InputBox />
        </div>
    </div>
    <div class="right">
        <div class="content">
            <ChatSettings />
        </div>
    </div>
</div>

<style lang="scss">
    .timeline-container {
        display: flex;
        flex-direction: row;
        height: 100%;
        gap: 0.5em;
        // border: 1px solid red; //1344px
        max-width: unset;
        margin: auto;
        // padding: 1em;

        .left,
        .right {
            display: flex;
            flex-direction: column;
            gap: 0.5em;
            flex: 0 0 300px;
            height: 100%;
            background: #303030;
        }
        .left {
            // display: none;
        }
        .right {
            flex: 0 0 600px;
            @media (max-width: $breakpoint-medium) {
                flex-basis: 300px;
            }
        }
        .center {
            height: 100%;
            display: flex;
            gap: 0.5em;
            flex-direction: column;
            margin: auto;
            width: 100%;

            &.constrain-width {
                max-width: 1280px;
            }

            .conversation-timeline {
                background-color: #161920;
                flex: 1 1 0;
                padding: 1em;
                overflow-y: auto;
            }

            .loading-stripe {
                flex: 0 0 0.25em;
            }

            .input-box {
                flex: 0 0 auto;
            }
        }

        .model-list {
            flex: none;
        }
        .content {
            flex: 1 1 auto;
            background-color: var(--color-bg-1);
            padding: 1em;
            margin: 0;
            overflow: scroll;
            border-radius: 4px;
            border-top: 2px solid rgba(0, 0, 0, 0.2666666667);
            border-bottom: 1px solid rgba(255, 255, 255, 0.2666666667);
        }
        .input-box {
            flex: none;
        }
    }
</style>
