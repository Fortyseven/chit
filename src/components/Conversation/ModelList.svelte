<script>
    import { fade } from 'svelte/transition';
    import {
        currentModel,
        currentModelIndex,
        models
    } from '../../stores/stores';

    let isOpen = false;

    function onClick(index) {
        $currentModelIndex = index;
        isOpen = false;
    }

    // bind escape to close isOpen
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            isOpen = false;
        }
    });
</script>

<div class="model-list dropdown" class:is-active={isOpen}>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="dropdown-trigger" on:click={() => (isOpen = !isOpen)}>
        <button
            class="button"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
        >
            <span>{$currentModel?.name || '--'}</span>
            <span class="icon is-small">
                <i class="fas fa-angle-down" aria-hidden="true"></i>
            </span>
        </button>
    </div>
    <div class="dropdown-menu" role="menu" transition:fade>
        <div class="dropdown-content">
            {#each $models as model, index}
                <!-- svelte-ignore a11y-missing-attribute -->
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div on:click={() => onClick(index)} class="dropdown-item">
                    <div class="name">
                        {model.name}
                    </div>
                    <div class="details">
                        ({model.details.parameter_size}, {model.details
                            .quantization_level}
                        )
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>

<!-- <select>
        {#each $models as model}
            <option value={model.id}>{model.name}</option>
        {/each}
    </select> -->
<style lang="scss">
    .model-list {
        .dropdown-trigger,
        .dropdown-trigger button {
            width: 100%;
            border: 1px dashed red;
        }
    }
</style>
