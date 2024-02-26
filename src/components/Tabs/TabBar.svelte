<script>
    import { selectedTab } from '../../stores/stores';
    import Icon from '../UI/Icon.svelte';

    const TABS = [
        ['Chat', 'chat', 'message'],
        ['Modelfiles', 'modelfiles', 'comment'],
        ['Settings', 'settings', 'settings']
    ];
</script>

<div class="tabs is-centered">
    <ul>
        {#each TABS as [label, tab, icon_name]}
            <li class={tab === $selectedTab ? 'is-active' : ''}>
                {#if icon_name}
                    <a on:click={() => ($selectedTab = tab)}>
                        <Icon icon={icon_name} {label} />
                    </a>
                {:else}
                    <a on:click={() => ($selectedTab = tab)}>{label}</a>
                {/if}
            </li>
        {/each}
    </ul>
</div>
