<script>
    import { isInferring } from '../../../../stores/stores';

    export let pendingIndex = null;
    export let index;
    export let line;
</script>

<div class="user" class:loading={$isInferring}>
    {line.content}
</div>

<style lang="scss">
    .user {
        &::before {
            content: '> ';
            font-weight: bold;
        }
    }
</style>
