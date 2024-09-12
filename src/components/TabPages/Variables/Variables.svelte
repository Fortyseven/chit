<script>
    import TemplateVariables from './TemplateVariables.svelte';

    import Icon from '$components/UI/Icon.svelte';

    import {
        userVariables,
        sysVariables,
        systemPromptTemplated,
        systemPromptTemplateTokens
    } from '$stores/templates';

    let new_key = '';
    let new_value = '';

    let showPreview = true;

    let newKeyEl;
    let newValueEl;

    function addNew() {
        userVariables.update((vars) => {
            console.log('addNew', new_key, new_value);
            vars.push({ key: new_key, value: new_value });
            new_key = '';
            new_value = '';
            return vars;
        });
    }
</script>

<div class="variables-menu">
    <h1 class="text-primary pb-4 text-3xl">Variables</h1>

    <hr class="opacity-25" />

    <h2 class="py-4 text-2xl">
        <Icon color="var(--accent-color)" icon="database" /> System Variables
    </h2>

    {#each $sysVariables as { key, desc }}
        <div class="flex">
            <input class="flex-shrink w-1/4" type="text" value={key} disabled />
            <div class="flex-grow text-bold content-center pl-4">
                {desc}
            </div>
        </div>
    {/each}

    <hr class="opacity-25 mt-5" />

    <h2 class="py-4 text-2xl">
        <Icon color="var(--accent-color)" icon="user" /> User Variables
    </h2>

    <div class="flex flex-col gap-y-4 w-full">
        {#each $userVariables as uvar}
            <div class="flex">
                <input
                    class="flex-shrink w-1/4"
                    type="text"
                    bind:value={uvar.key}
                />
                <div class="flex-none w-4 text-bold content-center text-center">
                    =
                </div>
                <input
                    class="flex-grow w-1/2"
                    type="text"
                    bind:value={uvar.value}
                />
                <button
                    class="w-6 flex-none content-center text-red-500 pl-2"
                    on:click={() => {
                        userVariables.update((vars) => {
                            vars.splice(vars.indexOf(uvar), 1);
                            return vars;
                        });
                    }}
                >
                    <Icon icon="delete" />
                </button>
            </div>
        {/each}
    </div>

    <!-- -------------------------------------------------- -->
    {#if $systemPromptTemplateTokens}
        <hr class="opacity-25 mt-5" />

        <h2 class="py-4 text-2xl">
            <Icon color="var(--accent-color)" icon="document" /> Template Variables
        </h2>

        <TemplateVariables></TemplateVariables>
    {/if}

    <!-- -------------------------------------------------- -->

    <hr class="mt-6 opacity-25" />

    <h3 class="py-4 text-xl">
        <Icon color="var(--accent-color)" icon="eye" /> Preview
    </h3>
    {#if showPreview}
        <textarea
            class="overflow-scroll w-full h-full max-h-64 bg-core-color-darker5 p-2 resize- text-accent-color-lighter3"
            >{$systemPromptTemplated}</textarea
        >
    {/if}
</div>

<style lang="scss">
    .variables-menu {
        width: 100%;
        height: 100%;

        overflow: hidden;
        overflow-y: scroll;

        input,
        textarea {
            background-color: var(--core-color-darker2, #f0f);
        }

        textarea {
            padding: 0.5em;
            font-size: 0.8em;
        }
    }
</style>
