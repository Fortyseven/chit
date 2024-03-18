<script>
    import { onMount } from 'svelte';

    import { appState, errorMessage } from '$stores/stores';

    import { init } from '$lib/init';

    import Settings from './components/TabPages/Settings/Settings.svelte';

    import ErrorModal from './components/ErrorModal.svelte';
    import DebugStatePanel from './components/UI/DebugStatePanel/DebugStatePanel.svelte';
    import MenuBar from '$components/Tabs/MenuBar.svelte';
    import Chat from '$components/TabPages/Conversation/Chat/Chat.svelte';
    import Presets from '$components/TabPages/Presets/Presets.svelte';

    const PAGES = {
        presets: Presets,
        settings: Settings
    };

    onMount(async () => {
        console.log('onMount');
        await init();
    });
</script>

<div class="flex flex-row w-full h-full bg-[#f0f]">
    <!-- --------- -->
    <div class="flex-[0%] flex-grow-0 flex-shrink-0 bg-neutral-500">
        <MenuBar />
    </div>
    <!-- --------- -->
    <div
        class="flex-grow-0 flex-shrink-0 w-full max-w-[400px] 2xl:max-w-[640px] p-4 bg-neutral-600"
    >
        <svelte:component this={PAGES[$appState.ui.selectedTab]} />
    </div>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <!-- <div class="w-1 bg-black cursor-row-resize"></div> -->
    <!-- --------- -->
    <div class="flex-auto bg-neutral-700">
        <Chat />
    </div>
    <!-- --------- -->
</div>
<DebugStatePanel />

{#if $errorMessage}
    <ErrorModal />
{/if}

<style lang="scss" global>
    .tab-container {
        // display: flex;
        // flex-direction: column;
        // width: 100%;
        // height: 100%;

        .tab-content {
            // width: 100%;
            // height: 100%;
            // display: grid;
            // padding: 1em 0.5em;
            // gap: 0.5em;
        }
    }

    :global(fieldset) {
        padding: 1em;
        border: 1px solid #333;
        border-radius: 14px;
        border-left-color: #444 !important;
        border-right-color: #444 !important;
        border-bottom-color: #888 !important;
        background-color: #222;
        background-image: linear-gradient(0deg, #000 50%, #1a1a1a 100%);

        legend {
            font-size: 1.2em;
            color: #fff;
            font-weight: bold;
            padding-left: 0.25em;
            padding-right: 0.25em;
        }
    }

    :global(input),
    :global(select) {
        background-color: #222;
        color: white;
        padding: 0.5em;
        border-radius: 0.25em;
    }

    .debug1 {
        border: 1px solid #f00;
    }
    .debug3 {
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
