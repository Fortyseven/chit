<script>
    import { onDestroy, onMount } from 'svelte';

    import {
        appState,
        chatTimeline,
        contentEl,
        defaultModelName,
        inputText,
        models
    } from '$stores/stores';
    import { chatState } from '$stores/chatState';

    import DebugStatePanelValue from './DebugStatePanelValue.svelte';
    import {
        responseInProgress,
        pendingResponse,
        wasAborted
    } from '$lib/api/api';
    import { fade } from 'svelte/transition';

    let visible = false;

    function getTextRep(value) {
        return value;
    }

    function toggleVisibility() {
        visible = !visible;
    }

    function onKeyDown(e) {
        if (e.key === '`' && e.ctrlKey) {
            toggleVisibility();
        }
    }

    onMount(() => {
        window.addEventListener('keydown', onKeyDown);
    });

    onDestroy(() => {
        window.removeEventListener('keydown', onKeyDown);
    });
</script>

{#if visible}
    <div transition:fade id="DebugStatePanel">
        <!-- misc ---------------------------------------------------------- -->

        <DebugStatePanelValue key="apiEndpoint" value={$appState.apiEndpoint} />

        <hr />

        <!-- ui crap ------------------------------------------------------- -->

        <DebugStatePanelValue key="contentEl" value={$contentEl} />

        <DebugStatePanelValue key="inputText" value={$inputText} />

        <DebugStatePanelValue
            key="ui.constrainChatWidth"
            value={$appState.ui.constrainChatWidth}
        />

        <DebugStatePanelValue
            key="ui.selectedTab"
            value={$appState.ui.selectedTab}
        />
        <!-- <DebugStatePanelValue
            key="ui.autoImportDefaults"
            value={$appState.ui.autoImportDefaults}
        /> -->

        <hr />

        <!-- models -------------------------------------------------------- -->

        <DebugStatePanelValue key="models" value={$models} />

        <DebugStatePanelValue
            key="defaultModelName"
            value={$defaultModelName}
        />
        <DebugStatePanelValue key="chatState" value={$chatState} />

        <hr />

        <!-- chat state ---------------------------------------------------- -->

        <DebugStatePanelValue
            key="chatState.preset_id"
            value={$chatState.preset_id}
        />

        <DebugStatePanelValue key="chatState.guid" value={$chatState.guid} />

        <DebugStatePanelValue
            key="chatState.system_prompt"
            value={$chatState.system_prompt}
        />

        <DebugStatePanelValue
            key="chatState.model_name"
            value={$chatState.model_name}
        />

        <DebugStatePanelValue
            key="chatState.values"
            value={$chatState.values}
        />

        <DebugStatePanelValue key="chatState.title" value={$chatState.title} />

        <hr />

        <!-- chat pending -------------------------------------------------- -->

        <DebugStatePanelValue
            key={`responseInProgress`}
            value={$responseInProgress}
            forceExpand
            condenseLabel
        />

        <DebugStatePanelValue
            key={`PndResp`}
            value={$pendingResponse}
            forceExpand
            condenseLabel
        />

        <DebugStatePanelValue key={`wasAborted`} value={$wasAborted} />

        <hr />

        <!-- chat timeline ------------------------------------------------- -->

        {#each $chatTimeline as entry, index}
            <DebugStatePanelValue
                key={`Line ${index}`}
                value={entry}
                forceExpand
                condenseLabel
            />
        {/each}
    </div>
{/if}

<style lang="scss">
    #DebugStatePanel {
        position: fixed;
        top: 0;
        right: 0;
        width: 500px;
        color: black;
        font-size: 0.9em;

        border-top: 1px solid #888;
        flex-direction: column;
        overflow-y: auto;

        hr {
            padding: 0.15em 0;
            background: #333;
        }
    }
</style>
