<script>
    export let icon;
    export let label = undefined;
    export let color = undefined;
    export let size = '1em';
</script>

{#if label}
    <i class="mi-{icon}" style:font-size={size} style:color {...$$restProps}>
        {label}
    </i>
{:else}
    <i class="mi-{icon}" style:font-size={size} style:color {...$$restProps} />
{/if}
