import { errorMessage } from '../stores/stores';
import { pb } from './pocketbase.js';
import { mergeDeep } from './utils.js';

const PRESET_TEMPLATE = {
    id: undefined,
    title: '',
    system: '',
    prompt: '',
    model_name: '',
    options: {
        //
    },
    tags: []
};

export async function getPresets() {
    // TODO: maybe we can just pull the columns
    // we need, but for now we'll brute force it

    let results = await pb.collection('presets').getFullList();

    return results.map((preset) => {
        return {
            id: preset.id,
            model_name: preset.model_name,
            title: preset.title
        };
    });
}

export async function loadPreset(id) {
    let result = await pb.collection('presets').getOne(id);

    return mergeDeep(PRESET_TEMPLATE, result);
}

export function savePreset(preset_candidate) {
    let data = mergeDeep(PRESET_TEMPLATE, preset_candidate);
    let isNew = false;

    if (data.id === undefined) {
        isNew = true;
    }

    // let's do some validation

    if (!data.title) {
        throw new Error('A title is required');
    }

    if (!data.model_name) {
        throw new Error('A model name is required');
    }

    if (!data.system) {
        throw new Error('A system prompt is required');
    }

    // on the backend we just treat this like a regular
    // comma separated string; nothing fancy yet; later we
    // might turn this into a proper database relationship

    if (Array.isArray(data.tags)) {
        data.tags = data.tags.join(',');
    }

    try {
        console.log('➡ Final data:', data);

        if (isNew) {
            pb.collection('presets').create(data);
        } else {
            pb.collection('presets').update(data.id, data);
        }
    } catch (e) {
        errorMessage.set(e.message);
    }
}

function loadPresetFromKoboldJSON(json) {
    //
}
