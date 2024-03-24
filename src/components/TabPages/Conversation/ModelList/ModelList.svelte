<script>
    import { appState, models } from '$stores/stores';
    import { chatState } from '$stores/chatState';

    import { updateModelDetails } from '$lib/api/api';
    import ModelListControls from './ModelListControls.svelte';

    // let isOpen = false;

    async function onModelSelect() {
        //
    }
</script>

<div class="model-list-container">
    <div id="ModelsDropdown">
        <label>Model</label>
        <div class="flex">
            <select
                bind:value={$chatState.model_name}
                on:change={(e) => onModelSelect()}
                class="w-full text-white bg-black mr-4"
            >
                {#each $models as model, index}
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <option value={model.name}>
                        {model.name} - ({model.details.parameter_size}, {model
                            .details.quantization_level})
                    </option>
                {/each}
            </select>
            <div class="model-list-controls grid place-content-center">
                <ModelListControls />
            </div>
        </div>
    </div>
    <!-- <div class="bottom-row">
        <label>
            Auto import defaults: <input
                type="checkbox"
                bind:checked={$appState.ui.autoImportDefaults}
            />
        </label>
    </div> -->
</div>
