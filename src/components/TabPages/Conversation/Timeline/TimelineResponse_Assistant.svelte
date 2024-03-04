<script>
    import markdownit from 'markdown-it';
    import { onMount } from 'svelte';
    import { defaultMarkdown } from '../../../../stores/stores';
    import { rerollLastResponse } from '../../../../lib/chat';
    import ChatButton from '../../../UI/ChatButton.svelte';

    export let line;
    export let index;

    let processAsMarkdown = false;
    let viewSource = false;
    const md = markdownit();

    onMount(() => {
        if (line.content.includes('```') || $defaultMarkdown) {
            processAsMarkdown = true;
        }
    });

    $: processedContent = processAsMarkdown
        ? md.render(line.content.trim()).trim()
        : line.content.trim();
</script>

<div class="bot">
    <div class="text">
        {#if viewSource}
            <pre>{line.content}</pre>
        {:else}
            {@html processedContent}
        {/if}
    </div>
    <div class="controls">
        <!-- -------------- -->
        <ChatButton
            tooltip="Copy to clipboard"
            iconName="clipboard"
            onClick={() => {
                navigator.clipboard.writeText(line.content.trim());
            }}
        />
        <!-- -------------- -->
        <ChatButton
            onClick={() => {
                processAsMarkdown = !processAsMarkdown;
                viewSource = false;
            }}
            tooltip="Process as Markdown"
            iconName="text"
            enabled={processAsMarkdown}
        />
        <!-- -------------- -->
        <ChatButton
            onClick={() => {
                processAsMarkdown = false;
                viewSource = !viewSource;
            }}
            tooltip="View raw source"
            iconName="book"
            enabled={viewSource}
        />
        <!-- -------------- -->
        <ChatButton
            onClick={() => rerollLastResponse(index)}
            tooltip="Rewind chat to here and reroll this response"
            iconName="refresh"
        />
        <!-- -------------- -->
    </div>
</div>

<style lang="scss">
    .bot {
        flex: auto;
        display: flex;
        background-color: #0006;
        padding: 1em;
        border-radius: 10px;
        // background-image: linear-gradient(180deg, #1d1d1d 0%, #000 100%);
        border-top: 1px solid black;
        border-bottom: 1px solid #fff3;
        color: white;

        .text {
            flex: auto;
            color: #ddd;
            overflow: none;
        }
        .controls {
            flex: none;
            width: 1.5em;
            margin-left: 1em;
            display: flex;
            flex-direction: column;
            gap: 0.25em;
            button {
                background: #333;
                border-radius: 4px;
                color: white;
                border: none;
                font-size: 10pt;

                &:hover {
                    background: #444;
                    cursor: pointer;
                }
                &.on {
                    animation: fadein 0.5s;
                    background-color: #777;
                    color: black;
                    @keyframes fadein {
                        from {
                            border: 1px solid #fff0;
                        }
                        to {
                            border: 1px solid #ffff;
                        }
                    }
                }
            }
        }
    }
</style>
