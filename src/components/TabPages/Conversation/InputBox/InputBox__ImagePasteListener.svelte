<script lang="ts">
    import { pastedImage } from '$stores/imageState';
    import { onMount } from 'svelte';

    async function handlePaste(ev: ClipboardEvent) {
        document.addEventListener('paste', async (e) => {
            // e.preventDefault();

            for (const clipboardItem of e.clipboardData?.files) {
                if (clipboardItem.type.startsWith('image/')) {
                    e.preventDefault();
                    console.debug('received image');
                    // $pastedImage = await e.clipboardData?.files[0].text();
                    const file = e.clipboardData?.files[0];
                    $pastedImage = URL.createObjectURL(file);
                }
            }
        });
    }

    function removeImage() {
        $pastedImage = '';
    }

    onMount(() => {
        document.addEventListener('paste', handlePaste);
    });
</script>

{#if $pastedImage}
    <div class="image-bin relative">
        <span class="absolute right-0">
            <button class="button close" on:click={removeImage}>X</button>
        </span>
        <img src={$pastedImage} alt="pasted image" class="max-h-48 m-auto" />
    </div>
{/if}

<style lang="scss">
    .image-bin {
        overflow: hidden;
        background-image: linear-gradient(
            180deg,
            #000,
            var(--accent-color-darker5)
        );
        img {
            box-shadow: 0 0 40px rgba(0, 0, 0, 1);
        }
    }

    button {
        @apply transition-all;
        @apply duration-300;
        @apply rounded-md;

        background-color: var(--accent-color-darker3);

        flex: auto;
        &:disabled {
            opacity: 0.5;
        }
        &:hover {
            opacity: 0.5;
        }
        &.close {
            width: 1em;
        }
    }
</style>
