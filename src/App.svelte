<script>
    import { onMount } from 'svelte';

    import { appState, chatTimeline, errorMessage } from '$stores/stores';

    import { init } from '$lib/init';

    import Settings from './components/TabPages/Settings/Settings.svelte';

    import ErrorModal from './components/ErrorModal.svelte';
    import DebugStatePanel from './components/UI/DebugStatePanel/DebugStatePanel.svelte';
    import MenuBar from '$components/Tabs/MenuBar.svelte';
    import Chat from '$components/TabPages/Conversation/Chat/Chat.svelte';
    import Presets from '$components/TabPages/Presets/Presets.svelte';
    import Variables from '$components/TabPages/Variables/Variables.svelte';

    const PAGES = {
        presets: Presets,
        variables: Variables,
        settings: Settings
    };

    onMount(async () => {
        console.log('onMount');
        await init();
    });
</script>

<div class="flex flex-row w-full h-full bg-black">
    <!-- --------- -->
    <div class="flex-grow-0 flex-shrink-0">
        <MenuBar />
    </div>
    <!-- --------- -->
    <div
        class="w-full max-w-[400px] 2xl:max-w-[640px] p-4 bg-core-color-darker1 resize-x overflow-x"
    >
        <svelte:component this={PAGES[$appState.ui.selectedTab]} />
    </div>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <!-- <div class="w-1 bg-black cursor-row-resize"></div> -->
    <!-- --------- -->
    <div class="flex-auto bg-core-color-darker2">
        <Chat />
    </div>
    <!-- --------- -->
</div>
<!-- <DebugStatePanel /> -->

{#if $errorMessage}
    <ErrorModal />
{/if}

<style lang="scss" global>
    :global(input),
    :global(select) {
        background-color: #222;
        color: white;
        padding: 0.5em;
        border-radius: 0.25em;
    }

    :global(input[type='checkbox']) {
        width: 1em;
        height: 1em;
        accent-color: var(--accent-color);
    }

    .debug1 {
        border: 1px solid #f00;
    }
    .debug2 {
        border: 1px solid #0f0;
    }
    .debug3 {
        border: 1px solid #00f;
    }
    .debug4 {
        border: 1px solid #f0f;
    }

    .debug1,
    .debug2,
    .debug3,
    .debug4 {
        box-shadow: 0 0 8px #000;
        animation: debug-throb 800ms ease-in-out infinite;

        @keyframes debug-throb {
            50% {
                border-color: white;
            }
        }
    }
</style>
