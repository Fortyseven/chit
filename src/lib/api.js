import { get } from 'svelte/store';
import { models } from '../stores/stores';

export const API_ENDPOINT = 'http://localhost:11434';

export const OL_listLocalModels = async () => {
    const response = await fetch(`${API_ENDPOINT}/api/tags`);
    return response.json();
};

export const refreshModelList = async () => {
    console.log('Refreshing models');
    const response = await OL_listLocalModels();
    models.set(response.models);
    console.log('Models: ', get(models));
};
