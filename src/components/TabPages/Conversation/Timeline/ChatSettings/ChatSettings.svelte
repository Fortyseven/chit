<script>
    // @ts-nocheck

    import { onMount } from 'svelte';
    import { get } from 'svelte/store';

    import { chat_state } from '$stores/chat_state.js';
    import { appState } from '$stores/stores';

    import ModelList from '../../ModelList/ModelList.svelte';
    import SystemPromptManager from './SystemPromptManager.svelte';

    let isManagerOpen = false;

    onMount(() => {
        console.log('chat_state', get(chat_state));
    });

    function savePrompt() {
        appState.update((state) => {
            state.savedSystemPrompts.push($chat_state.system_prompt);
            return state;
        });
    }
</script>

<!-- {@debug chat_state} -->
<div class="model-list"><ModelList /></div>
<hr />
{#if $chat_state}
    <ul>
        {#each Object.keys(get(chat_state).values) as key}
            <li>
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>{key}</label>
                <input bind:value={$chat_state.values[key]} />
            </li>
        {/each}
    </ul>
{/if}
<hr />
<div class="system-prompt">
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label>
        System Prompt
        <button on:click={savePrompt}>Add</button>
        <button
            on:click={(ev) => {
                isManagerOpen = true;
                ev.preventDefault();
            }}>Edit</button
        >
    </label>
    <textarea bind:value={$chat_state.system_prompt} placeholder="None" />
    <SystemPromptManager
        isOpen={isManagerOpen}
        onClose={() => {
            isManagerOpen = false;
        }}
    />
</div>
<hr />
<div class="template-prompt">
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label>Template Prompt</label>
    <textarea bind:value={$chat_state.template} />
</div>

<style lang="scss">
    hr {
        padding: 0;
        margin: 1em 0;
    }
    .system-prompt,
    .template-prompt {
        display: flex;
        flex-direction: column;
        label {
            color: white;
            margin-bottom: 0.5em;
        }
        textarea {
            border: none;
            border-radius: 10px;
            height: 6em;
            padding: 0.5em;
            font-family: monospace !important;
            outline: none;
            background-color: #444;
            color: white;
        }
    }
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
