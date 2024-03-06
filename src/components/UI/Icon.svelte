<script>
    export let icon;
    export let label = undefined;
    export let color = undefined;
</script>

{#if label}
    <i class="mi-{icon} with-text" style:color>{label}</i>
{:else}
    <i class="mi-{icon}" style:color />
{/if}
