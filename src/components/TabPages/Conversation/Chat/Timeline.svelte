<script>
    import { chatTimeline } from '$stores/stores';
    import { pendingResponse, responseInProgress } from '$lib/api/api';
    import { getFollowUps } from '../InputBox/ConvoTools.store.js';

    import ConversationTimelineResponse_User from './TimelineResponse_User.svelte';
    import ConversationTimelineResponse_Assistant from './TimelineResponse_Assistant.svelte';
    import TimelineResponseAssistant from './TimelineResponse_Assistant.svelte';
    import FollowUps from './FollowUps.svelte';
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
    <!-- ---------------------------------------------------------- -->
    {#if $responseInProgress}
        <div>
            <TimelineResponseAssistant line={$pendingResponse} index={-1} />
        </div>
    {/if}
    <!-- ---------------------------------------------------------- -->
    {#if $getFollowUps && !$responseInProgress && $chatTimeline.length !== 0}
        <FollowUps />
    {/if}
</div>

<style lang="scss" global>
    .timeline {
        display: flex;
        flex-direction: column;
        gap: 0.75em;
        font-size: 1.15em;

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
                margin-block: 1em;
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
                // color: var(--accent-color1);
                color: rgb(191, 191, 191);
                line-height: 1.1em;
            }

            p {
                margin-bottom: 1em;
            }

            hr {
                margin: 2em 10% !important;
                border: 1px;
                border-color: #40f;
                border-style: dashed;
            }

            h5,
            h4,
            h3,
            h2,
            h1 {
                color: white;
                font-weight: bold;
                margin: 0.5em 0 0.5em 0;
                border-bottom: 3px solid #fff8;
                padding-bottom: 0.5em;
                font-size: 1.5em;
                margin-block-start: 1.5em;
                &::before {
                    content: '# ';
                    opacity: 0.5;
                }

                strong {
                    color: inherit !important;
                    &::before,&::after {
                        content: unset;
                    }
                    text-decoration: underline;
                }
            }

            h2 {
                color: rgb(104, 187, 255);
                font-size: 1.3em;
                border-bottom: 2px solid white;
                border-bottom-style: double;
                border-bottom-color: #4af4;
                &::before {
                    content: '## ';
                    opacity: 0.5;
                }
            }

            h3 {
                color: var(--accent-color);
                font-size: 1.1em;
                border-bottom: 2px solid white;
                border-bottom-style: solid;

                border-bottom-color: #faa2;
                &::before {
                    content: '### ';
                    opacity: 0.5;
                }
            }

            h4 {
                color: rgb(179, 251, 255);
                font-size: 0.9em;
                font-weight: bold;
                font-style:italic;
                border-bottom: none;
                text-decoration: none;
                &::before {
                    content: '#### ';
                    opacity: 0.5;
                }
            }

            h5 {
                color: white;
                font-size: 0.8em;
                font-weight: bold;
                font-style: italic;
                border-bottom: none;
                text-decoration: none;
                &::before {
                    content: '##### ';
                    opacity: 0.5;
                }
            }

            h6 {
                color: #aaa;
                font-size: 0.8em;
                font-weight: normal;
                // font-style: italic;
                border-bottom: none;
                text-decoration: none;
                &::before {
                    content: '###### ';
                    color: white;
                    opacity: 0.25;
                }
            }

            table {
                outline: 1px solid var(--accent-color-darker4);
                box-shadow: 0 0 20px black;
                width:100%;
                margin-block: 1em;
                th {
                    background-color: var(--accent-color-darker4);
                    padding: 0.5em;
                    text-align: center !important;
                    color: black !important;
                    strong {
                        color: black !important;
                        &::before,&::after {
                            content: unset;
                        }
                    }
                }
                tr {
                    background-color: #202020;
                    color: white;
                    td {
                        outline: 1px solid var(--accent-color-darker4);
                        padding: 0.25em;

                        text-align: left !important;
                    }
                }
            }
        }
    }
</style>
