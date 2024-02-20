<script>
    import ConversationContent from './ConversationContent.svelte';
    import InputBox from './InputBox.svelte';
    import ModelList from './ModelList.svelte';

    $: content = 'Hello, world!';
</script>

<div class="container">
    <div class="model-list"><ModelList /></div>
    <div class="content has-background-black-ter">
        <ConversationContent />
    </div>
    <div class="chat-input">
        <InputBox />
    </div>
</div>

<style lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: 0.5em;

        .model-list {
            flex: none;
        }
        .content {
            flex: 1 1 auto;
            background-color: var(--color-bg-1);
            border-radius: 10px;
            padding: 1em;
            margin: 0;
        }
        .chat-input {
            flex: none;
        }
    }
</style>
