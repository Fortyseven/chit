<script>
    // @ts-nocheck

    import { onMount } from 'svelte';
    import { get } from 'svelte/store';

    import { chat_log, chat_state } from '$stores/chat_state.js';

    import ChatButton from '$components/UI/ChatButton.svelte';
    import { restoreChatStateLog, saveChatStateToLog } from '$lib/log';
    // import * as Storages from '$stores/stores.js';

    onMount(() => {
        console.log('chat_state', get(chat_state));
    });
</script>

<!-- {@debug chat_state} -->
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
    <div class="chat-list">
        {#each $chat_log as { chat_state, chat_timeline }, index}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
                class="chat-entry"
                on:click={restoreChatStateLog(chat_state.guid)}
            >
                {#if chat_timeline[1]}
                    <ul>
                        <li>
                            <!-- svelte-ignore a11y-label-has-associated-control -->
                            <label>
                                {chat_timeline[0].content}
                            </label>
                            <div class="response-extract">
                                {chat_timeline[1].content.substring(0, 80)}...
                            </div>
                        </li>
                    </ul>
                {/if}
                <hr />
            </div>
        {/each}
    </div>
</aside>

<style lang="scss">
    .chat-entry {
        cursor: pointer;
        display: flex;
        border-bottom: 1px solid black;
        padding: 0.5em 0;

        hr {
            padding: 0;
            margin: 1em 0;
        }

        ul {
            list-style: none;
            padding: 0;
            display: flex;
            // flex-wrap: wrap;
            flex-direction: column;
            margin: auto;

            li {
                flex: 1 1 auto;

                margin: 0;
                padding: 0;
                // display: flex;

                label {
                    display: block;
                    margin-bottom: 0.5em;
                    color: white;
                    width: 6.5em;
                }
                .response-extract {
                    //
                }
            }
        }
    }
</style>
