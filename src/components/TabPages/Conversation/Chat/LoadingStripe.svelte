<script>
    import { responseInProgress } from '$lib/api/api';
</script>

<div class="loading-stripe" class:isLoading={$responseInProgress}></div>

<style lang="scss">
    .loading-stripe {
        width: 100%;
        height: 100%;
        max-height: 0.25em !important;
        background-color: #300;
        border-radius: 10px;
        max-height: 0.25em !important;

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
