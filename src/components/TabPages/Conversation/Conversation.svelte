<script>
    import StatusBar from './StatusBar/StatusBar.svelte';
    import Timeline from './Timeline/Timeline.svelte';
</script>

<div class="chat-content">
    <div class="conversation">
        <Timeline />
    </div>
    <StatusBar />
</div>

<style lang="scss">
    .chat-content {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        gap: 0.5em;

        .conversation {
            flex: auto;
            width: 100%;
            height: 100%;
        }
    }
</style>
