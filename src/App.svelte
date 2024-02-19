<script>
    import { onMount } from 'svelte';
    import Conversation from './components/Conversation/Conversation.svelte';
    import Sidebar from './components/Sidebar/Sidebar.svelte';

    import { init } from './lib/init';

    onMount(async () => {
        console.log('onMount');
        await init();
    });
</script>

<div class="container">
    <div class="sidebar">
        <Sidebar />
    </div>
    <div class="content">
        <Conversation />
    </div>
</div>

<style lang="scss">
    .container {
        height: 100%;
        border: 1px solid gold;
        display: grid;
        grid-template-columns: 1fr 3fr;
        padding: 1em;
        gap: 1em;

        .sidebar {
            width: 300px;
            height: 100%;
            background-color: #333;
        }

        .content {
            height: 90vh;
        }
    }
</style>
