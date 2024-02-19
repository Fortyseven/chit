<script>
    import InputBox from './InputBox.svelte';
    import ModelList from './ModelList.svelte';

    $: content = 'Hello, world!';
</script>

<div class="container">
    <div class="model-list"><ModelList /></div>
    <div class="content">{content}</div>
    <div class="chat-input">
        <InputBox />
    </div>
</div>

<style lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        height: 100%;

        .model-list {
            flex: none;
        }
        .content {
            flex: 1 1 auto;
            background-color: var(--color-bg-1);
            border-radius: 10px;
            padding: 1em;
            border: 1px solid green;
        }
        .chat-input {
            flex: none;
        }
    }
</style>
