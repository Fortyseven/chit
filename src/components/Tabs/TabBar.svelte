<script>
    import { appState } from '$stores/stores_ui';
    import Icon from '../UI/Icon.svelte';

    const TABS = [
        ['Chat', 'chat', 'message'],
        ['Prompts', 'prompts', 'pen'],
        ['Modelfiles', 'modelfiles', 'comment'],
        ['Settings', 'settings', 'settings']
    ];
</script>

<div class="tabs is-fullwidth is-boxed is-">
    <ul>
        {#each TABS as [label, tab, icon_name]}
            <li class={tab === $appState.selectedTab ? 'is-active' : ''}>
                {#if icon_name}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <a on:click={() => ($appState.selectedTab = tab)}>
                        <Icon icon={icon_name} {label} />
                    </a>
                {:else}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <a on:click={() => ($appState.selectedTab = tab)}>
                        {label}
                    </a>
                {/if}
            </li>
        {/each}
    </ul>
</div>
