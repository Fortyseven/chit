<script>
    import { responseInProgress } from '$lib/api/api';
    import ChatButton from '../../../UI/ChatButton.svelte';

    export let line;

    // replace \n with <br>
    $: processedLine = line.content.replace(/\n/g, '<br>');
</script>

<div class="user text-white" class:loading={$responseInProgress}>
    <div class="text">
        {@html processedLine}
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
    }
</style>
