<script>
    import { onDestroy, onMount } from 'svelte';

    import * as stores from '$stores/stores';
    import * as stores_ui from '$stores/stores_ui';
    import * as stores_chat_state from '$stores/chat_state';

    import DebugStatePanelValue from './DebugStatePanelValue.svelte';

    /* Make these stand out in the panel. For now we're just sticking
       a highlight class on them. */
    /* TODO: Make this configurable from the component prop side. */
    const highlightStores = [];

    /* Do not show these stores on the panel. */
    /* TODO: Make this configurable from the component prop side. */
    const hideStores = [];

    /* Always expand these stores by default. */
    /* TODO: Make this configurable from the component prop side. */
    const alwaysExpand = [];

    let store_subs = {};
    let visible = false;

    const kbHandler = (e) => {
        if (e.key === '`' && e.ctrlKey) {
            visible = !visible;
        }
    };

    $: total_stores = {
        ...stores,
        ...stores_ui,
        ...stores_chat_state
    };

    onMount(() => {
        Object.keys(total_stores)
            .filter((store) => !hideStores.includes(store))
            .forEach((store) => {
                if (!total_stores[store].subscribe) {
                    // delete stores[store];
                } else {
                    total_stores[store].subscribe((value) => {
                        store_subs[store] = getTextRep(value);
                    });
                }
            });

        window.addEventListener('keydown', kbHandler);
    });
    onDestroy(() => {
        Object.keys(stores).forEach((store) => {
            if (typeof total_stores[store].unsubscribe === 'function') {
                total_stores[store].unsubscribe();
            }
        });

        window.removeEventListener('keydown', kbHandler);
    });

    function getTextRep(value) {
        return value;
    }
</script>

{#if visible}
    <div id="DebugStatePanel">
        {#each Object.keys(store_subs) as store}
            <DebugStatePanelValue
                key={store}
                value={store_subs[store]}
                forceExpand={alwaysExpand.includes(store)}
                highlight={highlightStores.includes(store)}
            />
        {/each}
    </div>
{/if}

<style lang="scss">
    /* slide in from bottom animation for debug-state-panel */

    #DebugStatePanel {
        // animation: slide-in 0.25s ease-in-out;
        position: fixed;
        z-index: 99999;
        left: 0;
        top: 0;
        width: 600px;
        height: 100%;
        color: black;
        font-size: 0.9em;
        box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
        border-top: 1px solid #888;
        flex-direction: column;
        overflow-y: auto;

        /* dynamic grid from 1 to 6 columns */
    }

    // @keyframes slide-in {
    //     0% {
    //         transform: translateX(0%);
    //     }
    //     100% {
    //         transform: translateX(100%);
    //     }
    // }
</style>
