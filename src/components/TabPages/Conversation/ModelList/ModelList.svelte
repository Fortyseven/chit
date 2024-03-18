<script>
    import { appState, model_favorites, models } from '$stores/stores';
    import { chat_state } from '$stores/chat_state';

    import { updateModelDetails } from '$lib/api/api';

    // let isOpen = false;

    async function onClick() {
        // $chat_state.model_name = model_name;
        // isOpen = false;

        if ($appState.ui.autoImportDefaults) {
            await updateModelDetails($chat_state.model_name);
        }
    }

    function isInFavorites(modelName) {
        return $model_favorites.includes(modelName);
    }

    function toggleFavorite(modelName) {
        if (isInFavorites(modelName)) {
            $model_favorites = $model_favorites.filter(
                (name) => name !== modelName
            );
        } else {
            $model_favorites = [...$model_favorites, modelName];
        }
    }

    // // bind escape to close isOpen
    // window.addEventListener('keydown', (e) => {
    //     if (e.key === 'Escape') {
    //         isOpen = false;
    //     }
    // });

    let favorites = [];
    let non_favorites = [];
    let final_model_list = [];
    $: {
        non_favorites = $models.filter(
            (model) => !$model_favorites.includes(model.name)
        );
        non_favorites.sort();
        favorites = $models.filter((model) =>
            $model_favorites.includes(model.name)
        );
        favorites.sort();

        final_model_list = [...favorites, ...non_favorites];
    }
</script>

<div class="model-list-container">
    <div id="ModelsDropdown">
        <label>Model</label>
        <select
            bind:value={$chat_state.model_name}
            on:change={(e) => onClick()}
            class="w-full px-4 py-2 mb-2 text-white bg-black"
        >
            {#each final_model_list as model, index}
                <!-- svelte-ignore a11y-missing-attribute -->
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <option value={model.name}>
                    {model.name} - ({model.details.parameter_size}, {model
                        .details.quantization_level})
                </option>
                <!-- <div class="icon-favorite">
                    <button
                        title="Toggle Favorite"
                        on:click={() => toggleFavorite(model.name)}
                        style:color={isInFavorites(model.name)
                            ? 'white'
                            : '#666'}
                    >
                        <Icon icon="bookmark" />
                    </button>
                </div> -->
                <!-- </div> -->
            {/each}
        </select>
        <!-- <div class="model-list-controls">
            <ModelListControls />
        </div> -->
    </div>
    <div class="bottom-row">
        <label>
            Auto import defaults: <input
                type="checkbox"
                bind:checked={$appState.ui.autoImportDefaults}
            />
        </label>
    </div>
</div>
