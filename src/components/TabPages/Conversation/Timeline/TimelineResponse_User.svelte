<script>
    import { isInferring } from '../../../../stores/stores';

    export let pendingIndex = null;
    export let index;
    export let line;
</script>

<div
    class="user"
    style:font-weight={pendingIndex == index ? 'bold' : 'normal'}
    class:loading={$isInferring}
>
    {line.content}
</div>

<style lang="scss">
    .user {
        &::before {
            content: '> ';
            font-weight: bold;
        }
        // &.loading {
        //     //throbbing animation
        //     animation: pulse 750ms infinite;

        //     @keyframes pulse {
        //         0% {
        //             opacity: 1;
        //         }
        //         50% {
        //             opacity: 0.5;
        //         }
        //         100% {
        //             opacity: 1;
        //         }
        //     }
        // }
    }
</style>
