<script>
    // @ts-nocheck

    import { onMount } from 'svelte';
    import { get } from 'svelte/store';

    import { chat_log, chatState } from '$stores/chatState.js';

    import ChatButton from '$components/UI/ChatButton.svelte';
    import { restoreChatStateLog, saveChatStateToLog } from '$lib/log';

    onMount(() => {
        console.log('chatState', get(chatState));
    });
</script>

<!-- {@debug chatState} -->
<aside id="ChatLog">
    <h1>Chat Log</h1>
    <div class="controls">
        <ChatButton
            label="Save Current Chat"
            iconName="save"
            onClick={saveChatStateToLog}
        />
    </div>
    <hr />
    <div class="chat-log-container">
        <div class="chat-list">
            {#each $chat_log as { chatState, chat_timeline }, index}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div class="entry-wrapper">
                    <div
                        class="chat-details"
                        on:click={restoreChatStateLog(chatState.guid)}
                    >
                        {#if chat_timeline[1]}
                            <!-- svelte-ignore a11y-label-has-associated-control -->
                            <label class="title">
                                {chat_timeline[0].content}
                            </label>
                            <div class="response-extract">
                                {chat_timeline[1].content.substring(0, 80)}...
                            </div>
                        {/if}
                    </div>
                    <div class="entry-controls">
                        <ChatButton
                            iconName="delete"
                            onClick={() => {
                                chat_log.update((log) => {
                                    log.splice(index, 1);
                                    return log;
                                });
                            }}
                        />
                    </div>
                </div>
            {/each}
        </div>
    </div>
</aside>

<style lang="scss">
    #ChatLog {
        height: 100%;
        overflow: hidden;

        @media (max-width: $breakpoint-medium) {
            max-width: 300px;
        }

        h1 {
            color: white;
            font-size: 1.5em;
            text-align: center;
            padding: 0.25em 1em;
        }

        .chat-log-container {
            height: 100%;
            max-height: 100%;
            padding-bottom: 1em;
            padding-left: 0.5em;
            padding-right: 0.5em;
            overflow-y: scroll;

            .entry-wrapper {
                display: flex;
                flex-direction: row;
                &:hover {
                    background-color: #ffffff0e;
                }

                .chat-details {
                    flex: 1 1 auto;
                    width: 100%;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    padding: 0.5em 0;
                    overflow: auto;

                    .title {
                        color: var(--accent-color1);
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        font-size: 1.2em;
                        width: 100%;
                    }

                    hr {
                        padding: 0;
                        margin: 1em 0;
                    }

                    label {
                        display: block;
                        margin-bottom: 0.5em;
                        width: 6.5em;
                    }
                }

                .entry-controls {
                    flex: 1 1 2em;
                    button {
                        height: 2em !important;
                        line-height: 0;
                    }
                }
            }
        }
    }
</style>
