<script>
    import { onMount } from 'svelte';
    import markdownit from 'markdown-it';

    import {
        chatTimeline,
        defaultMarkdown,
        isBeingEditedIndex
    } from '$stores/stores';
    import { rerollLastResponse } from '$lib/chat';

    import ChatButton from '../../../UI/ChatButton.svelte';
    import { hljs } from '../../../../lib/vendor/highlight.min.js';

    export let line;
    export let index;

    let textEl;

    let areControlsVisible = false;

    let viewMode = 'markdown';

    const md = markdownit({
        highlight: function (str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    const hl = hljs.highlight(str, { language: lang }).value;
                    return hl;
                } catch (__) {}
            }

            return ''; // use external default escaping
        }
    });

    /* ----------------- */

    onMount(() => {
        if (line.content.includes('```') || $defaultMarkdown) {
            viewMode = 'markdown';
        }
    });

    /* ----------------- */

    function endEditing() {
        chatTimeline.update((t) => {
            t[$isBeingEditedIndex] = {
                role: 'assistant',
                content: textEl.value.trim()
            };
            return t;
        });

        textEl.removeEventListener('blur', endEditing);
        $isBeingEditedIndex = undefined;
    }

    /* ----------------- */

    function editEntry(index) {
        if ($isBeingEditedIndex) {
            // save
            endEditing();
        } else {
            $isBeingEditedIndex = index;

            // hook on blur but give time for the component to swap out; this is a hack
            setTimeout(() => {
                textEl.addEventListener('blur', endEditing);
                textEl.focus();
                textEl.style.height = '';
                textEl.style.height = textEl.scrollHeight + 'px';
                textEl.setSelectionRange(0, textEl.value.length);
            }, 150);
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
    {#if $isBeingEditedIndex === index}
        <textarea
            class="w-full font-mono bg-black text-white text-sm"
            bind:this={textEl}>{line.content.trim()}</textarea
        >
    {:else}
        <div class="text" bind:this={textEl}>
            {#if viewMode == 'source'}
                <pre>{line.content}</pre>
            {:else}
                {@html processedContent}
            {/if}
        </div>
    {/if}
    <div
        class="controls"
        class:visible={areControlsVisible || $isBeingEditedIndex}
    >
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
        padding: 1em;
        border-radius: 10px;
        background-image: linear-gradient(
            140deg,
            #ffffff0e 0%,
            rgba(0, 0, 0, 0.73) 100%
        );
        border-bottom: 1px solid #fff1;
        color: white;

        .text {
            flex: auto;
            color: var(--accent-color-lighter4);
            line-height: 1.35em;
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
