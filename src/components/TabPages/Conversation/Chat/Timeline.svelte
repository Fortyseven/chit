<script>
    import { chatTimeline } from '$stores/stores';
    import { pendingResponse, responseInProgress } from '$lib/api/api';

    import ConversationTimelineResponse_User from './TimelineResponse_User.svelte';
    import ConversationTimelineResponse_Assistant from './TimelineResponse_Assistant.svelte';
    import TimelineResponseAssistant from './TimelineResponse_Assistant.svelte';
</script>

<div class="timeline py-4">
    {#each $chatTimeline as line, index}
        <div class="flex gap-2">
            <div class="flex-auto">
                {#if line}
                    {#if line?.role === 'user'}
                        <ConversationTimelineResponse_User {line} {index} />
                    {:else if line?.role === 'assistant'}
                        <ConversationTimelineResponse_Assistant
                            {line}
                            {index}
                        />
                    {:else if line?.role === 'error'}
                        <div class="bot error">
                            {line?.content}
                        </div>
                    {/if}
                {:else}
                    <div class="bot">💀</div>
                {/if}
            </div>
            <div
                class="place-content-center flex-shrink w-3 opacity-15 text-base"
            >
                {index + 1}
            </div>
        </div>
    {/each}
    {#if $responseInProgress}
        <div>
            <TimelineResponseAssistant line={$pendingResponse} index={-1} />
        </div>
    {/if}
</div>

<style lang="scss" global>
    .timeline {
        display: flex;
        flex-direction: column;
        gap: 0.75em;
        font-size: 1.35em;
        .text {
            width: calc(100% - 100px);
            overflow-x: unset;

            ol,
            ul {
                margin-top: 0;
                list-style: square;
                margin-left: 1em;
                list-style-type: decimal;

                li {
                    margin-bottom: 0.5em;
                }
            }

            pre {
                max-width: 100%;
                color: #fb0;
                background-color: #000;
                line-height: 1.1em;
                font-family: monospace !important;
                background-image: linear-gradient(
                    0deg,
                    #ffffff16 0%,
                    transparent 100%
                );
                background-size: 100% 4px;
                background-repeat: repeat-y;
                border-radius: 10px;
                border-bottom: 1px solid #333;
                font-size: 0.8em;
                letter-spacing: -1px;
                white-space: break-spaces;
            }

            em,
            strong {
                // color: rgb(193, 166, 91) !important;
                color: var(--accent-color-lighter1, #f0f) !important;
                font-weight: bold;

                &::before {
                    content: '**';
                    font-weight: normal;
                    opacity: 0.65;
                }

                &::after {
                    content: '**';
                    font-weight: normal;
                    opacity: 0.65;
                }
            }
            em {
                &::before {
                    content: '*';
                    font-weight: normal;
                    opacity: 0.65;
                }

                &::after {
                    content: '*';
                    font-weight: normal;
                    opacity: 0.65;
                }
            }

            code {
                font-family: monospace !important;
                color: var(--accent-color1);
                line-height: 1.1em;
            }

            p {
                margin-bottom: 1em;
            }

            h4,
            h3,
            h2,
            h1 {
                color: var(--accent-color2);
                font-weight: bold;
                margin: 0.5em 0 0.5em 0;
                border-bottom: 1px solid rgba(0, 187, 255, 0.5);
                font-size: 1.2em;
            }

            h2 {
                color: #0ff;
                font-size: 1.1em;
            }

            h3 {
                color: #aff;
                font-size: 1em;
            }
        }
    }
</style>
