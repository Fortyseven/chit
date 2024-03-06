<script>
    // @ts-nocheck

    import { onMount } from 'svelte';
    import { get } from 'svelte/store';

    import { chat_state } from '$stores/chat_state.js';

    import ModelList from '../../ModelList/ModelList.svelte';
    // import * as Storages from '$stores/stores.js';

    onMount(() => {
        console.log('chat_state', get(chat_state));
    });
</script>

<!-- {@debug chat_state} -->
<div class="model-list"><ModelList /></div>
<hr />
{#if $chat_state}
    <ul>
        {#each Object.keys(get(chat_state).values) as key}
            <li>
                <label>{key}</label>
                <input bind:value={$chat_state.values[key]} />
            </li>
        {/each}
    </ul>
{/if}
<hr />

<style lang="scss">
    ul {
        list-style: none;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        margin: auto;
    }

    li {
        flex: 1 1 auto;
        margin: 0;
        padding: 0;
        display: flex;
        label {
            display: block;
            margin-bottom: 0.5em;

            width: 6.5em;
        }

        input {
            width: 4em;
            height: 2em;
            font-family: monospace !important;
        }
    }
</style>
