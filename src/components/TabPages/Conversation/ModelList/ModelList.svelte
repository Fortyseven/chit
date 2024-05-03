<script>
    import { models } from '$stores/stores';
    import { chatState } from '$stores/chatState';

    import ModelListControls from './ModelListControls.svelte';

    // let isOpen = false;

    async function onModelSelect() {
        //
    }
</script>

<div class="model-list-container w-full">
    <div id="ModelsDropdown">
        <div class="flex">
            <select
                bind:value={$chatState.model_name}
                on:change={(e) => onModelSelect()}
                class="flex-auto mr-4 px-2 bg-core-color-darker3 text-accent-color-lighter3"
                style="width: 100% !important;"
            >
                {#each $models as model, index}
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
</div>
