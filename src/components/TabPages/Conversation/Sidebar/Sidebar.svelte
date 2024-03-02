<script>
    // import LLM_Settings from './DEACTIVATED.LLM_Settings.svelt';
    import { isSidebarOpen } from '../../../../stores/stores_ui';

    const closeSidebar = (e) => {
        if (e.key === 'Escape') {
            $isSidebarOpen = false;
            window.removeEventListener('keydown', closeSidebar);
            e.stopPropagation();
            e.preventDefault();
        }
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
<div class="wrapper">
    <div class="transparent-background" class:isOpen={$isSidebarOpen}></div>
    <div
        id="Sidebar"
        class:isOpen={$isSidebarOpen}
        on:click={() => {
            onClick();
        }}
    >
        <div class="sidebar-contents" class:isOpen={$isSidebarOpen}>
            <div class="close"><button class="delete is-large"></button></div>
            <!-- <LLM_Settings /> -->
        </div>
    </div>
</div>

<style lang="scss">
    #Sidebar {
        position: absolute;
        top: 0;
        width: 50vw;
        height: 100%;
        background-color: #1a1a1a;
        box-shadow: none;
        transform: translateX(calc(-50vw + 1em));
        transition: all 0.25s ease-in-out;
        padding: 1em;
        z-index: 999;

        &.isOpen {
            transform: translateX(-0.5em);
            box-shadow: 0 0 20px black;
        }

        .close {
            position: absolute;
            right: 1em;
        }
        .sidebar-contents {
            opacity: 0;
            transition: all 0.5s ease-in-out;
            &.isOpen {
                opacity: 1;
            }
        }
    }
    .wrapper {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;

        .transparent-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.6);
            z-index: 1;
            // transition: all 0.25s ease-in-out;
            display: none;
            &.isOpen {
                display: block;
            }
        }
    }
</style>
