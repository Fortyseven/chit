<script>
    import { chatState } from '$stores/chatState';
    import {
        systemPromptTemplateTokens,
        templateVariables
    } from '$stores/templates';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    const _local_vars = writable({});

    // We need to update the templateVariables store when the local vars
    // change; the template won't change while we're on this page, but
    // templateVariables can change elsewhere. So we need to keep it in sync.
    _local_vars.subscribe((val) => {
        for (const token in val) {
            templateVariables.update((templateVar) => {
                const i = templateVar.findIndex((tvi) => tvi?.key === token);

                if (i < 0) {
                    templateVar.push({
                        key: token,
                        value: val[token]
                    });
                } else {
                    templateVar[i].value = val[token];
                }

                return templateVar;
            });
        }
    });

    onMount(() => {
        // keep the local vars in sync with the templateVariables when we
        // return to this page
        for (const token of $templateVariables) {
            _local_vars.update((lv) => {
                lv[token.key] = token.value;
                return lv;
            });
        }
    });

    function refreshTemplateVariables() {
        let matches = $chatState.system_prompt.match(/{{[\w]+}}/g);

        console.log('matches', matches);
    }

    onMount(() => {
        console.log('systemPromptTemplateTokens', $systemPromptTemplateTokens);
    });
</script>

<div class="flex flex-col gap-y-4 w-full">
    {#each $systemPromptTemplateTokens as tvar_token}
        <div class="flex flex-col">
            <div>{tvar_token}</div>
            <textarea
                class="w-full h-24"
                type="text"
                bind:value={$_local_vars[tvar_token]}
            />
        </div>
    {/each}
</div>

<style lang="scss">
    input,
    textarea {
        background-color: var(--core-color-darker2, #f0f);
        width: 100%;
    }
</style>
