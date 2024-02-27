<script>
    import Timeline from './Timeline.svelte';
    import Sidebar from './Sidebar/Sidebar.svelte';
</script>

<div class="chat-content">
    <div class="sidebar has-background-black-ter">
        <Sidebar />
    </div>
    <div class="conversation">
        <Timeline />
    </div>
</div>

<style lang="scss">
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
</style>
