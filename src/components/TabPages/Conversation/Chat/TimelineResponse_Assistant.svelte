<script>
    import { onMount } from 'svelte';
    import markdownit from 'markdown-it';

    import { chatTimeline, defaultMarkdown } from '$stores/stores';
    import { rerollLastResponse } from '$lib/chat';

    import ChatButton from '../../../UI/ChatButton.svelte';

    export let line;
    export let index;

    let textEl;
    let isBeingEdited = false;
    let areControlsVisible = false;

    let viewMode = 'markdown';

    const md = markdownit();

    /* ----------------- */

    onMount(() => {
        if (line.content.includes('```') || $defaultMarkdown) {
            viewMode = 'markdown';
        }
    });

    /* ----------------- */

    function endEditing() {
        isBeingEdited = false;
        viewMode = 'markdown';

        chatTimeline.update((t) => {
            t[index].content = textEl.textContent.trim();
            return t;
        });

        textEl.contentEditable = false;
        textEl.blur();

        textEl.removeEventListener('blur', endEditing);
    }

    function editEntry(index) {
        if (isBeingEdited) {
            // save
            endEditing();
        } else {
            isBeingEdited = true;
            viewMode = 'source';
            textEl.contentEditable = true;
            textEl.focus();
            // hook on blur
            textEl.addEventListener('blur', endEditing);
        }
    }

    /* ----------------- */

    $: processedContent =
        viewMode == 'markdown'
            ? md.render(line.content.trim()).trim()
            : line.content.trim();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
    class="bot"
    on:mouseover={() => (areControlsVisible = true)}
    on:mouseleave={() => (areControlsVisible = false)}
>
    <div class="text" bind:this={textEl}>
        {#if viewMode == 'source'}
            <pre>{line.content}</pre>
        {:else}
            {@html processedContent}
        {/if}
    </div>
    <div class="controls" class:visible={areControlsVisible || isBeingEdited}>
        <!-- -------------- -->
        <ChatButton
            tooltip="Copy to clipboard"
            iconName="clipboard"
            onClick={() => {
                navigator.clipboard.writeText(line.content.trim());
            }}
        />
        <!-- -------------- -->
        {#if viewMode == 'markdown'}
            <ChatButton
                onClick={() => {
                    viewMode = 'source';
                }}
                tooltip="View raw source"
                iconName="book"
            />
        {:else}
            <ChatButton
                onClick={() => {
                    viewMode = 'markdown';
                }}
                tooltip="Process as Markdown"
                iconName="text"
            />
        {/if}
        <!-- -------------- -->
        <ChatButton
            onClick={() => editEntry(index)}
            tooltip="Edit this response"
            iconName="edit"
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
            opacity: 0;

            transition: opacity 0.25s;

            &.visible {
                opacity: 1;
            }

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
