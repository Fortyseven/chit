<script>
    import { onMount } from 'svelte';

    import { appState, contentEl, chatTimeline } from '$stores/stores';
    import { responseInProgress } from '$lib/api/api';

    import Timeline from './Timeline.svelte';
    import InputBox from '../InputBox/InputBox.svelte';
    import LoadingStripe from './LoadingStripe.svelte';
    import StatusBar from '../StatusBar/StatusBar.svelte';
    import { scrollToBottom } from '$lib/chat';
    import { playSndResponse } from '$lib/audio';

    let chatContentEl = undefined;

    chatTimeline.subscribe(async (value) => {
        // scrollToBottom();
    });

    let responseScrollTimer = null;

    $: {
        if (chatContentEl !== undefined) {
            contentEl.set(chatContentEl);
        }
    }

    responseInProgress.subscribe(async (inReceivingResponse) => {
        if (inReceivingResponse) {
            console.log('responseInProgress starting scroll');
            if (responseScrollTimer) clearInterval(responseScrollTimer);

            responseScrollTimer = setInterval(() => {
                console.log('responseInProgress scrolling');
                scrollToBottom();
            }, 250);
        } else {
            playSndResponse();

            if (responseScrollTimer) clearInterval(responseScrollTimer);
            setTimeout(() => {
                scrollToBottom();
            }, 500);
            console.log('responseInProgress stopping scroll');
        }
    });

    onMount(() => {
        scrollToBottom();
    });
</script>

<div
    id="TimelineContainer"
    class="flex flex-row w-full h-full m-h-[calc(100vh-5em)] m-auto {$appState
        .ui.constrainChatWidth && 'max-w-7xl'}"
    class:max-w-7xl={$appState.ui.constrainChatWidth}
>
    <div
        class="flex flex-col w-full h-full scroll-smooth"
        class:constrain-width={$appState.constrainChatWidth}
    >
        <div
            class="w-full h-full overflow-y-scroll conversation-timeline px-4 pb-4 transition-all"
            bind:this={chatContentEl}
        >
            <Timeline />
        </div>
        <div class="flex-shrink-0 w-full loading-stripe">
            <LoadingStripe />
        </div>
        <div class="flex-shrink-0 w-full input-box">
            <InputBox />
        </div>
        <div>
            <StatusBar />
        </div>
    </div>
</div>

<style lang="scss">
    .ztimeline-container {
        display: flex;
        flex-direction: row;
        height: 100%;
        max-height: calc(100vh - 5em);
        gap: 0.5em;
        max-width: unset;
        margin: auto;

        .left,
        .right {
            display: flex;
            flex-direction: column;
            gap: 0.5em;
            flex: 1 1 auto;
            height: 100%;
            background: #303030;
            max-width: 20vw;
        }
        .right {
            flex: 0 0 20vw;
            @media (max-width: $breakpoint-medium) {
                flex-basis: 300px;
            }
        }
        .left {
            @media (max-width: $breakpoint-medium) {
                display: none;
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
                flex: 1 1 0;
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
