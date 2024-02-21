<script>
    import markdownit from 'markdown-it';
    import { onMount } from 'svelte';

    export let line;

    let processAsMarkdown = false;
    let viewSource = false;
    const md = markdownit();

    onMount(() => {
        if (line.content.includes('```')) {
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
        <button
            title="To Clipboard"
            on:click={() => {
                navigator.clipboard.writeText(line.content);
            }}>C</button
        >
        <button title="Retry">R</button>
        <button
            title="Process as Markdown"
            on:click={() => {
                processAsMarkdown = !processAsMarkdown;
                viewSource = false;
            }}
            class:on={processAsMarkdown}
        >
            M
        </button>
        <button
            title="View Source"
            on:click={() => {
                processAsMarkdown = false;
                viewSource = !viewSource;
            }}
            class:on={viewSource}
        >
            V
        </button>
    </div>
</div>

<style lang="scss">
    .bot {
        flex: auto;
        display: flex;
        background-color: #0004;
        padding: 1em;
        border-radius: 10px;
        background-image: linear-gradient(180deg, #1d1d1d 0%, #000 100%);
        border-top: 1px solid black;
        border-bottom: 1px solid #fff3;
        color: white;

        .text {
            flex: auto;
            color: #ddd;
        }
        .controls {
            flex: none;
            width: 24px;
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
                    border: 1px solid #ffff;
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
