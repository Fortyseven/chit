<script>
    import { appState } from '$stores/stores';

    export let icon;
    export let menuId;
    export let label;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    on:click={() => ($appState.ui.selectedTab = menuId)}
    class="grid p-2 text-4xl transition-colors duration-300 rounded-lg cursor-pointer bg-core-color place-content-center hover:bg-core-color-lighter2"
    class:bg-core-color-lighter1={menuId === $appState.ui.selectedTab
        ? 'is-active'
        : ''}
    title={label}
    alt={label}
    {...$$restProps}
>
    <i class="mi-{icon}"></i>
</div>
