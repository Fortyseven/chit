<script>
    import { responseInProgress } from '$lib/api/api';
    import ChatButton from '../../../UI/ChatButton.svelte';

    export let line;

    $: processedLine = line.content.replace(/\n/g, '<br>');
</script>

<div class="user text-white" class:loading={$responseInProgress}>
    <div class="text">
        {@html processedLine}
        {#if line.images[0]}
            <img
                class="pasted-image"
                src={'data:image/png;base64,' + line.images[0]}
            />
        {/if}
    </div>
    <div class="controls">
        <ChatButton
            tooltip="Copy to clipboard"
            iconName="clipboard"
            onClick={() => {
                navigator.clipboard.writeText(line.content.trim());
            }}
        />
    </div>
</div>

<style lang="scss">
    .user {
        flex: auto;
        display: flex;

        .text {
            flex: auto;
            color: var(--primary-fg);
            line-height: 1.35em;
            &::before {
                content: '> ';
                font-weight: bold;
            }
        }
        .controls {
            flex: none;
            width: 1.5em;
            margin-left: 1em;
            display: flex;
            flex-direction: column;
            gap: 0.25em;
        }
        .pasted-image {
            box-shadow: 0 0 10px rgba(0, 0, 0, 1);
            max-width: 512px;
            max-height: 512px;
        }
    }
</style>
