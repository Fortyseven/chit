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
    class="grid p-2 text-4xl transition-colors duration-300 rounded-lg cursor-pointer bg-neutral-500 place-content-center hover:bg-neutral-400"
    class:bg-white={menuId === $appState.ui.selectedTab ? 'is-active' : ''}
    title={label}
    alt={label}
>
    <i class="mi-{icon}"></i>
</div>
