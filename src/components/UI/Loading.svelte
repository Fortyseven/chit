<div class="m-auto loader"></div>

<style lang="scss">
    /* HTML: <div class="loader"></div> */
    .loader {
        width: 40px;
        aspect-ratio: 1;
        $c: linear-gradient($accent-color 0 0);
        $r1: radial-gradient(farthest-side at bottom, $accent-color 93%, #0000);
        $r2: radial-gradient(farthest-side at top, $accent-color 93%, #0000);
        background: $c, $r1, $r2, $c, $r1, $r2, $c, $r1, $r2;
        background-repeat: no-repeat;
        animation: l2 1s infinite alternate;
    }
    @keyframes l2 {
        0%,
        25% {
            background-size:
                8px 0,
                8px 4px,
                8px 4px,
                8px 0,
                8px 4px,
                8px 4px,
                8px 0,
                8px 4px,
                8px 4px;
            background-position:
                0 50%,
                0 calc(50% - 2px),
                0 calc(50% + 2px),
                50% 50%,
                50% calc(50% - 2px),
                50% calc(50% + 2px),
                100% 50%,
                100% calc(50% - 2px),
                100% calc(50% + 2px);
        }
        50% {
            background-size:
                8px 100%,
                8px 4px,
                8px 4px,
                8px 0,
                8px 4px,
                8px 4px,
                8px 0,
                8px 4px,
                8px 4px;
            background-position:
                0 50%,
                0 calc(0% - 2px),
                0 calc(100% + 2px),
                50% 50%,
                50% calc(50% - 2px),
                50% calc(50% + 2px),
                100% 50%,
                100% calc(50% - 2px),
                100% calc(50% + 2px);
        }
        75% {
            background-size:
                8px 100%,
                8px 4px,
                8px 4px,
                8px 100%,
                8px 4px,
                8px 4px,
                8px 0,
                8px 4px,
                8px 4px;
            background-position:
                0 50%,
                0 calc(0% - 2px),
                0 calc(100% + 2px),
                50% 50%,
                50% calc(0% - 2px),
                50% calc(100% + 2px),
                100% 50%,
                100% calc(50% - 2px),
                100% calc(50% + 2px);
        }
        95%,
        100% {
            background-size:
                8px 100%,
                8px 4px,
                8px 4px,
                8px 100%,
                8px 4px,
                8px 4px,
                8px 100%,
                8px 4px,
                8px 4px;
            background-position:
                0 50%,
                0 calc(0% - 2px),
                0 calc(100% + 2px),
                50% 50%,
                50% calc(0% - 2px),
                50% calc(100% + 2px),
                100% 50%,
                100% calc(0% - 2px),
                100% calc(100% + 2px);
        }
    }
</style>
