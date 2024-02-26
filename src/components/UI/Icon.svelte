<script>
    export let icon;
    export let label = undefined;
</script>

{#if label}
    <i class="mi-{icon} with-text">{label}</i>
{:else}
    <i class="mi-delete" />
{/if}
