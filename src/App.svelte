<script>
    import { onMount } from 'svelte';

    import Settings from './components/TabPages/Settings/Settings.svelte';

    import { init } from './lib/init';
    import { errorMessage, selectedTab } from './stores/stores';

    import Conversation from './components/TabPages/Conversation/Conversation.svelte';
    import ErrorModal from './components/ErrorModal.svelte';
    import Modelfiles from './components/TabPages/Modelfiles/Modelfiles.svelte';
    import Prompts from './components/TabPages/Prompts/Prompts.svelte';
    import TabBar from './components/Tabs/TabBar.svelte';

    onMount(async () => {
        console.log('onMount');
        await init();
    });

    const PAGES = {
        chat: Conversation,
        modelfiles: Modelfiles,
        settings: Settings,
        prompts: Prompts
    };
</script>

<div class="tab-container">
    <div class="tab-bar">
        <TabBar />
    </div>
    <div class="tab-content">
        <svelte:component this={PAGES[$selectedTab]} />
    </div>
</div>

<div class="error-message"></div>
{#if $errorMessage}
    <ErrorModal message={$errorMessage} />
{/if}

<style lang="scss" global>
    .tab-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;

        .tab-bar {
            flex: 0;
        }
        .tab-content {
            width: 100%;
            height: 100%;
            display: grid;
            // grid-template-columns: 1fr 3fr;
            padding: 1em 0.5em;
            gap: 0.5em;
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
        box-shadow: 0 0 10px #fff1;
        legend {
            font-size: 1.2em;
            color: #fff;
            font-weight: bold;
            padding-left: 0.25em;
            padding-right: 0.25em;
        }
    }
</style>
