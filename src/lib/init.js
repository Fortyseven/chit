import { refreshModelList } from './api';
import {
    setLocalStorageSubscriptions,
    syncLocalStorageStores
} from './localStorage_stores';

export async function init() {
    console.log('Initializing app...');

    syncLocalStorageStores();
    setLocalStorageSubscriptions();

    await refreshModelList();
    console.log('...init complete.');
}
