<script>
    import LLM_Settings from './LLM_Settings.svelte';
    import { isSidebarOpen } from '../../../../stores/stores_ui';

    const closeSidebar = (e) => {
        if (e.key === 'Escape') {
            $isSidebarOpen = false;
            window.removeEventListener('keydown', closeSidebar);
        }
        e.stopPropagation();
    };

    function onClick() {
        if (!$isSidebarOpen) {
            $isSidebarOpen = true;
            window.addEventListener('keydown', closeSidebar);
        }
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    id="Sidebar"
    class:isOpen={$isSidebarOpen}
    on:click={() => {
        onClick();
    }}
>
    <div class="close"><button class="delete is-large"></button></div>
    <LLM_Settings />
</div>

<style lang="scss">
    #Sidebar {
        position: absolute;
        top: 0;
        width: 512px;
        height: 100%;
        background-color: #111e;
        box-shadow: none;
        transform: translateX(-512px);
        transition: all 0.25s ease-in-out;
        padding: 1em;

        &.isOpen {
            transform: translateX(-0.5em);
            box-shadow: 0 0 20px black;
        }

        .close {
            position: absolute;
            right: 1em;
        }
    }
</style>
