<script>
    import { responseInProgress } from '$lib/api/api';
</script>

<div class="loading-stripe" class:isLoading={$responseInProgress}></div>

<style lang="scss">
    .loading-stripe {
        width: 100%;
        height: 0.35rem;
        background-color: #300;

        &.isLoading {
            animation: cycle 2000s infinite linear;
            background: linear-gradient(25deg, #300 0%, #f00 50%, #300 100%);
        }

        @keyframes cycle {
            0% {
                background-position: 0vw;
            }
            100% {
                background-position: 99999vw;
            }
        }
    }
</style>
