// @ts-nocheck

import { chatState } from '$stores/chatState';
import { appState } from '$stores/stores';
import { derived, get, writable } from 'svelte/store';

// key value pairs
export const userVariables = writable([
    {
        key: 'user',
        value: 'Human'
    },
    {
        key: 'char',
        value: 'Assistant'
    }
]);

export const sysVariables = writable([
    {
        key: 'date',
        desc: 'The current date.',
        value: () => {
            return new Date().toLocaleDateString();
        }
    }
]);

export const templateVariables = writable([]);

export const systemPromptTemplateTokens = derived(chatState, ($chatState) => {
    let tokens = $chatState.system_prompt.match(/{{\w+}}/g);

    if (!tokens) {
        return [];
    }

    tokens = tokens.map((token) => token.slice(2, -2));

    // remove any present in userVariables or sysVariables

    const uvars = get(userVariables).map((uv) => uv.key);
    const svars = get(sysVariables).map((sv) => sv.key);
    // const templateVariables = get(templateVariables).map((tv) => tv.key);

    tokens = tokens.filter((token) => {
        return !uvars.includes(token) && !svars.includes(token);
    });

    return [...new Set(tokens)];
});

export const systemPromptTemplated = derived(
    [chatState, appState, userVariables, sysVariables, templateVariables],
    ([
        $chatState,
        $appState,
        $userVariables,
        $sysVariables,
        $templateVariables
    ]) => {
        let system_prompt = $chatState.system_prompt;

        for (const uvar of $userVariables) {
            system_prompt = system_prompt.replaceAll(
                '{{' + uvar.key + '}}',
                uvar.value
            );
        }

        for (const svar of $sysVariables) {
            // if svar.value is a function, get the value
            let value =
                svar.value instanceof Function ? svar.value() : svar.value;
            system_prompt = system_prompt.replaceAll(
                '{{' + svar.key + '}}',
                value
            );
        }
        // debugger;
        for (const tvar of get(templateVariables)) {
            if (tvar.value) {
                system_prompt = system_prompt.replaceAll(
                    '{{' + tvar.key + '}}',
                    tvar.value
                );
            }
        }

        return system_prompt;
    }
);

export function refreshTemplateVars() {
    const tlv = get(templateVariables);
    const template_tokens = get(systemPromptTemplateTokens);

    for (const tok of template_tokens) {
        const index = tlv.findIndex((tv) => tv.key === tok);

        if (index === -1) {
            templateVariables.update((tv) => {
                tv.push({ key: tok, value: '' });
                return tv;
            });
        }
    }
}

export function cleanupTemplateVars() {
    // cull templateVariables that are not in tlv
    const template_tokens = get(systemPromptTemplateTokens);

    templateVariables.update((t) =>
        t.filter((tv) => {
            return template_tokens.includes(tv.key);
        })
    );
}

export const templateIncomplete = derived(
    [templateVariables, systemPromptTemplateTokens],
    ([$templateVariables, $systemPromptTemplateTokens]) => {
        if ($systemPromptTemplateTokens && $systemPromptTemplateTokens.length) {
            return !!$templateVariables.filter((tv) => {
                return $systemPromptTemplateTokens.includes(tv.key);
            });
        }
        return false;
    }
);
