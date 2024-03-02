<script>
    import { get } from 'svelte/store';
    import {
        // maingpu_default,
        // numa_default,
        // numgpu_default,
        // numgqa_default,
        // numkeep_default,
        // numpredict_default,
        // numthread_default,
        // penalizenewline_default,
        // presencepenalt_defaulty,
        // ropefrequencybase_default,
        // ropefrequencyscale_default,
        // tfsz_default,
        // usemlock_default,
        // usemmap_default,
        // vocabonly_default,
        embeddingonly_default,
        f16kv_default,
        frequencypenalty_default,
        lowvram_default,
        mirostat_default,
        mirostateta_default,
        mirostattau_default,
        numbatch_default,
        numctx_default,
        repeatlastn_default,
        repeatpenalty_default,
        seed_default,
        stop_default,
        temperature_default,
        topk_default,
        topp_default,
        typicalp_default,
        embeddingonly,
        f16kv,
        frequencypenalty,
        lowvram,
        mirostat,
        mirostateta,
        mirostattau,
        numbatch,
        numctx,
        repeatlastn,
        repeatpenalty,
        seed,
        stop,
        temperature,
        topk,
        topp,
        typicalp
    } from '../../../../stores/stores';

    let chatGroup = 'basic';

    const CHAT_SETTINGS = [
        ['Embedding Only', Boolean, embeddingonly_default],
        ['F16KV', 'f16kv', Boolean, f16kv_default],
        [
            'Frequency Penalty',
            'frequencypenalty',
            Number,
            frequencypenalty_default
        ],
        ['Low VRAM', 'lowvram', Boolean, lowvram_default],
        ['Mirostat', 'mirostat', Number, mirostat_default],
        ['Mirostat Eta', 'mirostateta', Number, mirostateta_default],
        ['Mirostat Tau', 'mirostattau', Number, mirostattau_default],
        ['Num Batch', 'numbatch', Number, numbatch_default],
        ['Num Context', 'numctx', Number, numctx_default],
        ['Repeat Last N', 'repeatlastn', Number, repeatlastn_default],
        ['Repeat Penalty', 'repeatpenalty', Number, repeatpenalty_default],
        ['Seed', 'seed', Number, seed_default],
        ['Stop', 'stop', Array, stop_default],
        ['Temperature', 'temperature', Number, temperature_default],
        ['Top K', 'topk', Number, topk_default],
        ['Top P', 'topp', Number, topp_default],
        ['Typical P', 'typicalp', typicalp_default]
    ];
    // },
    // adv: {
    //     'Main GPU': ['maingpu', Number, 0, maingpu],
    //     'Num GPU': ['numgpu', Number, 1, numgpu],
    //     'Num GQA': ['numgqa', Number, 1, numgqa],
    //     'Num Keep': ['numkeep', Number, 5, numkeep],
    //     'Num Predict': [
    //         'numpredict',
    //         Number,
    //         100,
    //         numpredict
    //     ],
    //     'Num Thread': ['numthread', Number, 8, numthread],
    //     Numa: ['numa', Boolean, false, numa],
    //     'Penalize New Line': [
    //         'penalizenewline',
    //         Boolean,
    //         true,
    //         penalizenewlin
    //     ],
    //     'Presence Penalty': [
    //         'presencepenalty',
    //         Number,
    //         1.5,
    //         presencepenalty
    //     ],
    //     TFSZ: ['tfsz', Number, 0.5],
    //     'Use Mlock': ['usemlock', Boolean, false, usemlock],
    //     'Use Mmap': ['usemmap', Boolean, true, usemmap],
    //     'Vocab Only': [
    //         'vocabonly',
    //         Boolean,
    //         false,
    //         vocabonly
    //     ]

    // const model_stores = (setting) =>
    //     CHAT_SETTINGS.filter(
    //         (key) =>
    //             CHAT_SETTINGS['basic'][setting] ||
    //             CHAT_SETTINGS['adv'][setting] ||
    //             undefined
    //     );

    function resetToDefault(prop) {
        // iterate through the keys of the object
        for (const group_key in CHAT_SETTINGS) {
            for (const setting in CHAT_SETTINGS[group_key]) {
                if (prop === setting) {
                    // debugger;
                    let [prop_name, _type, def_value] =
                        CHAT_SETTINGS[group_key][setting];
                    console.warn(
                        'resetting',
                        setting,
                        'to default: ',
                        def_value
                    );
                    let store = model_settings[prop_name];
                    store.set(def_value);
                    debugger;
                }
            }
        }
    }
</script>

<fieldset>
    <legend>Model Settings</legend>
    <form>
        <div class="setting">
            <label
                >Embedding Only <input
                    type="checkbox"
                    bind:checked={embeddingonly}
                    placeholder={embeddingonly_default}
                /></label
            >
            <label>F16KV <input type="checkbox" /></label>
            <label>Frequency Penalty <input type="number" /></label>
            <label>Low VRAM <input type="checkbox" /></label>
            <label>Mirostat <input type="number" /></label>
            <label>Mirostat Eta <input type="number" /></label>
            <label>Num Batch <input type="number" /></label>
            <label>Num Context <input type="number" /></label>
            <label>Repeat Last N <input type="number" /></label>
            <label>Repeat Penalty <input type="number" /></label>
            <label>Seed <input type="number" /></label>
            <!-- <label>Stop <input type="checkbox" /></label> -->
            <label>Temperature <input type="number" /></label>
            <label>Top K <input type="number" /></label>
            <label>Top P <input type="number" /></label>
            <label>Typical P <input type="number" /></label>

            , frequencypenalty_default, lowvram_default, mirostat_default,
            mirostateta_default, mirostattau_default, numbatch_default,
            numctx_default, repeatlastn_default, repeatpenalty_default,
            seed_default, stop_default, temperature_default, topk_default,
            topp_default, typicalp_default
        </div>
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
