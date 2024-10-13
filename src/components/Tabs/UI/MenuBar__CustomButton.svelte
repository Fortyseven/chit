<script>
    import { appState } from '$stores/stores';

    export let icon;
    export let emoji;
    export let menuId;
    export let label;
    export let onclick;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    on:click={onclick}
    class="grid w-fit p-1 text-4xl transition-colors duration-300 rounded-lg cursor-pointer bg-core-color place-content-center w-full hover:bg-core-color-lighter2"
    class:bg-core-color-lighter1={menuId === $appState.ui.selectedTab
        ? 'is-active'
        : ''}
    title={label}
    alt={label}
    {...$$restProps}
>
    {#if emoji}
        <span class="text-4xl w-full text-center m-auto">{emoji}</span>
    {:else}
        <i class="mi-{icon}"></i>
    {/if}
</div>
