<script>
    import { model_favorites, models } from '$stores/stores';
    import { chat_state } from '$stores/chat_state';
    import { appState } from '$stores/stores_ui';

    import ModelListControls from './ModelListControls.svelte';
    import Icon from '/src/components/UI/Icon.svelte';

    import { updateModelDetails } from '$lib/api/api';

    let isOpen = false;

    async function onClick(model_name) {
        $chat_state.model_name = model_name;
        isOpen = false;

        if ($appState.autoImportDefaults) {
            await updateModelDetails(model_name);
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

    // bind escape to close isOpen
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            isOpen = false;
        }
    });

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
    <div class="top-row">
        <div class="model-list dropdown" class:is-active={isOpen}>
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="dropdown-trigger" on:click={() => (isOpen = !isOpen)}>
                <button
                    class="button"
                    aria-haspopup="true"
                    aria-controls="dropdown-menu"
                >
                    <span>{$chat_state.model_name || '--'}</span>
                    <span class="icon is-small">
                        <i class="fas fa-angle-down" aria-hidden="true"></i>
                    </span>
                </button>
            </div>
            <div class="dropdown-menu" role="menu">
                <div class="dropdown-content">
                    {#each final_model_list as model, index}
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <div
                            on:click={() => onClick(model.name)}
                            class="dropdown-item"
                        >
                            <div
                                class="name"
                                style:color={isInFavorites(model.name)
                                    ? 'white'
                                    : ''}
                            >
                                {model.name}
                            </div>
                            <div class="details">
                                ({model.details.parameter_size}, {model.details
                                    .quantization_level}
                                )
                            </div>
                            <div class="icon-favorite">
                                <button
                                    title="Toggle Favorite"
                                    on:click={() => toggleFavorite(model.name)}
                                    style:color={isInFavorites(model.name)
                                        ? 'white'
                                        : '#666'}
                                >
                                    <Icon icon="bookmark" />
                                </button>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
        <div class="model-list-controls">
            <ModelListControls />
        </div>
    </div>
    <div class="bottom-row">
        <label>
            Auto import defaults: <input
                type="checkbox"
                bind:checked={$appState.autoImportDefaults}
            />
        </label>
    </div>
</div>

<!-- <select>
        {#each $models as model}
            <option value={model.id}>{model.name}</option>
        {/each}
    </select> -->
<style lang="scss">
    .model-list-container {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
        width: auto;

        .top-row,
        .bottom-row {
            flex: auto;
            display: flex;
            flex-direction: row;
            gap: 0.5em;
            width: auto;
        }

        .top-row {
            .model-list {
                flex: 1 1 auto;
            }

            .model-list-controls {
                flex: 0 0 auto;
            }

            .model-list {
                .dropdown-menu,
                .dropdown-trigger,
                .dropdown-trigger button {
                    width: 100%;
                }

                .dropdown-menu {
                    width: 350px;
                    position: fixed;
                    z-index: 999;
                    top: 125px;
                    left: unset;
                    box-shadow: 0 15px 30px #0008;
                }
            }

            .dropdown-item {
                display: flex;
                &:hover {
                    background-color: #fff1;
                    cursor: pointer;
                }
                .name {
                    flex: auto;
                }
                .details {
                    flex: none;
                    color: #777;
                    font-size: 0.8em;
                }
            }

            .icon-favorite {
                margin-left: 0.5em;
                button {
                    background: transparent;
                    color: white;
                    border: none;
                }
                &.is-favorite {
                    //
                }
            }
        }

        .bottom-row {
            flex: 1 1 auto;
            display: flex;
            flex-direction: row;
            gap: 0.5em;
            width: auto;
        }
    }
</style>
