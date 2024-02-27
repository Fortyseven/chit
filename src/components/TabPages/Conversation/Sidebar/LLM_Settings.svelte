<script>
    import { model_settings } from '../../../../stores/stores';

    let chatGroup = 'basic';

    const CHAT_SETTINGS = {
        basic: {
            'Embedding Only': [model_settings, Boolean, false],
            F16KV: [model_settings, Boolean, true],
            'Frequency Penalty': [model_settings, Number, 1.0],
            'Low VRAM': [model_settings, Boolean, false],
            Mirostat: [model_settings, Number, 1],
            'Mirostat Eta': [model_settings, Number, 0.6],
            'Mirostat Tau': [model_settings, Number, 0.8],
            'Num Batch': [model_settings, Number, 2],
            'Num Context': [model_settings, Number, 1024],
            'Repeat Last N': [model_settings, Number, 33],
            'Repeat Penalty': [model_settings, Number, 1.2],
            Seed: [model_settings, Number, 42],
            Stop: [model_settings, Array, ['\n', 'user:']],
            Temperature: [model_settings, Number, 0.8],
            'Top K': [model_settings, Number, 20],
            'Top P': [model_settings, Number, 0.9],
            'Typical P': [model_settings, Number, 0.7]
        },
        adv: {
            'Main GPU': [model_settings, Number, 0],
            'Num GPU': [model_settings, Number, 1],
            'Num GQA': [model_settings, Number, 1],
            'Num Keep': [model_settings, Number, 5],
            'Num Predict': [model_settings, Number, 100],
            'Num Thread': [model_settings, Number, 8],
            Numa: [model_settings, Boolean, false],
            'Penalize New Line': [model_settings, Boolean, true],
            'Presence Penalty': [model_settings, Number, 1.5],
            TFSZ: [model_settings, Number, 0.5],
            'Use Mlock': [model_settings, Boolean, false],
            'Use Mmap': [model_settings, Boolean, true],
            'Vocab Only': [model_settings, Boolean, false]
        }
    };
</script>

<fieldset>
    <legend>Model Settings</legend>
    <form>
        {#each Object.keys(CHAT_SETTINGS[chatGroup]) as setting}
            <label>
                <div>{setting}</div>
                <div>
                    {#if CHAT_SETTINGS[chatGroup][setting][1] === Boolean}
                        <input
                            type="checkbox"
                            bind:checked={CHAT_SETTINGS[chatGroup][setting][2]}
                            class="checkbox"
                        />
                    {:else}
                        <input
                            type="number"
                            step="0.1"
                            bind:value={CHAT_SETTINGS[chatGroup][setting][2]}
                        />
                    {/if}
                </div>
            </label>
        {/each}
    </form>
</fieldset>

<style lang="scss">
    fieldset {
        padding: 1em;
        border: 1px solid #333;
        form {
            display: grid;
            grid-template-columns: 1fr 1fr;
            label {
                font-size: 0.8em;
                display: grid;
                grid-template-columns: 1fr 1fr;
                align-content: flex-start;
                div:first-of-type {
                    // flex: 0 0 8em;
                }
                div:last-of-type {
                    // flex: 1 1 auto;

                    input[type='number'] {
                        width: 7em;
                    }
                }
            }
        }
    }

    // label {
    //     font-size: 0.8em;
    //     display: flex;
    //     align-content: flex-start;
    //     div:first-of-type {
    //         flex: 0 0 8em;
    //     }
    //     div:last-of-type {
    //         flex: 1 1 auto;
    //         input {
    //             width: 7em;
    //         }
    //     }
    // }

    label {
        // display: block;
        // margin: 0.5em 0;
    }

    .checkbox {
        margin-right: 0.5em;
    }
</style>
