<script>
    import { onMount } from 'svelte';

    import Conversation from './components/Conversation/Conversation.svelte';
    import Sidebar from './components/Conversation/Sidebar/Sidebar.svelte';
    import Settings from './components/Settings/Settings.svelte';

    import { init } from './lib/init';
    import { errorMessage, selectedTab } from './stores/stores';
    import ErrorModal from './components/ErrorModal.svelte';
    import TabBar from './components/Tabs/TabBar.svelte';

    onMount(async () => {
        console.log('onMount');
        await init();
    });
</script>

<div class="tab-container">
    <div class="tab-bar">
        <TabBar />
    </div>
    <div class="tab-content">
        {#if $selectedTab === 'settings'}
            <Settings />
        {:else if $selectedTab === 'modelfiles'}
            modemslsdsml
        {:else}
            <div class="chat-content">
                <div class="sidebar has-background-black-ter">
                    <Sidebar />
                </div>
                <div class="conversation">
                    <Conversation />
                </div>
            </div>
            <!-- <ModelList /> -->
        {/if}
    </div>
</div>

<div class="error-message"></div>
{#if $errorMessage}
    <ErrorModal message={$errorMessage} />
{/if}

<style lang="scss">
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

            .chat-content {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: row;
                gap: 0.5em;
                .sidebar {
                    flex: 0 0 300px;
                    width: 300px;
                    height: 100%;
                }

                .conversation {
                    flex: auto;
                    width: 100%;
                    height: 90vh;
                }
            }
        }
    }
</style>
