<script>
    import Icon from '$components/UI/Icon.svelte';
    import { systemPromptTemplated } from '$stores/chatState';
    import { userVariables, sysVariables } from '$stores/stores';

    let new_key = '';
    let new_value = '';

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

<div class="settings">
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

    <div class="my-4"></div>

    <div class="flex">
        <input
            class="flex-shrink w-1/4"
            type="text"
            bind:this={newKeyEl}
            bind:value={new_key}
            on:keydown={(ev) => {
                if (ev.key === 'Enter') newValueEl.focus();
            }}
        />
        <div class="flex-none w-4 text-bold content-center text-center">=</div>
        <input
            class="flex-grow w-1/2"
            type="text"
            bind:this={newValueEl}
            bind:value={new_value}
            on:keydown={(ev) => {
                if (ev.key === 'Enter') {
                    addNew();
                    newKeyEl.focus();
                }
            }}
        />
        <button class="w-6 flex-none content-center text-red-500 pl-2">
            <button
                on:click={() => {
                    addNew();
                    newKeyEl.focus();
                }}
            >
                <Icon icon="add" />
            </button>
        </button>
    </div>

    <hr class="mt-6 opacity-25" />

    <h3 class="py-4 text-xl">
        <Icon color="var(--accent-color)" icon="eye" /> Preview
    </h3>

    <div
        class="overflow-scroll max-h-[500px] bg-core-color-darker5 p-2 resize- text-accent-color-lighter3"
    >
        {$systemPromptTemplated}
    </div>
</div>

<style lang="scss">
    .settings {
        width: 100%;
        margin: auto;

        input {
            background-color: var(--core-color-darker2, #f0f);
        }
    }
</style>
